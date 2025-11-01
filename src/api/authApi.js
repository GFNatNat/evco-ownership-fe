import axiosClient from './axiosClient';

const authApi = {
  // User Login
  login: (credentials) => axiosClient.post('/Auth/login', {
    email: credentials.email,
    password: credentials.password
  }),

  // User Registration
  register: (userData) => axiosClient.post('/Auth/register', {
    email: userData.email,
    password: userData.password,
    confirmPassword: userData.confirmPassword,
    firstName: userData.firstName,
    lastName: userData.lastName,
    phone: userData.phone,
    dateOfBirth: userData.dateOfBirth,
    address: userData.address
  }),

  // Token Refresh
  refreshToken: (refreshToken) => axiosClient.post('/Auth/refresh-token', {
    refreshToken
  }),

  // Logout (Optional - for token invalidation)
  logout: (refreshToken) => axiosClient.post('/Auth/logout', {
    refreshToken
  }),

  // Forgot Password
  forgotPassword: (email) => axiosClient.post('/Auth/forgot-password', {
    email
  }),

  // Reset Password
  resetPassword: (data) => axiosClient.patch('/Auth/reset-password', {
    email: data.email,
    otp: data.otp,
    newPassword: data.newPassword
  }),

  // Change Password (for authenticated users)
  changePassword: (data) => axiosClient.post('/Auth/change-password', {
    currentPassword: data.currentPassword,
    newPassword: data.newPassword,
    confirmPassword: data.confirmPassword
  }),

  // Basic License Verification (from Auth controller)
  verifyLicense: (licenseData) => axiosClient.post('/Auth/verify-license', {
    licenseNumber: licenseData.licenseNumber,
    issuedBy: licenseData.issuedBy,
    issueDate: licenseData.issueDate,
    expiryDate: licenseData.expiryDate,
    firstName: licenseData.firstName,
    lastName: licenseData.lastName
  }),

  // Email Verification
  verifyEmail: (data) => axiosClient.post('/Auth/verify-email', {
    email: data.email,
    otp: data.otp
  }),

  // Resend OTP for email verification
  resendOTP: (data) => axiosClient.post('/Auth/resend-otp', {
    email: data.email
  }),

  // Check if email exists
  checkEmailExists: (email) => axiosClient.get(`/Auth/check-email?email=${encodeURIComponent(email)}`),

  // Get current user info (for token validation)
  getCurrentUser: () => axiosClient.get('/Auth/me'),

  // Development only - Get test OTP
  getTestOTP: (email) => axiosClient.get(`/Auth/test/get-forgot-password-otp?email=${encodeURIComponent(email)}`)
};

export default authApi;
