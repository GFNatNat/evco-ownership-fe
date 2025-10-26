// Shared API endpoints (used across multiple roles)
import axiosClient from '../axiosClient';

const sharedApi = {
  // Authentication (used by all roles)
  auth: {
    login: (credentials) => axiosClient.post('/api/Auth/login', credentials),
    register: (userData) => axiosClient.post('/api/Auth/register', userData),
    logout: () => axiosClient.post('/api/Auth/logout'),
    refreshToken: () => axiosClient.post('/api/Auth/refresh'),
    forgotPassword: (email) => axiosClient.post('/api/Auth/forgot-password', { email }),
    resetPassword: (token, password) => axiosClient.post('/api/Auth/reset-password', { token, password }),
    verifyEmail: (token) => axiosClient.post('/api/Auth/verify-email', { token }),
    resendVerification: (email) => axiosClient.post('/api/Auth/resend-verification', { email })
  },

  // File Upload (used by all roles)
  fileUpload: {
    uploadSingle: (file, folder = 'general') => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      return axiosClient.post('/api/FileUpload/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    uploadMultiple: (files, folder = 'general') => {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
      });
      formData.append('folder', folder);
      return axiosClient.post('/api/FileUpload/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    deleteFile: (fileId) => axiosClient.delete(`/api/FileUpload/${fileId}`),
    getFileInfo: (fileId) => axiosClient.get(`/api/FileUpload/${fileId}`)
  },

  // General Notifications (system-wide)
  notifications: {
    getPublic: () => axiosClient.get('/api/Notification/public'),
    getSystemAnnouncements: () => axiosClient.get('/api/Notification/announcements'),
    markAnnouncementAsRead: (id) => axiosClient.patch(`/api/Notification/announcements/${id}/read`)
  },

  // Location Services (used by multiple roles)
  location: {
    searchAddresses: (query) => axiosClient.get(`/api/Location/search?q=${encodeURIComponent(query)}`),
    getCoordinates: (address) => axiosClient.get(`/api/Location/geocode?address=${encodeURIComponent(address)}`),
    reverseGeocode: (lat, lng) => axiosClient.get(`/api/Location/reverse?lat=${lat}&lng=${lng}`),
    getNearbyParkingSpots: (lat, lng, radius = 5) => axiosClient.get(`/api/Location/parking?lat=${lat}&lng=${lng}&radius=${radius}`)
  },

  // Payment Processing (used by multiple roles)
  payments: {
    getPaymentMethods: () => axiosClient.get('/api/Payment/methods'),
    addPaymentMethod: (methodData) => axiosClient.post('/api/Payment/methods', methodData),
    removePaymentMethod: (methodId) => axiosClient.delete(`/api/Payment/methods/${methodId}`),
    processPayment: (paymentData) => axiosClient.post('/api/Payment/process', paymentData),
    getPaymentHistory: (page = 1, limit = 20) => axiosClient.get(`/api/Payment/history?page=${page}&limit=${limit}`),
    refundPayment: (paymentId, reason) => axiosClient.post(`/api/Payment/${paymentId}/refund`, { reason })
  },

  // Common lookup data
  lookup: {
    getCountries: () => axiosClient.get('/api/Lookup/countries'),
    getStates: (countryCode) => axiosClient.get(`/api/Lookup/states/${countryCode}`),
    getCities: (stateCode) => axiosClient.get(`/api/Lookup/cities/${stateCode}`),
    getVehicleMakes: () => axiosClient.get('/api/Lookup/vehicle-makes'),
    getVehicleModels: (makeId) => axiosClient.get(`/api/Lookup/vehicle-models/${makeId}`),
    getVehicleYears: () => axiosClient.get('/api/Lookup/vehicle-years')
  }
};

export default sharedApi;