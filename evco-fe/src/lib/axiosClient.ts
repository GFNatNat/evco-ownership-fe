/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import Cookies from "js-cookie";
import { refreshToken } from "./refreshToken";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://swp391-evcoownership-api.azurewebsites.net/api/",
});

axiosClient.interceptors.request.use((config) => {
  const cookieName =
    process.env.NEXT_PUBLIC_AUTH_COOKIE ??
    process.env.AUTH_COOKIE ??
    "accessToken";
  const token =
    typeof window !== "undefined" ? Cookies.get(cookieName) : undefined;
  if (!config.headers) config.headers = {} as any;
  if (token) (config.headers as any).Authorization = `Bearer ${token}`;
  return config;
});

// 🧠 Thêm interceptor response
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu request bị 401 và chưa refresh lần nào
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshToken();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(originalRequest); // Thử lại
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
