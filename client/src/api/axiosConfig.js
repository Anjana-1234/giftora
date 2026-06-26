// Import axios to make HTTP requests
import axios from 'axios';

// Create a pre-configured axios instance pointing to our backend server
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// This runs before EVERY request made using "api"
// It automatically attaches the saved JWT token (if one exists) to the request headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;