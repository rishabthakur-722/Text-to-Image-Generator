import { createContext, useEffect, useState, useCallback } from 'react';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [credit, setCredit] = useState(false);

  const loadCreditsData = useCallback(async () => {
    try {
      if (!token) return;
      const { data } = await axiosClient.get('/api/user/credits', { headers: { token } });
      if (data.success) {
        setCredit(data.credits);
        setUser(data.user);
      }
    } catch (error) {
      // Error handled silently
    }
  }, [token]);

  const generateImage = async (prompt) => {
    try {
      if (!token) {
        toast.error("Session expired. Please login again.");
        return;
      }
      const { data } = await axiosClient.post('/api/image/generate-image', { prompt }, { headers: { token } });
      if (data.success) {
        loadCreditsData();
        return data.resultImage;
      } else {
        toast.error(data.message);
        loadCreditsData();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
  };

  useEffect(() => {
    if (token) {
      loadCreditsData();
    }
  }, [token, loadCreditsData]);

  const value = {
    user, setUser,
    showLogin, setShowLogin,
    token, setToken,
    credit, setCredit,
    loadCreditsData,
    logout,
    generateImage
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;