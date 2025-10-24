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
    firstName: data.firstName,
    lastName: data.lastName
  }),

  refreshToken: (data) => axiosClient.post('/api/Auth/refresh-token', {
    refreshToken: data.refreshToken
  }),

  logout: () => axiosClient.post('/api/Auth/logout'),

  forgotPassword: (data) => axiosClient.post('/api/Auth/forgot-password', {
    email: data.email
  }),

  resetPassword: (data) => axiosClient.patch('/api/Auth/reset-password', {
    email: data.email,
    otp: data.otp,
    newPassword: data.newPassword
  }),

  changePassword: (data) => axiosClient.post('/api/Auth/change-password', {
    currentPassword: data.currentPassword,
    newPassword: data.newPassword,
    confirmPassword: data.confirmPassword
  }),

  // Verification endpoints
  verifyEmail: (data) => axiosClient.post('/api/Auth/verify-email', {
    email: data.email,
    token: data.token
  }),

  resendEmailConfirmation: (data) => axiosClient.post('/api/Auth/resend-confirmation', {
    email: data.email
  }),

  // License verification (basic)
  verifyLicense: (data) => axiosClient.post('/api/Auth/verify-license', {
    licenseNumber: data.licenseNumber,
    issueDate: data.issueDate,
    firstName: data.firstName,
    lastName: data.lastName
  }),

  // Development only - Get test OTP
  getTestOTP: (email) => axiosClient.get('/api/Auth/test/get-forgot-password-otp', {
    params: { email }
  })
};

export default authApi;
