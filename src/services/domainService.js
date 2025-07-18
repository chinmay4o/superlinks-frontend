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
      localStorage.removeItem('token')
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const domainService = {
  // Create a new domain in Brevo
  async createDomain(domainName) {
    try {
      const response = await api.post('/domains', { name: domainName })
      return response.data
    } catch (error) {
      const enhancedError = new Error(error.response?.data?.message || 'Failed to create domain')
      enhancedError.response = error.response
      throw enhancedError
    }
  },

  // Get all domains for the user
  async getDomains() {
    try {
      const response = await api.get('/domains')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch domains')
    }
  },

  // Get domain configuration and DNS records
  async getDomainConfiguration(domainName) {
    try {
      const response = await api.get(`/domains/${domainName}/config`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch domain configuration')
    }
  },

  // Authenticate/verify domain ownership
  async authenticateDomain(domainName) {
    try {
      const response = await api.put(`/domains/${domainName}/authenticate`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to authenticate domain')
    }
  },

  // Delete a domain
  async deleteDomain(domainName) {
    try {
      const response = await api.delete(`/domains/${domainName}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete domain')
    }
  },

  // Get domain verification status
  async getDomainStatus(domainName) {
    try {
      const response = await api.get(`/domains/${domainName}/status`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch domain status')
    }
  },

  // Create custom email address
  async createCustomEmail(domainName, emailPrefix) {
    try {
      const response = await api.post('/domains/custom-email', {
        domain: domainName,
        prefix: emailPrefix
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create custom email')
    }
  },

  // Get custom emails for a domain
  async getCustomEmails(domainName) {
    try {
      const response = await api.get(`/domains/${domainName}/emails`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch custom emails')
    }
  },

  // Delete custom email
  async deleteCustomEmail(emailId) {
    try {
      const response = await api.delete(`/domains/custom-email/${emailId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete custom email')
    }
  }
}

export default api