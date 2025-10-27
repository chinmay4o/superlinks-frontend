// Simple in-memory cache service for API responses
class CacheService {
  constructor() {
    this.cache = new Map()
    this.defaultTTL = 5 * 60 * 1000 // 5 minutes
  }

  // Generate cache key from URL and params
  generateKey(url, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        result[key] = params[key]
        return result
      }, {})
    
    return `${url}?${JSON.stringify(sortedParams)}`
  }

  // Set cache entry with TTL
  set(key, data, ttl = this.defaultTTL) {
    const expiresAt = Date.now() + ttl
    this.cache.set(key, {
      data,
      expiresAt
    })
  }

  // Get cache entry if not expired
  get(key) {
    const entry = this.cache.get(key)
    
    if (!entry) return null
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }
    
    return entry.data
  }

  // Clear specific cache entry
  delete(key) {
    this.cache.delete(key)
  }

  // Clear all cache entries
  clear() {
    this.cache.clear()
  }

  // Clear expired entries
  clearExpired() {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key)
      }
    }
  }

  // Clear cache entries matching pattern
  clearByPattern(pattern) {
    const regex = new RegExp(pattern)
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key)
      }
    }
  }
}

// Create singleton instance
const cacheService = new CacheService()

// Clear expired entries every 10 minutes
setInterval(() => {
  cacheService.clearExpired()
}, 10 * 60 * 1000)

export default cacheService