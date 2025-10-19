import Axios from 'axios'

import { getToken, clearToken } from '@/utils/auth'

const api = Axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com',
  withCredentials: true
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken()
    }
    return Promise.reject(error)
  }
)

export default api
