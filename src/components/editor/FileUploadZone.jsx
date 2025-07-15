import React, { useState, useRef, useCallback } from 'react'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import ProgressBar from '../ui/ProgressBar'
import { useFileUpload } from '../../hooks/useFileUpload'
import { cn } from '../../lib/utils'
import {
  Upload,
  File,
  Image,
  Video,
  Music,
  FileText,
  Archive,
  X,
  Plus
} from 'lucide-react'

const FileUploadZone = ({
  onFilesUploaded = () => {},
  onUploadProgress = () => {},
  acceptedTypes = [],
  maxFiles = 10,
  maxFileSize = 50 * 1024 * 1024, // 50MB
  multiple = true,
  className = '',
  productId = null,
  folder = null,
  uploadType = 'content'
}) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isDragActive, setIsDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const {
    uploads,
    isUploading,
    uploadMultipleFiles,
    cancelUpload,
    clearCompletedUploads
  } = useFileUpload({
    onUploadProgress: (data) => {
      onUploadProgress(data)
    },
    onAllComplete: (results) => {
      onFilesUploaded(results)
      // Auto-clear completed uploads after 3 seconds
      setTimeout(() => {
        clearCompletedUploads()
      }, 3000)
    }
  })

  const getFileIcon = (file) => {
    const type = file.type.toLowerCase()
    
    if (type.startsWith('image/')) {
      return <Image className="h-5 w-5 text-blue-500" />
    } else if (type.startsWith('video/')) {
      return <Video className="h-5 w-5 text-purple-500" />
    } else if (type.startsWith('audio/')) {
      return <Music className="h-5 w-5 text-green-500" />
    } else if (type.includes('pdf') || type.includes('document') || type.includes('text')) {
      return <FileText className="h-5 w-5 text-red-500" />
    } else if (type.includes('zip') || type.includes('rar') || type.includes('archive')) {
      return <Archive className="h-5 w-5 text-orange-500" />
    } else {
      return <File className="h-5 w-5 text-gray-500" />
    }
  }

  const validateFiles = (files) => {
    const fileArray = Array.from(files)
    const errors = []

    // Check file count
    if (fileArray.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed`)
    }

    // Check individual files
    fileArray.forEach((file, index) => {
      // Check file size
      if (file.size > maxFileSize) {
        errors.push(`File "${file.name}" is too large (max ${Math.round(maxFileSize / 1024 / 1024)}MB)`)
      }

      // Check file type if restrictions exist
      if (acceptedTypes.length > 0 && !acceptedTypes.includes(file.type)) {
        errors.push(`File type "${file.type}" not allowed for "${file.name}"`)
      }
    })

    return {
      valid: errors.length === 0,
      errors
    }
  }

  const handleFiles = useCallback(async (files) => {
    const validation = validateFiles(files)
    
    if (!validation.valid) {
      alert('Upload errors:\n' + validation.errors.join('\n'))
      return
    }

    try {
      await uploadMultipleFiles(files, {
        productId,
        folder,
        uploadType
      })
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }, [uploadMultipleFiles, productId, folder, uploadType, validateFiles])

  const handleDragEnter = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    setIsDragOver(false)
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFiles(files)
    }
  }, [handleFiles])

  const handleFileInputChange = useCallback((e) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      handleFiles(files)
    }
    // Reset input
    e.target.value = ''
  }, [handleFiles])

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const acceptString = acceptedTypes.length > 0 ? acceptedTypes.join(',') : '*/*'

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Zone */}
      <Card
        className={cn(
          'transition-all duration-200 border-2 border-dashed cursor-pointer',
          isDragOver
            ? 'border-blue-500 bg-blue-50'
            : isDragActive
            ? 'border-blue-400 bg-blue-25'
            : 'border-gray-300 hover:border-gray-400',
          isUploading && 'pointer-events-none opacity-75'
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className={cn(
              'p-4 rounded-full transition-colors',
              isDragOver ? 'bg-blue-100' : 'bg-gray-100'
            )}>
              <Upload className={cn(
                'h-8 w-8 transition-colors',
                isDragOver ? 'text-blue-600' : 'text-gray-600'
              )} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">
                {isDragOver ? 'Drop files here' : 'Upload files'}
              </h3>
              <p className="text-sm text-gray-600">
                Drag and drop files here, or click to select files
              </p>
              <p className="text-xs text-gray-500">
                {acceptedTypes.length > 0 
                  ? `Accepted types: ${acceptedTypes.join(', ')}`
                  : 'All file types accepted'
                }
              </p>
              <p className="text-xs text-gray-500">
                Max file size: {Math.round(maxFileSize / 1024 / 1024)}MB
                {multiple && ` • Max ${maxFiles} files`}
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              className="mt-4"
              disabled={isUploading}
            >
              <Plus className="h-4 w-4 mr-2" />
              Choose Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple={multiple}
        accept={acceptString}
        onChange={handleFileInputChange}
      />

      {/* Upload Progress */}
      {uploads.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">
              Uploads ({uploads.filter(u => u.status === 'completed').length}/{uploads.length})
            </h4>
            {uploads.some(u => u.status === 'completed') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCompletedUploads}
                className="text-xs"
              >
                Clear completed
              </Button>
            )}
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {uploads.map((upload) => (
              <div key={upload.id} className="relative">
                <ProgressBar
                  progress={upload.progress}
                  status={upload.status}
                  fileName={upload.file.name}
                  fileSize={upload.file.size}
                  speed={upload.speed}
                  remainingTime={upload.remainingTime}
                  error={upload.error}
                  size="sm"
                />
                
                {upload.status === 'uploading' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0"
                    onClick={() => cancelUpload(upload.id)}
                    title="Cancel upload"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUploadZone