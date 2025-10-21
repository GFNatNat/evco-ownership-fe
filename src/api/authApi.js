import axiosClient from './axiosClient';

const authApi = {
  // Authentication endpoints
  login: (data) => axiosClient.post('/api/Auth/login', {
    email: data.email,
    password: data.password,
    rememberMe: data.rememberMe || false
  }),

  register: (data) => axiosClient.post('/api/Auth/register', {
    email: data.email,
    password: data.password,
    confirmPassword: data.confirmPassword,
    fullName: data.fullName,
    phoneNumber: data.phoneNumber || '',
    role: data.role || 'CoOwner'
  }),

  refreshToken: (data) => axiosClient.post('/api/Auth/refresh-token', {
    token: data.token,
    refreshToken: data.refreshToken
  }),

  logout: () => axiosClient.post('/api/Auth/logout'),

  forgotPassword: (data) => axiosClient.post('/api/Auth/forgot-password', {
    email: data.email
  }),

  resetPassword: (data) => axiosClient.post('/api/Auth/reset-password', {
    email: data.email,
    token: data.token,
    newPassword: data.newPassword,
    confirmPassword: data.confirmPassword
  }),

  changePassword: (data) => axiosClient.post('/api/Auth/change-password', {
    currentPassword: data.currentPassword,
    newPassword: data.newPassword,
    confirmPassword: data.confirmPassword
  }),

  // Profile endpoints
  getProfile: () => axiosClient.get('/api/Profile'),
  updateProfile: (data) => axiosClient.put('/api/Profile', data),

  // Verification endpoints
  verifyEmail: (data) => axiosClient.post('/api/Auth/verify-email', {
    email: data.email,
    token: data.token
  }),

  resendEmailConfirmation: (data) => axiosClient.post('/api/Auth/resend-confirmation', {
    email: data.email
  })
};

export default authApi;
