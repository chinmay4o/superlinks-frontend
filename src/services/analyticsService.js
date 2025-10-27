import axios from 'axios'
import cacheService from './cacheService'

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

const analyticsService = {
  // Get analytics overview with caching
  getOverview: async () => {
    const cacheKey = 'analytics/overview'
    const cached = cacheService.get(cacheKey)
    
    if (cached) {
      return cached
    }
    
    const response = await api.get('/analytics/overview')
    
    // Cache for 2 minutes
    cacheService.set(cacheKey, response.data, 2 * 60 * 1000)
    
    return response.data
  },

  // Get recent purchases with caching
  getRecentPurchases: async (limit = 5) => {
    const cacheKey = `purchases?limit=${limit}&status=completed`
    const cached = cacheService.get(cacheKey)
    
    if (cached) {
      return cached
    }
    
    const response = await api.get(`/purchases?limit=${limit}&status=completed`)
    
    // Cache for 3 minutes
    cacheService.set(cacheKey, response.data, 3 * 60 * 1000)
    
    return response.data
  },

  // Clear analytics cache
  clearCache: () => {
    cacheService.clearByPattern('analytics/')
    cacheService.clearByPattern('purchases')
  }
}

export default analyticsService