import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 3000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('f2b_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Graceful response handler: NEVER kick the user to /login on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Simply pass the error back so components can use fallback data
    return Promise.reject(error);
  }
);

export default api;
