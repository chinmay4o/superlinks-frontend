class FileUploadService {
  constructor() {
    this.activeUploads = new Map()
    this.apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005'
  }

  /**
   * Upload a single file with progress tracking
   * @param {File} file - The file to upload
   * @param {Object} options - Upload options
   * @returns {Promise} - Promise that resolves with upload result
   */
  async uploadFile(file, options = {}) {
    const {
      onProgress = () => {},
      onSuccess = () => {},
      onError = () => {},
      productId = null,
      folder = null,
      description = '',
      uploadType = 'content' // 'content', 'product', 'avatar', etc.
    } = options

    // Generate unique upload ID
    const uploadId = this.generateUploadId()
    
    // Validate file
    const validation = this.validateFile(file)
    if (!validation.valid) {
      const error = new Error(validation.errors.join(', '))
      onError(error)
      throw error
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      const formData = new FormData()
      
      // Add file and metadata
      formData.append('file', file)
      formData.append('originalName', file.name)
      formData.append('uploadType', uploadType)
      
      if (productId) formData.append('productId', productId)
      if (folder) formData.append('folder', folder)
      if (description) formData.append('description', description)

      // Create abort controller for cancellation
      const controller = new AbortController()
      
      // Store upload reference
      this.activeUploads.set(uploadId, {
        xhr,
        controller,
        file,
        startTime: Date.now()
      })

      // Progress tracking
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = {
            uploadId,
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100),
            speed: this.calculateSpeed(uploadId, event.loaded),
            remainingTime: this.calculateRemainingTime(uploadId, event.loaded, event.total)
          }
          
          onProgress(progress)
        }
      })

      // Success handler
      xhr.addEventListener('load', () => {
        this.activeUploads.delete(uploadId)
        
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText)
            onSuccess(response)
            resolve(response)
          } catch (error) {
            onError(error)
            reject(error)
          }
        } else {
          const error = new Error(`Upload failed with status ${xhr.status}`)
          onError(error)
          reject(error)
        }
      })

      // Error handler
      xhr.addEventListener('error', () => {
        this.activeUploads.delete(uploadId)
        const error = new Error('Network error during upload')
        onError(error)
        reject(error)
      })

      // Abort handler
      xhr.addEventListener('abort', () => {
        this.activeUploads.delete(uploadId)
        const error = new Error('Upload cancelled')
        error.name = 'AbortError'
        onError(error)
        reject(error)
      })

      // Timeout handler
      xhr.addEventListener('timeout', () => {
        this.activeUploads.delete(uploadId)
        const error = new Error('Upload timeout')
        onError(error)
        reject(error)
      })

      // Configure request
      xhr.open('POST', `${this.apiBaseUrl}/files/upload`)
      xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`)
      xhr.timeout = 5 * 60 * 1000 // 5 minutes timeout
      
      // Send request
      xhr.send(formData)
    })
  }

  /**
   * Upload multiple files with concurrency control
   * @param {FileList|Array} files - Files to upload
   * @param {Object} options - Upload options
   * @returns {Promise} - Promise that resolves when all uploads complete
   */
  async uploadMultipleFiles(files, options = {}) {
    const {
      maxConcurrent = 3,
      onProgress = () => {},
      onFileComplete = () => {},
      onAllComplete = () => {}
    } = options

    const fileArray = Array.from(files)
    const results = []
    let completed = 0

    return new Promise((resolve, reject) => {
      const semaphore = new Semaphore(maxConcurrent)
      
      const uploadPromises = fileArray.map(async (file, index) => {
        const release = await semaphore.acquire()
        
        try {
          const result = await this.uploadFile(file, {
            ...options,
            onProgress: (progress) => {
              onProgress({
                ...progress,
                fileIndex: index,
                fileName: file.name,
                overallProgress: Math.round((completed / fileArray.length) * 100)
              })
            },
            onSuccess: (response) => {
              completed++
              onFileComplete({
                index,
                file,
                response,
                completed,
                total: fileArray.length
              })
            }
          })
          
          results[index] = result
          return result
        } finally {
          release()
        }
      })

      Promise.all(uploadPromises)
        .then(() => {
          onAllComplete(results)
          resolve(results)
        })
        .catch(reject)
    })
  }

  /**
   * Cancel an active upload
   * @param {string} uploadId - Upload ID to cancel
   */
  cancelUpload(uploadId) {
    const upload = this.activeUploads.get(uploadId)
    if (upload) {
      upload.xhr.abort()
      this.activeUploads.delete(uploadId)
    }
  }

  /**
   * Cancel all active uploads
   */
  cancelAllUploads() {
    for (const [uploadId] of this.activeUploads) {
      this.cancelUpload(uploadId)
    }
  }

  /**
   * Get active upload status
   * @param {string} uploadId - Upload ID
   * @returns {Object|null} - Upload status or null if not found
   */
  getUploadStatus(uploadId) {
    return this.activeUploads.get(uploadId) || null
  }

  /**
   * Get all active uploads
   * @returns {Array} - Array of active upload statuses
   */
  getActiveUploads() {
    return Array.from(this.activeUploads.entries()).map(([id, upload]) => ({
      id,
      ...upload
    }))
  }

  /**
   * Validate file before upload
   * @param {File} file - File to validate
   * @returns {Object} - Validation result
   */
  validateFile(file) {
    const errors = []
    
    // Size validation (50MB default limit)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      errors.push(`File size ${this.formatBytes(file.size)} exceeds maximum ${this.formatBytes(maxSize)}`)
    }

    // Type validation
    const allowedTypes = [
      // Images
      'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      // Videos
      'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo',
      // Audio
      'audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/ogg', 'audio/mp4',
      // Documents
      'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      // Archives
      'application/zip', 'application/x-zip-compressed', 'application/x-rar-compressed',
      // Text
      'text/plain', 'text/html', 'text/css', 'text/javascript', 'application/json',
      // Others
      'application/octet-stream'
    ]

    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} is not allowed`)
    }

    // Name validation
    if (file.name.length > 255) {
      errors.push('File name is too long (max 255 characters)')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Calculate upload speed
   * @param {string} uploadId - Upload ID
   * @param {number} loaded - Bytes loaded
   * @returns {number} - Speed in bytes per second
   */
  calculateSpeed(uploadId, loaded) {
    const upload = this.activeUploads.get(uploadId)
    if (!upload) return 0

    const elapsed = (Date.now() - upload.startTime) / 1000
    return elapsed > 0 ? loaded / elapsed : 0
  }

  /**
   * Calculate remaining time
   * @param {string} uploadId - Upload ID
   * @param {number} loaded - Bytes loaded
   * @param {number} total - Total bytes
   * @returns {number} - Remaining time in seconds
   */
  calculateRemainingTime(uploadId, loaded, total) {
    const speed = this.calculateSpeed(uploadId, loaded)
    if (speed === 0) return Infinity
    
    const remaining = total - loaded
    return remaining / speed
  }

  /**
   * Format bytes to human readable format
   * @param {number} bytes - Bytes to format
   * @returns {string} - Formatted string
   */
  formatBytes(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  /**
   * Generate unique upload ID
   * @returns {string} - Unique ID
   */
  generateUploadId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }
}

/**
 * Semaphore for controlling concurrent uploads
 */
class Semaphore {
  constructor(maxConcurrent) {
    this.maxConcurrent = maxConcurrent
    this.current = 0
    this.queue = []
  }

  async acquire() {
    return new Promise(resolve => {
      if (this.current < this.maxConcurrent) {
        this.current++
        resolve(() => this.release())
      } else {
        this.queue.push(() => {
          this.current++
          resolve(() => this.release())
        })
      }
    })
  }

  release() {
    this.current--
    if (this.queue.length > 0) {
      const next = this.queue.shift()
      next()
    }
  }
}

// Export singleton instance
export default new FileUploadService()