import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests and attach JWT token if present
api.interceptors.request.use(
  (config) => {
    const userJson = localStorage.getItem('hotelpro_user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (e) {
        console.error('Error parsing stored user token', e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
