import axios from 'axios';
import { toast } from 'react-toastify';

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

axiosClient.interceptors.request.use((config) => {
  if (isPlaceholderBackend) {
    throw new axios.Cancel("Production backend URL is not configured.");
  }

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
    if (axios.isCancel(error)) {
      message = error.message;
    } else if (isPlaceholderBackend) {
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
