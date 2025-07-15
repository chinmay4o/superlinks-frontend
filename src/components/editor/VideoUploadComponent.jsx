import React, { useState, useRef, useCallback } from 'react'
import { NodeViewWrapper } from '@tiptap/react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card, CardContent } from '../ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog'
import { useFileUpload } from '../../hooks/useFileUpload'
import ProgressBar from '../ui/ProgressBar'
import {
  Upload,
  Video,
  Edit3,
  Trash2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Download
} from 'lucide-react'

const VideoUploadComponent = ({ node, updateAttributes, deleteNode, editor }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [editForm, setEditForm] = useState({
    title: node.attrs.title || '',
    caption: node.attrs.caption || '',
    autoplay: node.attrs.autoplay || false,
    controls: node.attrs.controls !== false,
    loop: node.attrs.loop || false,
    width: node.attrs.width || '',
    height: node.attrs.height || ''
  })
  const fileInputRef = useRef(null)
  const videoRef = useRef(null)

  const { uploadFile, progress } = useFileUpload({
    showToasts: false,
    onUploadComplete: ({ result }) => {
      updateAttributes({
        src: result.file.url,
        fileId: result.file.id,
        title: editForm.title || result.file.originalName,
        poster: result.file.thumbnail || null
      })
      setIsUploading(false)
    },
    onUploadError: (error) => {
      console.error('Video upload failed:', error)
      setIsUploading(false)
    }
  })

  const handleFileSelect = useCallback(async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('video/')) {
      alert('Please select a video file')
      return
    }

    // Validate file size (100MB limit for videos)
    if (file.size > 100 * 1024 * 1024) {
      alert('Video size must be less than 100MB')
      return
    }

    setIsUploading(true)
    
    try {
      await uploadFile(file, {
        uploadType: 'content',
        folder: 'videos'
      })
    } catch (error) {
      console.error('Upload failed:', error)
      setIsUploading(false)
    }

    // Reset file input
    event.target.value = ''
  }, [uploadFile])

  const handleUrlUpload = useCallback((url) => {
    if (!url) return

    // Basic URL validation
    try {
      new URL(url)
      updateAttributes({
        src: url,
        title: editForm.title || 'Video',
        isExternal: true
      })
    } catch (error) {
      alert('Please enter a valid URL')
    }
  }, [updateAttributes, editForm])

  const handleEditSave = useCallback(() => {
    updateAttributes({
      title: editForm.title,
      caption: editForm.caption,
      autoplay: editForm.autoplay,
      controls: editForm.controls,
      loop: editForm.loop,
      width: editForm.width || null,
      height: editForm.height || null
    })
    setIsEditDialogOpen(false)
  }, [updateAttributes, editForm])

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  // If no video is uploaded yet, show upload interface
  if (!node.attrs.src) {
    return (
      <NodeViewWrapper className="video-upload-placeholder">
        <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
          <CardContent className="p-6">
            {isUploading ? (
              <div className="text-center space-y-4">
                <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto" />
                <p className="text-sm text-gray-600">Uploading video...</p>
                {progress.percentage > 0 && (
                  <div className="w-full max-w-xs mx-auto">
                    <ProgressBar 
                      progress={progress.percentage} 
                      size="sm"
                      className="mb-2"
                    />
                    <div className="text-xs text-gray-500 flex justify-between">
                      <span>{progress.percentage}%</span>
                      {progress.speed && <span>{progress.speed}</span>}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <Video className="h-12 w-12 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Add Video</h3>
                  <p className="text-sm text-gray-600">Upload a video file or enter URL</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button onClick={openFileDialog} className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Video
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const url = prompt('Enter video URL (YouTube, Vimeo, or direct link):')
                      if (url) handleUrlUpload(url)
                    }}
                  >
                    Add URL
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Supports MP4, WebM, OGV (max 100MB)
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </NodeViewWrapper>
    )
  }

  // Check if it's a YouTube or Vimeo URL
  const isYoutube = node.attrs.src?.includes('youtube.com') || node.attrs.src?.includes('youtu.be')
  const isVimeo = node.attrs.src?.includes('vimeo.com')
  
  // Convert YouTube/Vimeo URLs to embed format
  let embedSrc = node.attrs.src
  if (isYoutube) {
    const videoId = node.attrs.src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    if (videoId) {
      embedSrc = `https://www.youtube.com/embed/${videoId[1]}`
    }
  } else if (isVimeo) {
    const videoId = node.attrs.src.match(/vimeo\.com\/(\d+)/)
    if (videoId) {
      embedSrc = `https://player.vimeo.com/video/${videoId[1]}`
    }
  }

  // Video is uploaded/provided, show the video with controls
  return (
    <NodeViewWrapper className="video-block">
      <figure className="video-wrapper relative group">
        {/* Video Controls Overlay */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-lg shadow-md p-1 flex gap-1 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditDialogOpen(true)}
            title="Edit video"
            className="h-8 w-8 p-0"
          >
            <Edit3 className="h-4 w-4" />
          </Button>
          {!node.attrs.isExternal && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(node.attrs.src, '_blank')}
              title="Download video"
              className="h-8 w-8 p-0"
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={deleteNode}
            title="Delete video"
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* The Video */}
        <div className="relative">
          {isYoutube || isVimeo ? (
            <iframe
              src={embedSrc}
              title={node.attrs.title || 'Video'}
              width={node.attrs.width || '100%'}
              height={node.attrs.height || '400'}
              frameBorder="0"
              allowFullScreen
              className="w-full rounded-lg"
              style={{ minHeight: '300px' }}
            />
          ) : (
            <video
              ref={videoRef}
              src={node.attrs.src}
              poster={node.attrs.poster}
              controls={node.attrs.controls}
              autoPlay={node.attrs.autoplay}
              loop={node.attrs.loop}
              className="w-full rounded-lg"
              style={{
                width: node.attrs.width || '100%',
                height: node.attrs.height || 'auto',
                maxWidth: '100%'
              }}
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {/* Caption */}
        {node.attrs.caption && (
          <figcaption className="video-caption mt-2 text-sm text-gray-600 text-center italic">
            {node.attrs.caption}
          </figcaption>
        )}
      </figure>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Video</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editForm.title}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Video title"
              />
            </div>

            <div>
              <Label htmlFor="caption">Caption</Label>
              <Input
                id="caption"
                value={editForm.caption}
                onChange={(e) => setEditForm(prev => ({ ...prev, caption: e.target.value }))}
                placeholder="Caption text below video"
              />
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

            {!isYoutube && !isVimeo && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="controls"
                    checked={editForm.controls}
                    onChange={(e) => setEditForm(prev => ({ ...prev, controls: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="controls">Show controls</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="autoplay"
                    checked={editForm.autoplay}
                    onChange={(e) => setEditForm(prev => ({ ...prev, autoplay: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="autoplay">Autoplay</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="loop"
                    checked={editForm.loop}
                    onChange={(e) => setEditForm(prev => ({ ...prev, loop: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="loop">Loop video</Label>
                </div>
              </div>
            )}
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

export default VideoUploadComponent