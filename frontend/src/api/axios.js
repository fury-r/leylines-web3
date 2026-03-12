// eslint-disable-next-line

import axios from 'axios'
import { createTraceId, logger } from '../utils/logger'

// eslint-disable-next-line no-undef
const url = typeof window !== 'undefined' ? process.env.BASE_URL : null
const axiosInstance = axios.create({
  baseURL: url || 'http://127.0.0.1:8080'
})
axiosInstance.interceptors.request.use(async (config) => {
  if (['post', 'get', 'put', 'delete'].includes(config.method)) {
    try {
      let token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null

      config.headers['Authorization'] = `Bearer ${token}`
      config.headers['Access-Control-Allow-Origin'] = '*'
      config.headers['X-Request-ID'] = createTraceId()
    } catch (e) {
      logger.error('Failed to prepare API request', e)
    }
    return config
  }
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    logger.error('API request failed', {
      status: error?.response?.status,
      url: error?.config?.url,
      method: error?.config?.method,
      data: error?.response?.data
    })
    return Promise.reject(error)
  }
)

export default axiosInstance
