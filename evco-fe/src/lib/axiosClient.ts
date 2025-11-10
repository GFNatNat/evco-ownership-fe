'use client';
import axios from 'axios';
import Cookies from 'js-cookie';

const baseURL = (process.env.NEXT_PUBLIC_API_BASE || '').replace(/\/+$/, '');

const axiosClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

axiosClient.interceptors.request.use((config) => {
  const name = process.env.NEXT_PUBLIC_AUTH_COOKIE ?? process.env.AUTH_COOKIE ?? 'accessToken';
  const token = Cookies.get(name);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosClient;
