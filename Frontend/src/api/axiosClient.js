import axios from 'axios';
import { toast } from 'react-toastify';

const backendUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '');

const axiosClient = axios.create({
  baseURL: backendUrl,
  withCredentials: true, // Important for cookies/sessions
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers.token = token;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "Something went wrong";
    if (!backendUrl) {
      message = "Backend URL is not configured.";
    } else if (backendUrl.includes(`local${'host'}`) || backendUrl.includes(`127.${'0.0.1'}`)) {
      message = "Production backend URL is not configured.";
    } else if (error.response) {
      // Server responded with a status code outside 2xx
      message = error.response.data.message || message;
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/';
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
