import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog'
import { Button } from './button'
import { Badge } from './badge'
import { 
  Download, X, FileText, Archive, Image as ImageIcon, 
  Music, Video, Code, ExternalLink 
} from 'lucide-react'

export function FilePreviewModal({ file, isOpen, onClose, onDownload }) {
  if (!file) return null

  const getFileIcon = (fileName) => {
    const extension = fileName?.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-500" />
      case 'zip':
      case 'rar':
        return <Archive className="h-8 w-8 text-orange-500" />
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <ImageIcon className="h-8 w-8 text-green-500" />
      case 'mp3':
      case 'wav':
        return <Music className="h-8 w-8 text-purple-500" />
      case 'mp4':
      case 'avi':
        return <Video className="h-8 w-8 text-blue-500" />
      case 'js':
      case 'html':
      case 'css':
        return <Code className="h-8 w-8 text-yellow-500" />
      default:
        return <FileText className="h-8 w-8 text-gray-500" />
    }
  }

  const getFileType = (fileName) => {
    const extension = fileName?.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf':
        return 'PDF Document'
      case 'zip':
      case 'rar':
        return 'Compressed Archive'
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'Image File'
      case 'mp3':
      case 'wav':
        return 'Audio File'
      case 'mp4':
      case 'avi':
        return 'Video File'
      case 'js':
        return 'JavaScript File'
      case 'html':
        return 'HTML File'
      case 'css':
        return 'CSS File'
      case 'txt':
        return 'Text File'
      case 'doc':
      case 'docx':
        return 'Word Document'
      case 'xls':
      case 'xlsx':
        return 'Excel Spreadsheet'
      case 'ppt':
      case 'pptx':
        return 'PowerPoint Presentation'
      default:
        return 'Document'
    }
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const canPreview = (fileName) => {
    const extension = fileName?.split('.').pop()?.toLowerCase()
    return ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'txt'].includes(extension)
  }

  const renderPreview = () => {
    const extension = file.name?.split('.').pop()?.toLowerCase()
    
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension) && file.url) {
      return (
        <div className="mt-4">
          <img 
            src={file.url} 
            alt={file.name}
            className="max-w-full max-h-96 object-contain rounded-lg border"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        </div>
      )
    }

    if (extension === 'pdf' && file.url) {
      return (
        <div className="mt-4">
          <iframe
            src={file.url}
            className="w-full h-96 border rounded-lg"
            title={file.name}
          />
        </div>
      )
    }

    return (
      <div className="mt-4 p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
        <div className="flex flex-col items-center space-y-2">
          {getFileIcon(file.name)}
          <p className="text-sm text-gray-500">Preview not available</p>
          <p className="text-xs text-gray-400">Download to view this file</p>
        </div>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getFileIcon(file.name)}
              <div>
                <h3 className="text-lg font-semibold">{file.name}</h3>
                <p className="text-sm text-gray-500">{getFileType(file.name)}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Details */}
          <div className="flex flex-wrap gap-4">
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>Size: {formatFileSize(file.size)}</span>
            </Badge>
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>Type: {getFileType(file.name)}</span>
            </Badge>
            {file.isPreview && (
              <Badge variant="outline" className="flex items-center space-x-1">
                <span>Preview File</span>
              </Badge>
            )}
          </div>

          {/* File Description */}
          {file.description && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-gray-600">{file.description}</p>
            </div>
          )}

          {/* File Preview */}
          {renderPreview()}

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-500">
              {canPreview(file.name) ? 'Preview available' : 'Preview not supported'}
            </div>
            <div className="flex space-x-2">
              {file.url && (
                <Button variant="outline" size="sm" asChild>
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in New Tab
                  </a>
                </Button>
              )}
              <Button 
                onClick={() => onDownload && onDownload(file)} 
                size="sm"
                disabled={!file.url}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default FilePreviewModal