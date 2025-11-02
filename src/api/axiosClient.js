// import axios from 'axios';

// const axiosClient = axios.create({
//   baseURL: process.env.REACT_APP_API_BASE_URL ,
//   headers: { 'Content-Type': 'application/json' },
// });

// axiosClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem('accessToken');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// export default axiosClient;

import axios from 'axios';

const raw = process.env.REACT_APP_API_BASE_URL || 'https://swp391-evcoownership-api.azurewebsites.net/api';
const baseURL = raw.replace(/\/+$/, ''); // no trailing slash

const axiosClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // DEBUG the final URL during diagnosis
  // console.log('[HTTP]', config.method?.toUpperCase(), baseURL + (config.url || ''), config.data);
  return config;
});

export default axiosClient;


