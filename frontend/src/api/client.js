import axios from 'axios'
import { TOKEN_KEY, REFRESH_KEY } from '@/lib/constants'

// No default Content-Type — set it per-request in interceptor
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`

  // FormData: browser must set Content-Type with multipart boundary automatically
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
    delete config.headers['content-type']
  } else {
    config.headers['Content-Type'] = 'application/json'
  }
  return config
})

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const refresh = localStorage.getItem(REFRESH_KEY)
      if (refresh) {
        try {
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/token/refresh/`,
            { refresh }
          )
          localStorage.setItem(TOKEN_KEY, data.access)
          original.headers.Authorization = `Bearer ${data.access}`
          return client(original)
        } catch {
          // refresh failed
        }
      }
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(REFRESH_KEY)
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default client
