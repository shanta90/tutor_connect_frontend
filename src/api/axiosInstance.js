import axios from 'axios';

const api = axios.create({
  baseURL: 'https://tutor-connect-backend.vercel.app/api/v1',
  withCredentials: true, // Crucial for cookie-based auth
});

// Basic response interceptor for unified error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;
