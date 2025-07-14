import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatNumber(number) {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M'
  }
  if (number >= 1000) {
    return (number / 1000).toFixed(1) + 'K'
  }
  return number.toString()
}

export function formatDate(date, options = {}) {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  }).format(new Date(date))
}

export function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-')
}

export function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength) + '...'
}

export function getFileSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Bytes'
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

export function getFileType(filename) {
  const extension = filename.split('.').pop().toLowerCase()
  
  const types = {
    // Documents
    pdf: 'PDF Document',
    doc: 'Word Document',
    docx: 'Word Document',
    txt: 'Text File',
    rtf: 'Rich Text File',
    
    // Images
    jpg: 'JPEG Image',
    jpeg: 'JPEG Image',
    png: 'PNG Image',
    gif: 'GIF Image',
    svg: 'SVG Image',
    webp: 'WebP Image',
    
    // Videos
    mp4: 'MP4 Video',
    avi: 'AVI Video',
    mov: 'MOV Video',
    mkv: 'MKV Video',
    webm: 'WebM Video',
    
    // Audio
    mp3: 'MP3 Audio',
    wav: 'WAV Audio',
    flac: 'FLAC Audio',
    aac: 'AAC Audio',
    
    // Archives
    zip: 'ZIP Archive',
    rar: 'RAR Archive',
    '7z': '7-Zip Archive',
    tar: 'TAR Archive',
    
    // Others
    json: 'JSON File',
    csv: 'CSV File',
    xml: 'XML File',
  }
  
  return types[extension] || 'File'
}

export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export function validatePassword(password) {
  return {
    minLength: password.length >= 6,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }
}

export function calculateReadingTime(text) {
  const wordsPerMinute = 200
  const words = text.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return minutes
}

export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function throttle(func, limit) {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

export function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text)
  } else {
    // Fallback for older browsers
    const textArea = document.createElement("textarea")
    textArea.value = text
    textArea.style.position = "fixed"
    textArea.style.left = "-999999px"
    textArea.style.top = "-999999px"
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    return new Promise((res, rej) => {
      document.execCommand('copy') ? res() : rej()
      textArea.remove()
    })
  }
}

export function generateId() {
  return Math.random().toString(36).substr(2, 9)
}

export function isValidUrl(string) {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

export function getInitials(name) {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function timeAgo(date) {
  const now = new Date()
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`
  return `${Math.floor(diffInSeconds / 31536000)}y ago`
}