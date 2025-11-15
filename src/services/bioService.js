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

const bioService = {
  // Get bio data with caching
  getBio: async () => {
    const cacheKey = 'bio-data'
    const cached = cacheService.get(cacheKey)
    
    if (cached) {
      return cached
    }
    
    const response = await api.get('/bio')
    
    // Cache bio data for 10 minutes
    cacheService.set(cacheKey, response.data, 10 * 60 * 1000)
    
    return response.data
  },

  // Update bio profile data
  updateBioProfile: async (profileData) => {
    const response = await api.put('/bio/profile', profileData)
    
    // Update cached version instead of clearing to prevent refresh
    const cached = cacheService.get('bio-data')
    if (cached && cached.bio) {
      cached.bio.profile = { ...cached.bio.profile, ...profileData }
      cacheService.set('bio-data', cached, 10 * 60 * 1000)
    }
    
    return response.data
  },

  // Update bio customization
  updateBioCustomization: async (customizationData) => {
    const response = await api.put('/bio/customization', customizationData)
    
    // Don't clear cache for customization - let React state handle real-time updates
    // Update cached version optimistically
    const cached = cacheService.get('bio-data')
    if (cached && cached.bio) {
      cached.bio.customization = { ...cached.bio.customization, ...customizationData }
      cacheService.set('bio-data', cached, 10 * 60 * 1000)
    }
    
    return response.data
  },

  // Add new block
  addBlock: async (blockData) => {
    const response = await api.post('/bio/blocks', blockData)
    
    // Clear bio cache to refresh blocks
    cacheService.delete('bio-data')
    
    return response.data
  },

  // Update block
  updateBlock: async (blockId, blockData) => {
    const response = await api.put(`/bio/blocks/${blockId}`, blockData)
    
    // Don't clear cache for block updates - let React state handle it
    // This prevents page refreshes during real-time editing
    
    return response.data
  },

  // Delete block
  deleteBlock: async (blockId) => {
    const response = await api.delete(`/bio/blocks/${blockId}`)
    
    // Clear cache to maintain consistency with React state
    cacheService.delete('bio-data')
    
    return response.data
  },

  // Reorder blocks
  reorderBlocks: async (blockOrders) => {
    const response = await api.put('/bio/blocks/reorder', { blockOrders })
    
    // Don't clear cache - let React state handle reordering
    
    return response.data
  },

  // Toggle block visibility
  toggleBlockVisibility: async (blockId, isActive) => {
    const response = await api.patch(`/bio/blocks/${blockId}/toggle`, { isActive })
    
    // Clear cache to force fresh data fetch
    cacheService.delete('bio-data')
    
    return response.data
  },

  // Upload image for bio
  uploadBioImage: async (imageFile, type = 'avatar') => {
    const formData = new FormData()
    formData.append('image', imageFile)
    formData.append('type', type)
    
    const response = await api.post('/bio/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    // Clear cache to refresh with new image
    cacheService.delete('bio-data')
    
    return response.data
  },

  // Get public bio by username
  getPublicBio: async (username) => {
    const cacheKey = `public-bio-${username}`
    const cached = cacheService.get(cacheKey)
    
    if (cached) {
      return cached
    }
    
    const response = await api.get(`/bio/public/${username}`)
    
    // Cache public bio for 15 minutes
    cacheService.set(cacheKey, response.data, 15 * 60 * 1000)
    
    return response.data
  },

  // Get bio analytics
  getBioAnalytics: async (timeframe = '30d') => {
    const cacheKey = `bio-analytics-${timeframe}`
    const cached = cacheService.get(cacheKey)
    
    if (cached) {
      return cached
    }
    
    const response = await api.get('/bio/analytics', {
      params: { timeframe }
    })
    
    // Cache analytics for 5 minutes
    cacheService.set(cacheKey, response.data, 5 * 60 * 1000)
    
    return response.data
  },

  // Clear bio cache
  clearCache: () => {
    cacheService.clearByPattern('bio-')
  }
}

export default bioService