import axios from 'axios';

// API Configuration
export const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://localhost:7296/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
};

// Create axios instance
const axiosClient = axios.create(API_CONFIG);

// Request interceptor to add auth token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common responses and auto token refresh
axiosClient.interceptors.response.use(
  (response) => response.data, // Return BaseResponse<T> directly
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh token
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_CONFIG.baseURL}/Auth/refresh-token`, {
            refreshToken
          });

          if (response.data.statusCode === 200) {
            localStorage.setItem('accessToken', response.data.data.accessToken);
            localStorage.setItem('refreshToken', response.data.data.refreshToken);

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${response.data.data.accessToken}`;
            return axiosClient(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed - redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token - redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
