import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:4000/api', withCredentials: true })

let isRefreshing = false
let refreshQueue = []

function processQueue(err, token = null) {
  refreshQueue.forEach(p => (err ? p.reject(err) : p.resolve(token)))
  refreshQueue = []
}

api.interceptors.response.use(res => res, async err => {
  const original = err.config
  if (err.response && err.response.status === 401 && !original._retry) {
    original._retry = true
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({ resolve, reject })
      }).then(token => {
        original.headers['Authorization'] = `Bearer ${token}`
        return axios(original)
      })
    }
    isRefreshing = true
    try {
      const resp = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {}, { withCredentials: true })
      const token = resp.data.accessToken
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      processQueue(null, token)
      isRefreshing = false
      original.headers['Authorization'] = `Bearer ${token}`
      return axios(original)
    } catch (e) {
      processQueue(e, null)
      isRefreshing = false
      // redirect to login
      window.location.href = '/login'
      return Promise.reject(e)
    }
  }
  return Promise.reject(err)
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
