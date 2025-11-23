import axios from 'axios'
import cacheService from './cacheService'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5005/api'

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

const salesService = {
  // Get purchases with caching
  getPurchases: async (params = {}) => {
    const cacheKey = cacheService.generateKey('/purchases', params)
    const cached = cacheService.get(cacheKey)
    
    if (cached) {
      return cached
    }
    
    const response = await api.get('/purchases', { params })
    
    // Cache for 3 minutes for sales data
    cacheService.set(cacheKey, response.data, 3 * 60 * 1000)
    
    return response.data
  },

  // Get sales statistics with caching
  getSalesStats: async (timeFilter = 'all') => {
    const cacheKey = `sales-stats-${timeFilter}`
    const cached = cacheService.get(cacheKey)
    
    if (cached) {
      return cached
    }
    
    const response = await api.get('/purchases/stats', { 
      params: { timeFilter } 
    })
    
    // Cache stats for 5 minutes
    cacheService.set(cacheKey, response.data, 5 * 60 * 1000)
    
    return response.data
  },

  // Get purchase details
  getPurchaseDetails: async (purchaseId) => {
    console.log('salesService.getPurchaseDetails called with:', purchaseId)
    
    const cacheKey = `purchase-${purchaseId}`
    const cached = cacheService.get(cacheKey)
    
    if (cached) {
      console.log('Returning cached purchase details for:', purchaseId)
      return cached
    }
    
    console.log('Making API request to /purchases/' + purchaseId)
    
    try {
      const response = await api.get(`/purchases/${purchaseId}`)
      console.log('API response for purchase details:', response.status, response.data)
      
      // Cache individual purchase for 10 minutes
      cacheService.set(cacheKey, response.data, 10 * 60 * 1000)
      
      return response.data
    } catch (error) {
      console.error('API error in getPurchaseDetails:', error.response?.status, error.response?.data)
      throw error
    }
  },

  // Get user's own purchases (as buyer) with caching
  getMyPurchases: async (params = {}) => {
    const cacheKey = cacheService.generateKey('/purchases/my-purchases', params)
    const cached = cacheService.get(cacheKey)
    
    if (cached) {
      return cached
    }
    
    const response = await api.get('/purchases/my-purchases', { params })
    
    // Cache for 5 minutes (user's purchases don't change often)
    cacheService.set(cacheKey, response.data, 5 * 60 * 1000)
    
    return response.data
  },

  // Update purchase status
  updatePurchaseStatus: async (purchaseId, status) => {
    const response = await api.patch(`/purchases/${purchaseId}/status`, { status })
    
    // Clear related cache entries
    cacheService.clearByPattern('purchases')
    cacheService.clearByPattern('sales-stats')
    cacheService.delete(`purchase-${purchaseId}`)
    
    return response.data
  },

  // Process refund
  processRefund: async (purchaseId, refundData) => {
    const response = await api.post(`/purchases/${purchaseId}/refund`, refundData)
    
    // Clear related cache entries
    cacheService.clearByPattern('purchases')
    cacheService.clearByPattern('sales-stats')
    cacheService.delete(`purchase-${purchaseId}`)
    
    return response.data
  },

  // Bulk export purchases
  exportPurchases: async (purchaseIds = [], format = 'csv') => {
    const response = await api.post('/purchases/export', {
      purchaseIds,
      format
    }, {
      responseType: 'blob'
    })
    
    return response.data
  },

  // Send email to customer
  sendCustomerEmail: async (purchaseId, emailData) => {
    const response = await api.post(`/purchases/${purchaseId}/email`, emailData)
    return response.data
  },

  // Clear sales cache
  clearCache: () => {
    console.log('Clearing sales cache...')
    cacheService.clearByPattern('purchases')
    cacheService.clearByPattern('sales-stats')
  },

  // Debug cache state
  debugCache: () => {
    console.log('Cache debug info:')
    console.log('- All cache keys:', Object.keys(cacheService._cache || {}))
    console.log('- Purchase-related keys:', Object.keys(cacheService._cache || {}).filter(key => key.includes('purchase')))
  }
}

export default salesService