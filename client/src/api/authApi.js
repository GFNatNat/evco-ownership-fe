import axiosClient from "./axiosClient";

const authApi = {
  register: (data) => axiosClient.post("/auth/register", data),
  login: (data) => axiosClient.post("/auth/login", data),
  refresh: () => axiosClient.post("/auth/refresh-token"),
  logout: () => axiosClient.post("/auth/logout"),
  forgotPassword: (data) => axiosClient.post("/auth/forgot-password", data),
  resetPassword: (token, data) =>
    axiosClient.post(`/auth/reset-password/${token}`, data),
};

export default authApi;
