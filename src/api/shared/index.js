// Shared API endpoints (used across multiple roles)
import axiosClient from '../axiosClient';

const sharedApi = {
  // Authentication (used by all roles)
  auth: {
    login: (credentials) => axiosClient.post('/api/auth/login', credentials),
    register: (userData) => axiosClient.post('/api/auth/register', userData),
    logout: () => axiosClient.post('/api/auth/logout'),
    refreshToken: () => axiosClient.post('/api/auth/refresh'),
    forgotPassword: (email) => axiosClient.post('/api/auth/forgot-password', { email }),
    resetPassword: (token, password) => axiosClient.post('/api/auth/reset-password', { token, password }),
    verifyEmail: (token) => axiosClient.post('/api/auth/verify-email', { token }),
    resendVerification: (email) => axiosClient.post('/api/auth/resend-verification', { email })
  },

  // File Upload (used by all roles)
  fileUpload: {
    uploadSingle: (file, folder = 'general') => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      return axiosClient.post('/api/upload/single', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    uploadMultiple: (files, folder = 'general') => {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
      });
      formData.append('folder', folder);
      return axiosClient.post('/api/upload/multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    deleteFile: (fileId) => axiosClient.delete(`/api/upload/files/${fileId}`),
    getFileInfo: (fileId) => axiosClient.get(`/api/upload/files/${fileId}`)
  },

  // General Notifications (system-wide)
  notifications: {
    getPublic: () => axiosClient.get('/api/notifications/public'),
    getSystemAnnouncements: () => axiosClient.get('/api/notifications/announcements'),
    markAnnouncementAsRead: (id) => axiosClient.patch(`/api/notifications/announcements/${id}/read`)
  },

  // Location Services (used by multiple roles)
  location: {
    searchAddresses: (query) => axiosClient.get(`/api/location/search?q=${encodeURIComponent(query)}`),
    getCoordinates: (address) => axiosClient.get(`/api/location/geocode?address=${encodeURIComponent(address)}`),
    reverseGeocode: (lat, lng) => axiosClient.get(`/api/location/reverse?lat=${lat}&lng=${lng}`),
    getNearbyParkingSpots: (lat, lng, radius = 5) => axiosClient.get(`/api/location/parking?lat=${lat}&lng=${lng}&radius=${radius}`)
  },

  // Payment Processing (used by multiple roles)
  payments: {
    getPaymentMethods: () => axiosClient.get('/api/payments/methods'),
    addPaymentMethod: (methodData) => axiosClient.post('/api/payments/methods', methodData),
    removePaymentMethod: (methodId) => axiosClient.delete(`/api/payments/methods/${methodId}`),
    processPayment: (paymentData) => axiosClient.post('/api/payments/process', paymentData),
    getPaymentHistory: (page = 1, limit = 20) => axiosClient.get(`/api/payments/history?page=${page}&limit=${limit}`),
    refundPayment: (paymentId, reason) => axiosClient.post(`/api/payments/${paymentId}/refund`, { reason })
  },

  // Common lookup data
  lookup: {
    getCountries: () => axiosClient.get('/api/lookup/countries'),
    getStates: (countryCode) => axiosClient.get(`/api/lookup/states/${countryCode}`),
    getCities: (stateCode) => axiosClient.get(`/api/lookup/cities/${stateCode}`),
    getVehicleMakes: () => axiosClient.get('/api/lookup/vehicle-makes'),
    getVehicleModels: (makeId) => axiosClient.get(`/api/lookup/vehicle-models/${makeId}`),
    getVehicleYears: () => axiosClient.get('/api/lookup/vehicle-years')
  }
};

export default sharedApi;