const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5005/api'

class ReviewService {
  async getProductReviews(productId, options = {}) {
    try {
      const { page = 1, limit = 10, sortBy = 'newest' } = options
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy
      })
      
      const response = await fetch(`${API_BASE_URL}/reviews/product/${productId}?${params}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch reviews')
      }
      
      return data
    } catch (error) {
      console.error('Error fetching reviews:', error)
      throw error
    }
  }
  
  async addReview(productId, reviewData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/product/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add review')
      }
      
      return data
    } catch (error) {
      console.error('Error adding review:', error)
      throw error
    }
  }
  
  async updateReview(reviewId, reviewData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update review')
      }
      
      return data
    } catch (error) {
      console.error('Error updating review:', error)
      throw error
    }
  }
  
  async deleteReview(reviewId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete review')
      }
      
      return data
    } catch (error) {
      console.error('Error deleting review:', error)
      throw error
    }
  }
  
  async canUserReview(productId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/can-review/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to check review eligibility')
      }
      
      return data
    } catch (error) {
      console.error('Error checking review eligibility:', error)
      throw error
    }
  }
}

export default new ReviewService()