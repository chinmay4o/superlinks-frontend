import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image } from 'lucide-react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'

export function CoverImageUpload({ image, onImageChange }) {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        onImageChange({
          file,
          preview: e.target.result,
          name: file.name,
          size: file.size
        })
      }
      reader.readAsDataURL(file)
    }
  }, [onImageChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.webm', '.ogg']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  })

  const removeImage = () => {
    onImageChange(null)
  }

  if (image) {
    return (
      <Card className="relative overflow-hidden">
        <div className="aspect-video bg-muted flex items-center justify-center">
          {image.preview ? (
            <img 
              src={image.preview} 
              alt="Cover preview" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Image className="h-8 w-8" />
              <span className="text-sm">{image.name}</span>
              <span className="text-xs">{(image.size / 1024 / 1024).toFixed(1)} MB</span>
            </div>
          )}
        </div>
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8"
          onClick={removeImage}
        >
          <X className="h-4 w-4" />
        </Button>
      </Card>
    )
  }

  return (
    <Card>
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
            <p className="font-medium">
              {isDragActive ? 'Drop the file here' : 'Upload'} or drag & drop
            </p>
            <p className="text-sm text-muted-foreground">
              Images and videos up to 10MB
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default CoverImageUpload