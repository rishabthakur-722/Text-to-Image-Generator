import { createContext, useEffect, useState, useCallback } from 'react';
import axiosClient from '../api/axiosClient';
import { setAuthTokenGetter } from '../api/axiosClient';
import { useAuth, useClerk, useUser } from '@clerk/clerk-react';
import { toast } from 'react-toastify';

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { user: clerkUser } = useUser();
  const { openSignIn, signOut } = useClerk();
  const [appUser, setAppUser] = useState(null);

  const [credit, setCredit] = useState(false);
  const token = isSignedIn ? 'clerk-session' : '';
  const user = isSignedIn
    ? appUser || {
        name: clerkUser?.fullName || clerkUser?.primaryEmailAddress?.emailAddress || 'User',
      }
    : null;

  const loadCreditsData = useCallback(async () => {
    try {
      if (!isSignedIn) return;
      const { data } = await axiosClient.get('/api/user/credits');
      if (data.success) {
        setCredit(data.credits);
        setAppUser(data.user);
      }
    } catch {
      // Error handled silently
    }
  }, [isSignedIn]);

  const generateImage = async (prompt) => {
    try {
      if (!isSignedIn) {
        toast.error("Please sign in to generate images.");
        openSignIn();
        return;
      }
      const { data } = await axiosClient.post('/api/image/generate-image', { prompt });
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
    setAppUser(null);
    signOut({ redirectUrl: '/' });
  };

  useEffect(() => {
    setAuthTokenGetter(() => (isSignedIn ? getToken() : null));

    return () => setAuthTokenGetter(null);
  }, [getToken, isSignedIn]);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      loadCreditsData();
    } else if (isLoaded && !isSignedIn) {
      setAppUser(null);
      setCredit(false);
    }
  }, [isLoaded, isSignedIn, loadCreditsData]);

  const value = {
    user, setUser: setAppUser,

    token,
    credit, setCredit,
    loadCreditsData,
    logout,
    generateImage,
    openSignIn
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
