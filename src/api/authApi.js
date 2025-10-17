import axiosClient from './axiosClient';
const p = '/api/Auth';

const authApi = {
  login: ({ email, password }) => axiosClient.post(`${p}/login`, {
    email,               
    password,            
    userName: email,     
    username: email,     
    userNameOrEmail: email, 
    rememberMe: true,
  }),
  register: (data) => axiosClient.post(`${p}/register`, data),
  forgotPassword: (data) => axiosClient.post(`${p}/forgot-password`, data),
  resetPassword: (data) => axiosClient.post(`${p}/reset-password`, data),

  verifyLicense: (data) => axiosClient.post(`${p}/verify-license`, data),
  checkExist: (data) => axiosClient.post(`${p}/check-exist`, data),
};
export default authApi;
