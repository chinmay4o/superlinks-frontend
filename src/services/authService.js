import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5005/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      // Only redirect if not already on login/register pages
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const authService = {
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials)
      const { token, user } = response.data
      
      if (token) {
        localStorage.setItem('token', token)
      }
      
      return { user, token }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData)
      const { token, user } = response.data
      
      if (token) {
        localStorage.setItem('token', token)
      }
      
      return { user, token }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed')
    }
  },

  async logout() {
    try {
      await api.post('/auth/logout')
    } finally {
      localStorage.removeItem('token')
    }
  },

  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get user data')
    }
  },

  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send reset email')
    }
  },

  async resetPassword(token, password) {
    try {
      const response = await api.post(`/auth/reset-password/${token}`, { password })
      const { token: authToken, user } = response.data
      
      if (authToken) {
        localStorage.setItem('token', authToken)
      }
      
      return { user, token: authToken }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Password reset failed')
    }
  },

  async changePassword(currentPassword, newPassword) {
    try {
      const response = await api.put('/auth/change-password', {
        currentPassword,
        newPassword
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to change password')
    }
  }
}

export default api