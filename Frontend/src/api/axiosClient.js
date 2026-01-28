import axios from 'axios';
import { toast } from 'react-toastify';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // Important for cookies/sessions
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.token = token;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "Something went wrong";
    if (error.response) {
      // Server responded with a status code outside 2xx
      message = error.response.data.message || message;
      if (error.response.status === 401) {
        // Optionally handle unauthorized (e.g., redirect to login)
      }
    } else if (error.request) {
      // Request was made but no response received
      message = "Network Error. Please check your connection.";
    }

    toast.error(message);
    return Promise.reject(error);
  }
);

export default axiosClient;
