import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Link as LinkIcon, Plus, FileText, Download } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'

export function FileUploadArea({ files, onFilesChange, resourceLinks, onResourceLinksChange }) {
  const [newLinkUrl, setNewLinkUrl] = useState('')

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 100 // Simulated for now
    }))
    onFilesChange([...files, ...newFiles])
  }, [files, onFilesChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 100 * 1024 * 1024, // 100MB
    multiple: true
  })

  const removeFile = (fileId) => {
    onFilesChange(files.filter(f => f.id !== fileId))
  }

  const addResourceLink = () => {
    if (newLinkUrl.trim()) {
      const newLink = {
        id: Date.now(),
        url: newLinkUrl.trim(),
        title: extractTitleFromUrl(newLinkUrl)
      }
      onResourceLinksChange([...resourceLinks, newLink])
      setNewLinkUrl('')
    }
  }

  const removeResourceLink = (linkId) => {
    onResourceLinksChange(resourceLinks.filter(l => l.id !== linkId))
  }

  const extractTitleFromUrl = (url) => {
    try {
      const hostname = new URL(url).hostname
      return hostname.replace('www.', '')
    } catch {
      return url
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileTypeIcon = (type) => {
    if (type.includes('image')) return '🖼️'
    if (type.includes('video')) return '🎥'
    if (type.includes('audio')) return '🎵'
    if (type.includes('pdf')) return '📄'
    if (type.includes('zip') || type.includes('rar')) return '📦'
    return '📁'
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-muted-foreground/50'}
            `}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <p className="font-medium text-primary">
                  {isDragActive ? 'Drop the files here' : 'Upload'} or drag & drop
                </p>
                <p className="text-sm text-muted-foreground">
                  Unlimited files, 100MB total limit
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center text-muted-foreground">
            <span className="px-4">OR</span>
          </div>

          <div className="mt-4 flex gap-2">
            <Input
              placeholder="Add resource link"
              value={newLinkUrl}
              onChange={(e) => setNewLinkUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addResourceLink()}
            />
            <Button onClick={addResourceLink} disabled={!newLinkUrl.trim()}>
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">Uploads ({files.length})</h4>
          <div className="space-y-2">
            {files.map((file) => (
              <Card key={file.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-lg">
                        {getFileTypeIcon(file.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{formatFileSize(file.size)}</span>
                          {file.progress === 100 && (
                            <Badge variant="secondary" className="text-xs">
                              Uploaded
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(file.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Resource Links */}
      {resourceLinks.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">Resource Links ({resourceLinks.length})</h4>
          <div className="space-y-2">
            {resourceLinks.map((link) => (
              <Card key={link.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <LinkIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{link.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{link.url}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeResourceLink(link.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUploadArea