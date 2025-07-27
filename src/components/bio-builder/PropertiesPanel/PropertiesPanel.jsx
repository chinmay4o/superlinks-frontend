import React from 'react'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Textarea } from '../../ui/textarea'
import { DebouncedInput } from '../../ui/debounced-input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { Button } from '../../ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs'
import { Plus, Trash2, Palette, Settings, Layout } from 'lucide-react'
import './PropertiesPanel.css'

export default function PropertiesPanel({ 
  selectedBlock, 
  onUpdateBlock, 
  theme, 
  onUpdateTheme 
}) {
  const [uploadingIndex, setUploadingIndex] = React.useState(null)

  const handleBackgroundImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }
    
    const formData = new FormData()
    formData.append('file', file)
    
    setUploadingIndex('background')
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005/api'}/upload/file`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      })
      
      if (response.ok) {
        const data = await response.json()
        onUpdateTheme({ 
          backgroundType: 'image',
          backgroundImage: { 
            url: data.file.url,
            position: 'center',
            size: 'cover',
            repeat: 'no-repeat',
            opacity: 1,
            blur: 0,
            overlay: ''
          }
        })
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Failed to upload background image')
      }
    } catch (error) {
      console.error('Error uploading background image:', error)
      alert('Failed to upload background image. Please try again.')
    } finally {
      setUploadingIndex(null)
    }
  }
  if (!selectedBlock) {
    return (
      <div className="properties-panel">
        <div className="empty-properties">
          <p>Select a block to edit its properties</p>
        </div>
      </div>
    )
  }

  const updateBlockContent = (field, value) => {
    onUpdateBlock(selectedBlock.id, {
      content: {
        ...selectedBlock.content,
        [field]: value
      }
    })
  }

  const renderBlockProperties = () => {
    switch (selectedBlock.type) {
      case 'header':
        const handleAvatarUpload = async (e) => {
          const file = e.target.files[0]
          if (!file) return
          
          // Check file size (limit to 5MB)
          if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB')
            return
          }
          
          const formData = new FormData()
          formData.append('file', file)
          
          setUploadingIndex('avatar')
          
          try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005/api'}/upload/file`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: formData
            })
            
            if (response.ok) {
              const data = await response.json()
              updateBlockContent('avatar', data.file.url)
            } else {
              const errorData = await response.json()
              alert(errorData.message || 'Failed to upload avatar')
            }
          } catch (error) {
            console.error('Error uploading avatar:', error)
            alert('Failed to upload avatar. Please try again.')
          } finally {
            setUploadingIndex(null)
          }
        }
        
        return (
          <div className="properties-section">
            <h3>Header Settings</h3>
            <div className="property-group">
              <Label htmlFor="avatar">Avatar</Label>
              {selectedBlock.content.avatar && (
                <div className="avatar-preview" style={{ marginBottom: '1rem' }}>
                  <img 
                    src={selectedBlock.content.avatar} 
                    alt="Avatar preview" 
                    style={{ 
                      width: '80px', 
                      height: '80px', 
                      borderRadius: '50%', 
                      objectFit: 'cover' 
                    }} 
                  />
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  style={{ display: 'none' }}
                  id="avatar-upload"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('avatar-upload').click()}
                  disabled={uploadingIndex === 'avatar'}
                  style={{ width: '100%' }}
                >
                  {uploadingIndex === 'avatar' ? 'Uploading...' : (selectedBlock.content.avatar ? 'Change Avatar' : 'Upload Avatar')}
                </Button>
                <DebouncedInput
                  id="avatar"
                  value={selectedBlock.content.avatar || ''}
                  onChange={(value) => updateBlockContent('avatar', value)}
                  placeholder="Or paste avatar URL"
                  delay={600}
                />
              </div>
            </div>
            <div className="property-group">
              <Label htmlFor="title">Title</Label>
              <DebouncedInput
                id="title"
                value={selectedBlock.content.title || ''}
                onChange={(value) => updateBlockContent('title', value)}
                placeholder="Your name"
                delay={300}
              />
            </div>
            <div className="property-group">
              <Label htmlFor="description">Bio Description</Label>
              <DebouncedInput
                id="description"
                value={selectedBlock.content.description || ''}
                onChange={(value) => updateBlockContent('description', value)}
                placeholder="Tell your audience about yourself"
                type="textarea"
                rows={3}
                delay={400}
              />
            </div>
            <div className="property-group">
              <Label htmlFor="location">Location</Label>
              <DebouncedInput
                id="location"
                value={selectedBlock.content.location || ''}
                onChange={(value) => updateBlockContent('location', value)}
                placeholder="New York, NY"
                delay={400}
              />
            </div>
          </div>
        )

      case 'text':
        return (
          <div className="properties-section">
            <h3>Text Settings</h3>
            <div className="property-group">
              <Label htmlFor="text">Text Content</Label>
              <DebouncedInput
                id="text"
                value={selectedBlock.content.text || ''}
                onChange={(value) => updateBlockContent('text', value)}
                placeholder="Enter your text"
                type="textarea"
                rows={4}
                delay={400}
              />
            </div>
            <div className="property-group">
              <Label htmlFor="alignment">Text Alignment</Label>
              <Select 
                value={selectedBlock.content.alignment || 'center'}
                onValueChange={(value) => updateBlockContent('alignment', value)}
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
            <div className="property-group">
              <Label htmlFor="fontSize">Font Size</Label>
              <Select 
                value={selectedBlock.content.fontSize || 'medium'}
                onValueChange={(value) => updateBlockContent('fontSize', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 'links':
        return (
          <div className="properties-section">
            <h3>Links Settings</h3>
            <div className="links-list">
              {(selectedBlock.content.links || []).map((link, index) => (
                <div key={link.id || index} className="link-item">
                  <div className="property-group">
                    <Label>Title</Label>
                    <DebouncedInput
                      value={link.title || ''}
                      onChange={(value) => {
                        const newLinks = [...(selectedBlock.content.links || [])]
                        newLinks[index] = { ...link, title: value }
                        updateBlockContent('links', newLinks)
                      }}
                      placeholder="Link title (e.g. My Website)"
                      delay={300}
                    />
                  </div>
                  <div className="property-group">
                    <Label>URL</Label>
                    <DebouncedInput
                      value={link.url || ''}
                      onChange={(value) => {
                        const newLinks = [...(selectedBlock.content.links || [])]
                        newLinks[index] = { ...link, url: value }
                        updateBlockContent('links', newLinks)
                      }}
                      placeholder="https://example.com"
                      delay={500}
                    />
                  </div>
                  <div className="property-group">
                    <Label>Description (Optional)</Label>
                    <DebouncedInput
                      value={link.description || ''}
                      onChange={(value) => {
                        const newLinks = [...(selectedBlock.content.links || [])]
                        newLinks[index] = { ...link, description: value }
                        updateBlockContent('links', newLinks)
                      }}
                      placeholder="Brief description of the link"
                      delay={400}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newLinks = (selectedBlock.content.links || []).filter((_, i) => i !== index)
                      updateBlockContent('links', newLinks)
                    }}
                    className="remove-link"
                    title="Remove this link"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newLinks = [...(selectedBlock.content.links || []), {
                    id: Date.now().toString(),
                    title: '',
                    url: '',
                    description: ''
                  }]
                  updateBlockContent('links', newLinks)
                }}
                className="add-link-button"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Link
              </Button>
            </div>
          </div>
        )

      case 'youtube':
        return (
          <div className="properties-section">
            <h3>YouTube Settings</h3>
            <div className="property-group">
              <Label>Layout</Label>
              <Select 
                value={selectedBlock.content.layout || 'grid'}
                onValueChange={(value) => updateBlockContent('layout', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="list">List</SelectItem>
                  <SelectItem value="carousel">Carousel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="videos-list">
              {(selectedBlock.content.videos || []).map((video, index) => (
                <div key={index} className="video-item">
                  <div className="property-group">
                    <Label>Video Title</Label>
                    <DebouncedInput
                      value={video.title || ''}
                      onChange={(value) => {
                        const newVideos = [...(selectedBlock.content.videos || [])]
                        newVideos[index] = { ...video, title: value }
                        updateBlockContent('videos', newVideos)
                      }}
                      placeholder="Video title (optional)"
                      delay={300}
                    />
                  </div>
                  <div className="property-group">
                    <Label>YouTube URL or Video ID</Label>
                    <DebouncedInput
                      value={video.videoId || ''}
                      onChange={(value) => {
                        const newVideos = [...(selectedBlock.content.videos || [])]
                        let videoId = value
                        
                        // Extract video ID from YouTube URL if full URL is provided
                        if (videoId.includes('youtube.com/watch?v=')) {
                          videoId = videoId.split('youtube.com/watch?v=')[1].split('&')[0]
                        } else if (videoId.includes('youtu.be/')) {
                          videoId = videoId.split('youtu.be/')[1].split('?')[0]
                        }
                        
                        newVideos[index] = { ...video, videoId: videoId }
                        updateBlockContent('videos', newVideos)
                      }}
                      placeholder="dQw4w9WgXcQ or https://youtube.com/watch?v=dQw4w9WgXcQ"
                      delay={600}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newVideos = (selectedBlock.content.videos || []).filter((_, i) => i !== index)
                      updateBlockContent('videos', newVideos)
                    }}
                    className="remove-link"
                    title="Remove this video"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newVideos = [...(selectedBlock.content.videos || []), {
                    title: '',
                    videoId: ''
                  }]
                  updateBlockContent('videos', newVideos)
                }}
                className="add-link-button"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Video
              </Button>
            </div>
          </div>
        )

      case 'contact':
        return (
          <div className="properties-section">
            <h3>Contact Form Settings</h3>
            <div className="property-group">
              <Label htmlFor="contact-title">Form Title</Label>
              <DebouncedInput
                id="contact-title"
                value={selectedBlock.content.title || ''}
                onChange={(value) => updateBlockContent('title', value)}
                placeholder="Get in Touch"
                delay={300}
              />
            </div>
            <div className="property-group">
              <Label htmlFor="contact-description">Description</Label>
              <DebouncedInput
                id="contact-description"
                value={selectedBlock.content.description || ''}
                onChange={(value) => updateBlockContent('description', value)}
                placeholder="Feel free to reach out to me"
                type="textarea"
                rows={2}
                delay={400}
              />
            </div>
            <div className="property-group">
              <Label htmlFor="submit-text">Submit Button Text</Label>
              <DebouncedInput
                id="submit-text"
                value={selectedBlock.content.submitText || ''}
                onChange={(value) => updateBlockContent('submitText', value)}
                placeholder="Send Message"
                delay={300}
              />
            </div>
            <div className="property-group">
              <Label>Form Fields</Label>
              <div className="form-fields">
                {['name', 'email', 'message'].map((field) => (
                  <div key={field} className="field-toggle">
                    <input
                      type="checkbox"
                      id={`field-${field}`}
                      checked={(selectedBlock.content.fields || []).includes(field)}
                      onChange={(e) => {
                        const currentFields = selectedBlock.content.fields || []
                        const newFields = e.target.checked
                          ? [...currentFields, field]
                          : currentFields.filter(f => f !== field)
                        updateBlockContent('fields', newFields)
                      }}
                    />
                    <label htmlFor={`field-${field}`}>
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'support':
        return (
          <div className="properties-section">
            <h3>Support Settings</h3>
            <div className="property-group">
              <Label htmlFor="support-title">Title</Label>
              <DebouncedInput
                id="support-title"
                value={selectedBlock.content.title || ''}
                onChange={(value) => updateBlockContent('title', value)}
                placeholder="Support Me"
                delay={300}
              />
            </div>
            <div className="property-group">
              <Label htmlFor="support-description">Description</Label>
              <DebouncedInput
                id="support-description"
                value={selectedBlock.content.description || ''}
                onChange={(value) => updateBlockContent('description', value)}
                placeholder="Help support my work and content creation"
                type="textarea"
                rows={2}
                delay={400}
              />
            </div>
          </div>
        )

      case 'newsletter':
        return (
          <div className="properties-section">
            <h3>Newsletter Settings</h3>
            <div className="property-group">
              <Label htmlFor="newsletter-title">Title</Label>
              <DebouncedInput
                id="newsletter-title"
                value={selectedBlock.content.title || ''}
                onChange={(value) => updateBlockContent('title', value)}
                placeholder="Stay Updated"
                delay={300}
              />
            </div>
            <div className="property-group">
              <Label htmlFor="newsletter-description">Description</Label>
              <DebouncedInput
                id="newsletter-description"
                value={selectedBlock.content.description || ''}
                onChange={(value) => updateBlockContent('description', value)}
                placeholder="Subscribe to get my latest updates"
                type="textarea"
                rows={2}
                delay={400}
              />
            </div>
            <div className="property-group">
              <Label htmlFor="newsletter-button">Button Text</Label>
              <DebouncedInput
                id="newsletter-button"
                value={selectedBlock.content.buttonText || ''}
                onChange={(value) => updateBlockContent('buttonText', value)}
                placeholder="Subscribe"
                delay={300}
              />
            </div>
          </div>
        )

      case 'gallery':
        const handleImageUpload = async (e, index) => {
          const file = e.target.files[0]
          if (!file) return
          
          // Check file size (limit to 5MB)
          if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB')
            return
          }
          
          const formData = new FormData()
          formData.append('file', file)
          
          setUploadingIndex(index)
          
          try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005/api'}/upload/file`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: formData
            })
            
            if (response.ok) {
              const data = await response.json()
              const newImages = [...(selectedBlock.content.images || [])]
              newImages[index] = { ...newImages[index], url: data.file.url }
              updateBlockContent('images', newImages)
            } else {
              const errorData = await response.json()
              alert(errorData.message || 'Failed to upload image')
            }
          } catch (error) {
            console.error('Error uploading image:', error)
            alert('Failed to upload image. Please try again.')
          } finally {
            setUploadingIndex(null)
          }
        }
        
        return (
          <div className="properties-section">
            <h3>Gallery Settings</h3>
            <div className="property-group">
              <Label>Layout</Label>
              <Select 
                value={selectedBlock.content.layout || 'grid'}
                onValueChange={(value) => updateBlockContent('layout', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="masonry">Masonry</SelectItem>
                  <SelectItem value="carousel">Carousel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="property-group">
              <Label>Columns</Label>
              <Select 
                value={String(selectedBlock.content.columns || 2)}
                onValueChange={(value) => updateBlockContent('columns', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Column</SelectItem>
                  <SelectItem value="2">2 Columns</SelectItem>
                  <SelectItem value="3">3 Columns</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="images-list">
              {(selectedBlock.content.images || []).map((image, index) => (
                <div key={index} className="image-item" style={{ 
                  marginBottom: '1.5rem', 
                  padding: '1rem', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '0.5rem' 
                }}>
                  {image.url && (
                    <div className="image-preview" style={{ marginBottom: '1rem' }}>
                      <img 
                        src={image.url} 
                        alt={image.alt || 'Gallery image'} 
                        style={{ 
                          width: '100%', 
                          height: '150px', 
                          objectFit: 'cover', 
                          borderRadius: '0.375rem' 
                        }} 
                      />
                    </div>
                  )}
                  <div className="property-group">
                    <Label>Upload Image</Label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, index)}
                        style={{ display: 'none' }}
                        id={`gallery-upload-${index}`}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById(`gallery-upload-${index}`).click()}
                        disabled={uploadingIndex === index}
                        style={{ width: '100%' }}
                      >
                        {uploadingIndex === index ? 'Uploading...' : (image.url ? 'Change Image' : 'Choose Image')}
                      </Button>
                    </div>
                  </div>
                  <div className="property-group">
                    <Label>Alt Text</Label>
                    <DebouncedInput
                      value={image.alt || ''}
                      onChange={(value) => {
                        const newImages = [...(selectedBlock.content.images || [])]
                        newImages[index] = { ...image, alt: value }
                        updateBlockContent('images', newImages)
                      }}
                      placeholder="Image description"
                      delay={400}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newImages = selectedBlock.content.images.filter((_, i) => i !== index)
                      updateBlockContent('images', newImages)
                    }}
                    className="remove-link"
                    style={{ marginTop: '0.5rem' }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove Image
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newImages = [...(selectedBlock.content.images || []), {
                    url: '',
                    alt: ''
                  }]
                  updateBlockContent('images', newImages)
                }}
                className="add-link-button"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Image
              </Button>
            </div>
          </div>
        )

      case 'social':
        const socialPlatforms = [
          'instagram', 'twitter', 'youtube', 'linkedin', 
          'facebook', 'tiktok', 'website', 'email'
        ]
        
        return (
          <div className="properties-section">
            <h3>Social Links Settings</h3>
            <div className="social-links-list">
              {socialPlatforms.map((platform) => {
                const currentLinks = selectedBlock.content.links || {}
                return (
                  <div key={platform} className="property-group">
                    <Label>{platform.charAt(0).toUpperCase() + platform.slice(1)}</Label>
                    <div className="social-input-group">
                      <DebouncedInput
                        value={currentLinks[platform] || ''}
                        onChange={(value) => {
                          const newLinks = { ...currentLinks }
                          if (value.trim() === '') {
                            // Remove the platform if empty
                            delete newLinks[platform]
                          } else {
                            newLinks[platform] = value
                          }
                          updateBlockContent('links', newLinks)
                        }}
                        placeholder={`Your ${platform} URL${platform === 'email' ? ' or email address' : ''}`}
                        delay={500}
                      />
                      {currentLinks[platform] && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newLinks = { ...currentLinks }
                            delete newLinks[platform]
                            updateBlockContent('links', newLinks)
                          }}
                          className="remove-social-link"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="social-help">
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '1rem' }}>
                Tip: Leave fields empty to hide social icons from your bio
              </p>
            </div>
          </div>
        )

      default:
        return (
          <div className="properties-section">
            <h3>{selectedBlock.type.charAt(0).toUpperCase() + selectedBlock.type.slice(1)} Settings</h3>
            <div className="coming-soon">
              <p style={{ 
                textAlign: 'center', 
                color: '#6b7280',
                fontSize: '14px',
                padding: '2rem 1rem'
              }}>
                Properties panel for {selectedBlock.type} block is coming soon!
              </p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="properties-panel">
      <Tabs defaultValue="content" className="properties-tabs">
        <TabsList className="tabs-list">
          <TabsTrigger value="content">
            <Layout className="h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="theme">
            <Palette className="h-4 w-4" />
            Theme
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="tab-content">
          {renderBlockProperties()}
        </TabsContent>

        <TabsContent value="theme" className="tab-content">
          <div className="properties-section">
            <h3>Theme Settings</h3>
            <div className="property-group">
              <Label>Theme Preset</Label>
              <Select 
                value={theme.theme || 'default'}
                onValueChange={(value) => onUpdateTheme({ theme: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="gradient">Gradient</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="neon">Neon</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="property-group">
              <Label>Font Family</Label>
              <Select 
                value={theme.fontFamily || 'inter'}
                onValueChange={(value) => onUpdateTheme({ fontFamily: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inter">Inter</SelectItem>
                  <SelectItem value="poppins">Poppins</SelectItem>
                  <SelectItem value="roboto">Roboto</SelectItem>
                  <SelectItem value="montserrat">Montserrat</SelectItem>
                  <SelectItem value="playfair">Playfair Display</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="property-group">
              <Label>Button Style</Label>
              <Select 
                value={theme.buttonStyle || 'rounded'}
                onValueChange={(value) => onUpdateTheme({ buttonStyle: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rounded">Rounded</SelectItem>
                  <SelectItem value="square">Square</SelectItem>
                  <SelectItem value="pill">Pill</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Move Background Section here */}
            <div className="property-group">
              <Label>Background Type</Label>
              <Select 
                value={theme.backgroundType || 'color'}
                onValueChange={(value) => onUpdateTheme({ backgroundType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="color">Color</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="gradient">Gradient</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="color-group">
              <Label>Colors</Label>
              <div className="color-inputs">
                <div className="color-input">
                  <Label>Primary</Label>
                  <div className="color-picker">
                    <input
                      type="color"
                      value={theme.primaryColor || '#000000'}
                      onChange={(e) => onUpdateTheme({ primaryColor: e.target.value })}
                    />
                    <DebouncedInput
                      value={theme.primaryColor || '#000000'}
                      onChange={(value) => onUpdateTheme({ primaryColor: value })}
                      placeholder="#000000"
                      delay={200}
                    />
                  </div>
                </div>
                <div className="color-input">
                  <Label>Background</Label>
                  <div className="color-picker">
                    <input
                      type="color"
                      value={theme.backgroundColor || '#ffffff'}
                      onChange={(e) => onUpdateTheme({ backgroundColor: e.target.value })}
                    />
                    <DebouncedInput
                      value={theme.backgroundColor || '#ffffff'}
                      onChange={(value) => onUpdateTheme({ backgroundColor: value })}
                      placeholder="#ffffff"
                      delay={200}
                    />
                  </div>
                </div>
                <div className="color-input">
                  <Label>Text</Label>
                  <div className="color-picker">
                    <input
                      type="color"
                      value={theme.textColor || '#000000'}
                      onChange={(e) => onUpdateTheme({ textColor: e.target.value })}
                    />
                    <DebouncedInput
                      value={theme.textColor || '#000000'}
                      onChange={(value) => onUpdateTheme({ textColor: value })}
                      placeholder="#000000"
                      delay={200}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Background Image Controls */}
            {theme.backgroundType === 'image' && (
              <div className="background-image-section">
                <div className="property-group">
                  <Label>Background Image</Label>
                  {theme.backgroundImage?.url && (
                    <div className="image-preview" style={{ marginBottom: '1rem' }}>
                      <img 
                        src={theme.backgroundImage.url} 
                        alt="Background preview" 
                        style={{ 
                          width: '100%', 
                          height: '120px', 
                          objectFit: 'cover', 
                          borderRadius: '0.375rem',
                          border: '1px solid #e5e7eb'
                        }} 
                      />
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleBackgroundImageUpload(e)}
                      style={{ display: 'none' }}
                      id="background-upload"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('background-upload').click()}
                      disabled={uploadingIndex === 'background'}
                      style={{ width: '100%' }}
                    >
                      {uploadingIndex === 'background' ? 'Uploading...' : (theme.backgroundImage?.url ? 'Change Background' : 'Upload Background')}
                    </Button>
                  </div>
                </div>

                <div className="property-group">
                  <Label>Position</Label>
                  <Select 
                    value={theme.backgroundImage?.position || 'center'}
                    onValueChange={(value) => onUpdateTheme({ 
                      backgroundImage: { ...theme.backgroundImage, position: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="top">Top</SelectItem>
                      <SelectItem value="bottom">Bottom</SelectItem>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="property-group">
                  <Label>Size</Label>
                  <Select 
                    value={theme.backgroundImage?.size || 'cover'}
                    onValueChange={(value) => onUpdateTheme({ 
                      backgroundImage: { ...theme.backgroundImage, size: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cover">Cover</SelectItem>
                      <SelectItem value="contain">Contain</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="property-group">
                  <Label>Opacity: {Math.round((theme.backgroundImage?.opacity || 1) * 100)}%</Label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={theme.backgroundImage?.opacity || 1}
                    onChange={(e) => onUpdateTheme({ 
                      backgroundImage: { ...theme.backgroundImage, opacity: parseFloat(e.target.value) }
                    })}
                    style={{ width: '100%' }}
                  />
                </div>

                <div className="property-group">
                  <Label>Blur: {theme.backgroundImage?.blur || 0}px</Label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="1"
                    value={theme.backgroundImage?.blur || 0}
                    onChange={(e) => onUpdateTheme({ 
                      backgroundImage: { ...theme.backgroundImage, blur: parseInt(e.target.value) }
                    })}
                    style={{ width: '100%' }}
                  />
                </div>

                <div className="property-group">
                  <Label>Overlay Color (for text readability)</Label>
                  <div className="color-picker">
                    <input
                      type="color"
                      value={theme.backgroundImage?.overlay || '#000000'}
                      onChange={(e) => onUpdateTheme({ 
                        backgroundImage: { ...theme.backgroundImage, overlay: e.target.value }
                      })}
                    />
                    <DebouncedInput
                      value={theme.backgroundImage?.overlay || ''}
                      onChange={(value) => onUpdateTheme({ 
                        backgroundImage: { ...theme.backgroundImage, overlay: value }
                      })}
                      placeholder="rgba(0,0,0,0.3) or #000000"
                      delay={300}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="tab-content">
          <div className="properties-section">
            <h3>Block Settings</h3>
            <div className="property-group">
              <Label>Animation</Label>
              <Select 
                value={selectedBlock.settings?.animation || 'fade-in'}
                onValueChange={(value) => onUpdateBlock(selectedBlock.id, {
                  settings: { ...selectedBlock.settings, animation: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="fade-in">Fade In</SelectItem>
                  <SelectItem value="slide-up">Slide Up</SelectItem>
                  <SelectItem value="slide-left">Slide Left</SelectItem>
                  <SelectItem value="zoom-in">Zoom In</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}