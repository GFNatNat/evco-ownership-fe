/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from '@/lib/axiosClient';
export const authApi = {
  login: (data: { email: string; password: string }) => axiosClient.post('Auth/login', data),
  register: (data: any) => axiosClient.post('Auth/register', data),
  refresh: (data: { refreshToken: string }) => axiosClient.post('Auth/refresh-token', data),
  forgotPassword: (email: string) => axiosClient.post('Auth/forgot-password', { email }),
  resetPassword: (token: string, newPassword: string) => axiosClient.post('Auth/reset-password', { token, newPassword }),
  me: () => axiosClient.get('Auth/me'),
  logout: () => axiosClient.post('Auth/logout'),
};
