import React from 'react'
import { cn } from '../../lib/utils'
import { CheckCircle, AlertCircle, XCircle, Loader2 } from 'lucide-react'

const ProgressBar = ({
  progress = 0,
  status = 'uploading', // 'uploading', 'completed', 'error', 'cancelled'
  fileName = '',
  fileSize = 0,
  speed = 0,
  remainingTime = 0,
  error = null,
  showDetails = true,
  className = '',
  size = 'default' // 'sm', 'default', 'lg'
}) => {
  const formatBytes = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatTime = (seconds) => {
    if (!seconds || seconds === Infinity) return ''
    
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-gray-500" />
      case 'uploading':
      default:
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-500'
      case 'error':
        return 'bg-red-500'
      case 'cancelled':
        return 'bg-gray-500'
      case 'uploading':
      default:
        return 'bg-blue-500'
    }
  }

  const progressBarHeight = {
    sm: 'h-1',
    default: 'h-2',
    lg: 'h-3'
  }

  const containerPadding = {
    sm: 'p-2',
    default: 'p-3',
    lg: 'p-4'
  }

  return (
    <div className={cn(
      'border rounded-lg bg-white shadow-sm',
      containerPadding[size],
      className
    )}>
      {/* File Info */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          {getStatusIcon()}
          <span className="text-sm font-medium truncate" title={fileName}>
            {fileName}
          </span>
        </div>
        {showDetails && fileSize > 0 && (
          <span className="text-xs text-gray-500 ml-2">
            {formatBytes(fileSize)}
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className={cn(
        'w-full bg-gray-200 rounded-full overflow-hidden',
        progressBarHeight[size]
      )}>
        <div
          className={cn(
            'transition-all duration-300 ease-out rounded-full',
            getStatusColor()
          )}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {/* Progress Details */}
      {showDetails && (
        <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
          <span>{Math.round(progress)}%</span>
          
          {status === 'uploading' && speed > 0 && (
            <div className="flex items-center space-x-3">
              <span>{formatBytes(speed)}/s</span>
              {remainingTime > 0 && remainingTime !== Infinity && (
                <span>~{formatTime(remainingTime)} left</span>
              )}
            </div>
          )}
          
          {status === 'completed' && (
            <span className="text-green-600">Upload complete</span>
          )}
          
          {status === 'error' && error && (
            <span className="text-red-600" title={error}>
              Upload failed
            </span>
          )}
          
          {status === 'cancelled' && (
            <span className="text-gray-600">Upload cancelled</span>
          )}
        </div>
      )}
    </div>
  )
}

// Simplified version for inline use
export const SimpleProgressBar = ({ 
  progress = 0, 
  className = '',
  size = 'default',
  color = 'blue' 
}) => {
  const progressBarHeight = {
    sm: 'h-1',
    default: 'h-2',
    lg: 'h-3'
  }

  const colorClass = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    gray: 'bg-gray-500'
  }

  return (
    <div className={cn(
      'w-full bg-gray-200 rounded-full overflow-hidden',
      progressBarHeight[size],
      className
    )}>
      <div
        className={cn(
          'transition-all duration-300 ease-out rounded-full',
          colorClass[color]
        )}
        style={{ width: `${Math.min(progress, 100)}%` }}
      />
    </div>
  )
}

export default ProgressBar