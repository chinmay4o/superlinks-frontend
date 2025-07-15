import { useState, useCallback, useRef } from 'react'
import FileUploadService from '../services/FileUploadService'
import { toast } from 'react-hot-toast'

export const useFileUpload = (options = {}) => {
  const [uploads, setUploads] = useState(new Map())
  const [isUploading, setIsUploading] = useState(false)
  const abortControllerRef = useRef(null)

  const {
    onUploadStart = () => {},
    onUploadProgress = () => {},
    onUploadComplete = () => {},
    onUploadError = () => {},
    onAllComplete = () => {},
    maxConcurrent = 3,
    showToasts = true
  } = options

  // Upload single file
  const uploadFile = useCallback(async (file, uploadOptions = {}) => {
    const uploadId = Date.now().toString(36) + Math.random().toString(36).substr(2)
    
    // Initialize upload state
    setUploads(prev => new Map(prev).set(uploadId, {
      id: uploadId,
      file,
      progress: 0,
      status: 'uploading',
      speed: 0,
      remainingTime: 0,
      error: null,
      result: null
    }))

    setIsUploading(true)
    onUploadStart({ uploadId, file })

    if (showToasts) {
      toast.loading(`Uploading ${file.name}...`, { id: uploadId })
    }

    try {
      const result = await FileUploadService.uploadFile(file, {
        ...uploadOptions,
        onProgress: (progress) => {
          setUploads(prev => {
            const newMap = new Map(prev)
            const upload = newMap.get(uploadId)
            if (upload) {
              newMap.set(uploadId, {
                ...upload,
                progress: progress.percentage,
                speed: progress.speed,
                remainingTime: progress.remainingTime
              })
            }
            return newMap
          })
          
          onUploadProgress({ uploadId, file, progress })
        },
        onSuccess: (response) => {
          setUploads(prev => {
            const newMap = new Map(prev)
            const upload = newMap.get(uploadId)
            if (upload) {
              newMap.set(uploadId, {
                ...upload,
                status: 'completed',
                progress: 100,
                result: response
              })
            }
            return newMap
          })

          if (showToasts) {
            toast.success(`${file.name} uploaded successfully`, { id: uploadId })
          }

          onUploadComplete({ uploadId, file, result: response })
        },
        onError: (error) => {
          setUploads(prev => {
            const newMap = new Map(prev)
            const upload = newMap.get(uploadId)
            if (upload) {
              newMap.set(uploadId, {
                ...upload,
                status: 'error',
                error: error.message
              })
            }
            return newMap
          })

          if (showToasts && error.name !== 'AbortError') {
            toast.error(`Upload failed: ${error.message}`, { id: uploadId })
          }

          onUploadError({ uploadId, file, error })
        }
      })

      return result
    } catch (error) {
      throw error
    } finally {
      // Check if any uploads are still active
      const activeUploads = Array.from(uploads.values()).filter(
        upload => upload.status === 'uploading'
      )
      
      if (activeUploads.length <= 1) {
        setIsUploading(false)
      }
    }
  }, [uploads, onUploadStart, onUploadProgress, onUploadComplete, onUploadError, showToasts])

  // Upload multiple files
  const uploadMultipleFiles = useCallback(async (files, uploadOptions = {}) => {
    const fileArray = Array.from(files)
    const results = []
    
    setIsUploading(true)
    
    if (showToasts) {
      toast.loading(`Uploading ${fileArray.length} files...`)
    }

    try {
      const uploadPromises = fileArray.map(async (file, index) => {
        const result = await uploadFile(file, uploadOptions)
        results[index] = result
        return result
      })

      await Promise.all(uploadPromises)
      
      if (showToasts) {
        toast.success(`All ${fileArray.length} files uploaded successfully`)
      }

      onAllComplete(results)
      return results
    } catch (error) {
      if (showToasts) {
        toast.error('Some uploads failed')
      }
      throw error
    } finally {
      setIsUploading(false)
    }
  }, [uploadFile, onAllComplete, showToasts])

  // Cancel upload
  const cancelUpload = useCallback((uploadId) => {
    FileUploadService.cancelUpload(uploadId)
    
    setUploads(prev => {
      const newMap = new Map(prev)
      const upload = newMap.get(uploadId)
      if (upload) {
        newMap.set(uploadId, {
          ...upload,
          status: 'cancelled'
        })
      }
      return newMap
    })

    if (showToasts) {
      toast.error('Upload cancelled', { id: uploadId })
    }
  }, [showToasts])

  // Cancel all uploads
  const cancelAllUploads = useCallback(() => {
    FileUploadService.cancelAllUploads()
    
    setUploads(prev => {
      const newMap = new Map()
      for (const [id, upload] of prev) {
        if (upload.status === 'uploading') {
          newMap.set(id, {
            ...upload,
            status: 'cancelled'
          })
        } else {
          newMap.set(id, upload)
        }
      }
      return newMap
    })

    setIsUploading(false)
    
    if (showToasts) {
      toast.error('All uploads cancelled')
    }
  }, [showToasts])

  // Clear completed uploads
  const clearCompletedUploads = useCallback(() => {
    setUploads(prev => {
      const newMap = new Map()
      for (const [id, upload] of prev) {
        if (upload.status === 'uploading') {
          newMap.set(id, upload)
        }
      }
      return newMap
    })
  }, [])

  // Clear all uploads
  const clearAllUploads = useCallback(() => {
    setUploads(new Map())
  }, [])

  // Get upload by ID
  const getUpload = useCallback((uploadId) => {
    return uploads.get(uploadId) || null
  }, [uploads])

  // Get uploads by status
  const getUploadsByStatus = useCallback((status) => {
    return Array.from(uploads.values()).filter(upload => upload.status === status)
  }, [uploads])

  // Get upload statistics
  const getUploadStats = useCallback(() => {
    const uploadArray = Array.from(uploads.values())
    return {
      total: uploadArray.length,
      uploading: uploadArray.filter(u => u.status === 'uploading').length,
      completed: uploadArray.filter(u => u.status === 'completed').length,
      failed: uploadArray.filter(u => u.status === 'error').length,
      cancelled: uploadArray.filter(u => u.status === 'cancelled').length
    }
  }, [uploads])

  return {
    uploads: Array.from(uploads.values()),
    uploadsMap: uploads,
    isUploading,
    uploadFile,
    uploadMultipleFiles,
    cancelUpload,
    cancelAllUploads,
    clearCompletedUploads,
    clearAllUploads,
    getUpload,
    getUploadsByStatus,
    getUploadStats
  }
}

export default useFileUpload