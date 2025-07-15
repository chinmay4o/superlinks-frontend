import React, { useState, useRef, useCallback } from 'react'
import { NodeViewWrapper } from '@tiptap/react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card, CardContent } from '../ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { useFileUpload } from '../../hooks/useFileUpload'
import ProgressBar from '../ui/ProgressBar'
import {
  Upload,
  Image as ImageIcon,
  Edit3,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Download
} from 'lucide-react'

const ImageUploadComponent = ({ node, updateAttributes, deleteNode, editor }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [editForm, setEditForm] = useState({
    alt: node.attrs.alt || '',
    title: node.attrs.title || '',
    caption: node.attrs.caption || '',
    alignment: node.attrs.alignment || 'center',
    width: node.attrs.width || '',
    height: node.attrs.height || ''
  })
  const fileInputRef = useRef(null)

  const { uploadFile } = useFileUpload({
    showToasts: false,
    onUploadComplete: ({ result }) => {
      updateAttributes({
        src: result.file.url,
        fileId: result.file.id,
        alt: editForm.alt || result.file.originalName,
        title: editForm.title || result.file.originalName
      })
      setIsUploading(false)
    },
    onUploadError: (error) => {
      console.error('Image upload failed:', error)
      setIsUploading(false)
    }
  })

  const handleFileSelect = useCallback(async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (10MB limit for images)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size must be less than 10MB')
      return
    }

    setIsUploading(true)
    
    try {
      await uploadFile(file, {
        uploadType: 'content',
        folder: 'images'
      })
    } catch (error) {
      console.error('Upload failed:', error)
      setIsUploading(false)
    }

    // Reset file input
    event.target.value = ''
  }, [uploadFile, updateAttributes])

  const handleUrlUpload = useCallback((url) => {
    if (!url) return

    // Basic URL validation
    try {
      new URL(url)
      updateAttributes({
        src: url,
        alt: editForm.alt || 'Image',
        title: editForm.title || 'Image'
      })
    } catch (error) {
      alert('Please enter a valid URL')
    }
  }, [updateAttributes, editForm])

  const handleEditSave = useCallback(() => {
    updateAttributes({
      alt: editForm.alt,
      title: editForm.title,
      caption: editForm.caption,
      alignment: editForm.alignment,
      width: editForm.width || null,
      height: editForm.height || null
    })
    setIsEditDialogOpen(false)
  }, [updateAttributes, editForm])

  const handleAlignmentChange = useCallback((alignment) => {
    updateAttributes({ alignment })
  }, [updateAttributes])

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  // If no image is uploaded yet, show upload interface
  if (!node.attrs.src) {
    return (
      <NodeViewWrapper className="image-upload-placeholder">
        <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
          <CardContent className="p-6">
            {isUploading ? (
              <div className="text-center space-y-4">
                <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto" />
                <p className="text-sm text-gray-600">Uploading image...</p>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Add Image</h3>
                  <p className="text-sm text-gray-600">Upload an image or enter URL</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button onClick={openFileDialog} className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Image
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const url = prompt('Enter image URL:')
                      if (url) handleUrlUpload(url)
                    }}
                  >
                    Add URL
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Supports JPG, PNG, GIF, WebP (max 10MB)
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </NodeViewWrapper>
    )
  }

  // Image is uploaded, show the image with controls
  return (
    <NodeViewWrapper className="image-block">
      <figure 
        className={`image-wrapper image-${node.attrs.alignment} relative group`}
        style={{ textAlign: node.attrs.alignment }}
      >
        {/* Image Controls Overlay */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-lg shadow-md p-1 flex gap-1 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditDialogOpen(true)}
            title="Edit image"
            className="h-8 w-8 p-0"
          >
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAlignmentChange('left')}
            title="Align left"
            className={`h-8 w-8 p-0 ${node.attrs.alignment === 'left' ? 'bg-gray-100' : ''}`}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAlignmentChange('center')}
            title="Align center"
            className={`h-8 w-8 p-0 ${node.attrs.alignment === 'center' ? 'bg-gray-100' : ''}`}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAlignmentChange('right')}
            title="Align right"
            className={`h-8 w-8 p-0 ${node.attrs.alignment === 'right' ? 'bg-gray-100' : ''}`}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={deleteNode}
            title="Delete image"
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* The Image */}
        <img
          src={node.attrs.src}
          alt={node.attrs.alt || ''}
          title={node.attrs.title || ''}
          style={{
            maxWidth: '100%',
            height: 'auto',
            borderRadius: '8px',
            display: 'block',
            margin: node.attrs.alignment === 'center' ? '0 auto' : 
                    node.attrs.alignment === 'right' ? '0 0 0 auto' : '0',
            width: node.attrs.width || 'auto',
            maxHeight: node.attrs.height || 'auto'
          }}
          draggable={false}
        />

        {/* Caption */}
        {node.attrs.caption && (
          <figcaption className="image-caption mt-2 text-sm text-gray-600 text-center italic">
            {node.attrs.caption}
          </figcaption>
        )}
      </figure>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Image</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="alt-text">Alt Text</Label>
              <Input
                id="alt-text"
                value={editForm.alt}
                onChange={(e) => setEditForm(prev => ({ ...prev, alt: e.target.value }))}
                placeholder="Describe the image for accessibility"
              />
            </div>

            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editForm.title}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Image title (tooltip text)"
              />
            </div>

            <div>
              <Label htmlFor="caption">Caption</Label>
              <Input
                id="caption"
                value={editForm.caption}
                onChange={(e) => setEditForm(prev => ({ ...prev, caption: e.target.value }))}
                placeholder="Caption text below image"
              />
            </div>

            <div>
              <Label htmlFor="alignment">Alignment</Label>
              <Select 
                value={editForm.alignment} 
                onValueChange={(value) => setEditForm(prev => ({ ...prev, alignment: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="width">Width (px)</Label>
                <Input
                  id="width"
                  type="number"
                  value={editForm.width}
                  onChange={(e) => setEditForm(prev => ({ ...prev, width: e.target.value }))}
                  placeholder="Auto"
                />
              </div>
              <div>
                <Label htmlFor="height">Height (px)</Label>
                <Input
                  id="height"
                  type="number"
                  value={editForm.height}
                  onChange={(e) => setEditForm(prev => ({ ...prev, height: e.target.value }))}
                  placeholder="Auto"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSave}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </NodeViewWrapper>
  )
}

export default ImageUploadComponent