// import axiosClient from './axiosClient';

// const authApi = {
//   // Authentication endpoints
//   login: (data) => axiosClient.post('/api/Auth/login', {
//     email: data.email,
//     password: data.password,
//     rememberMe: data.rememberMe || false
//   }),

//   register: (data) => axiosClient.post('/api/Auth/register', {
//     email: data.email,
//     password: data.password,
//     confirmPassword: data.confirmPassword,
//     firstName: data.firstName,
//     lastName: data.lastName
//   }),

//   refreshToken: (data) => axiosClient.post('/api/Auth/refresh-token', {
//     refreshToken: data.refreshToken
//   }),

//   logout: () => axiosClient.post('/api/Auth/logout'),

//   forgotPassword: (data) => axiosClient.post('/api/Auth/forgot-password', {
//     email: data.email
//   }),

//   resetPassword: (data) => axiosClient.patch('/api/Auth/reset-password', {
//     email: data.email,
//     otp: data.otp,
//     newPassword: data.newPassword
//   }),

//   changePassword: (data) => axiosClient.post('/api/Auth/change-password', {
//     currentPassword: data.currentPassword,
//     newPassword: data.newPassword,
//     confirmPassword: data.confirmPassword
//   }),

//   // Verification endpoints
//   verifyEmail: (data) => axiosClient.post('/api/Auth/verify-email', {
//     email: data.email,
//     token: data.token
//   }),

//   resendEmailConfirmation: (data) => axiosClient.post('/api/Auth/resend-confirmation', {
//     email: data.email
//   }),

//   // License verification (basic)
//   verifyLicense: (data) => axiosClient.post('/api/Auth/verify-license', {
//     licenseNumber: data.licenseNumber,
//     issueDate: data.issueDate,
//     firstName: data.firstName,
//     lastName: data.lastName
//   }),

//   // Development only - Get test OTP
//   getTestOTP: (email) => axiosClient.get('/api/Auth/test/get-forgot-password-otp', {
//     params: { email }
//   })
// };

// export default authApi;


// authApi.js
import axiosClient from './axiosClient';

const authApi = {
  login: (payload) => axiosClient.post('/Auth/login', payload),
  register: (d) => axiosClient.post('/Auth/register', {
    email: d.email, password: d.password, confirmPassword: d.confirmPassword,
    firstName: d.firstName, lastName: d.lastName,
  }),

  refreshToken: ({ refreshToken }) => axiosClient.post('/Auth/refresh-token', { refreshToken }),
  logout: () => axiosClient.post('/Auth/logout'),
  forgotPassword: ({ email }) => axiosClient.post('/Auth/forgot-password', { email }),
  resetPassword: ({ email, otp, newPassword }) => axiosClient.patch('/Auth/reset-password', { email, otp, newPassword }),
  changePassword: ({ currentPassword, newPassword, confirmPassword }) =>
    axiosClient.post('/Auth/change-password', { currentPassword, newPassword, confirmPassword }),
  verifyEmail: ({ email, token }) => axiosClient.post('/Auth/verify-email', { email, token }),
  resendEmailConfirmation: ({ email }) => axiosClient.post('/Auth/resend-confirmation', { email }),
  verifyLicense: ({ licenseNumber, issueDate, firstName, lastName }) =>
    axiosClient.post('/Auth/verify-license', { licenseNumber, issueDate, firstName, lastName }),
  getTestOTP: (email) => axiosClient.get('/Auth/test/get-forgot-password-otp', { params: { email } }),
};

export default authApi;

