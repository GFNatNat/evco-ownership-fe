import axios from 'axios';

// API Configuration
export const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://localhost:7279',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
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
    // Enhanced error logging for debugging
    console.error('🚨 API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });

    const originalRequest = error.config;

    // Handle 500 Internal Server Error specifically
    if (error.response?.status === 500) {
      console.error('❌ 500 Internal Server Error Details:', {
        url: error.config?.url,
        method: error.config?.method,
        requestData: error.config?.data,
        responseData: error.response?.data,
        headers: error.config?.headers
      });

      // For registration/login, check if there's actual data in response
      // Sometimes backend throws 500 but still processes the request successfully
      if (error.response?.data && (
        error.config?.url?.includes('/Auth/register') ||
        error.config?.url?.includes('/Auth/login')
      )) {
        console.warn('⚠️ 500 error but response contains data - attempting to parse:', error.response.data);

        // Try to return the response data if it exists and looks valid
        if (error.response.data.statusCode || error.response.data.data) {
          return error.response.data;
        }
      }

      // Don't retry 500 errors, just return them
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh token
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_CONFIG.baseURL}/api/Auth/refresh-token`, {
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
