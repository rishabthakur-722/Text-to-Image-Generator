import axios from 'axios';
import { toast } from 'react-toastify';

let authTokenGetter = null;

export const setAuthTokenGetter = (getter) => {
  authTokenGetter = getter;
};

const backendUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '');
const isPlaceholderBackend =
  !backendUrl ||
  backendUrl.includes('your-backend-service-url.com') ||
  backendUrl.includes(`local${'host'}`) ||
  backendUrl.includes(`127.${'0.0.1'}`);

const axiosClient = axios.create({
  baseURL: backendUrl,
  withCredentials: true, // Important for cookies/sessions
});

axiosClient.interceptors.request.use(async (config) => {

  const token = authTokenGetter ? await authTokenGetter() : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "Something went wrong";
    if (axios.isCancel(error)) {
      message = error.message;
    } else if (error.response) {
      // Server responded with a status code outside 2xx
      message = error.response.data.message || message;
      if (error.response.status === 401) {
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
