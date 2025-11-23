import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:4000/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
})

// Request/response interceptors (attach auth token if needed)
api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('ev_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api