// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Replace with your backend URL
});

// Add a request interceptor to include tokens in headers
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

// Handle refreshing tokens automatically
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post('http://localhost:5000/api/auth/refresh', { token: refreshToken });
        localStorage.setItem('accessToken', data.accessToken);
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (err) {
        console.error('Refresh token expired or invalid', err);
        localStorage.clear();
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

// Reporting API Calls

export const fetchTaskReport = async () => {
  try {
    const response = await api.get('/reports/tasks');
    return response.data;
  } catch (error) {
    console.error('Error fetching task report:', error);
    throw error;
  }
};

export const fetchUserSummaryReport = async () => {
  try {
    const response = await api.get('/reports/user-summary');
    return response.data;
  } catch (error) {
    console.error('Error fetching user summary report:', error);
    throw error;
  }
};

export const generateCustomReport = async (filters) => {
  try {
    const response = await api.post('/reports/custom', filters);
    return response.data;
  } catch (error) {
    console.error('Error generating custom report:', error);
    throw error;
  }
};

export default api;
