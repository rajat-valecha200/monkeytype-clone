import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  // withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

export const login = (credentials) => api.post('/api/auth/login', credentials);
export const signup = (userData) => api.post('/api/auth/register', userData);
export const getCurrentUser = () => api.get('/api/auth/user');
export const createSession = (sessionData) => api.post('/api/sessions', sessionData);
export const getUserSessions = (userId) => api.get(`/api/sessions/${userId}`);
export const getSessionAnalysis = (sessionId) => api.get(`/api/sessions/analysis/${sessionId}`);

export default api;