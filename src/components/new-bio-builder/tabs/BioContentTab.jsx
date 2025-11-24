import React, { useState, useEffect, useRef, useCallback } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Textarea } from '../../ui/textarea'
import { 
  Plus, GripVertical, Eye, EyeOff, Edit, Trash2, 
  User, Link, MessageSquare, Youtube, Mail, 
  Heart, Share, Image, ShoppingBag, Music, 
  Instagram, HelpCircle, Calendar
} from 'lucide-react'
import { SortableItem } from '../SortableItem'

const BLOCK_TYPES = [
  { type: 'header', label: 'Header', icon: User, description: 'Profile info with avatar and description' },
  { type: 'links', label: 'Links', icon: Link, description: 'Custom buttons linking anywhere' },
  { type: 'social', label: 'Social Links', icon: Share, description: 'Social media profile links' },
  { type: 'text', label: 'Text', icon: MessageSquare, description: 'Rich text content block' },
  { type: 'youtube', label: 'YouTube', icon: Youtube, description: 'Embed YouTube videos' },
  { type: 'gallery', label: 'Gallery', icon: Image, description: 'Photo gallery grid' },
  { type: 'products', label: 'Products', icon: ShoppingBag, description: 'Showcase your products' },
  { type: 'contact', label: 'Contact Form', icon: Mail, description: 'Contact form for inquiries' },
  { type: 'support', label: 'Support Me', icon: Heart, description: 'Accept donations and tips' },
  { type: 'music', label: 'Music', icon: Music, description: 'Audio player and playlist' },
  { type: 'instagram', label: 'Instagram Feed', icon: Instagram, description: 'Show Instagram posts' },
  { type: 'faq', label: 'FAQ', icon: HelpCircle, description: 'Frequently asked questions' },
  { type: 'calendar', label: 'Calendar', icon: Calendar, description: 'Booking and scheduling' }
]

export default function BioContentTab({ 
  bio, 
  blocks, 
  selectedBlock, 
  onSelectBlock, 
  onAddBlock, 
  onUpdateBlock, 
  onDeleteBlock, 
  onToggleBlock, 
  onReorderBlocks,
  onUpdateBio,
  loading 
}) {
  const [showAddBlocks, setShowAddBlocks] = useState(false)
  
  // Local state for form inputs to handle typing smoothly
  const [localTitle, setLocalTitle] = useState(bio?.profile?.title || '')
  const [localDescription, setLocalDescription] = useState(bio?.profile?.description || '')
  
  // Refs for debounce timeouts
  const titleTimeoutRef = useRef(null)
  const descriptionTimeoutRef = useRef(null)
  
  // Update local state when bio data changes from outside
  useEffect(() => {
    setLocalTitle(bio?.profile?.title || '')
    setLocalDescription(bio?.profile?.description || '')
  }, [bio?.profile?.title, bio?.profile?.description])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (active && over && active.id !== over.id) {
      const oldBlocks = [...blocks]
      const oldIndex = oldBlocks.findIndex(item => item.id === active.id)
      const newIndex = oldBlocks.findIndex(item => item.id === over.id)
      
      const newBlocks = arrayMove(oldBlocks, oldIndex, newIndex)
      onReorderBlocks(newBlocks)
    }
  }

  const handleAddBlock = async (blockType) => {
    await onAddBlock(blockType)
    setShowAddBlocks(false)
  }

  // Debounced update functions for smooth typing
  const handleTitleChange = useCallback((value) => {
    setLocalTitle(value)
    
    // Clear previous timeout
    if (titleTimeoutRef.current) {
      clearTimeout(titleTimeoutRef.current)
    }
    
    // Debounce API call
    titleTimeoutRef.current = setTimeout(() => {
      onUpdateBio({ title: value })
      titleTimeoutRef.current = null
    }, 500) // 500ms debounce for better UX
  }, [onUpdateBio])
  
  const handleDescriptionChange = useCallback((value) => {
    setLocalDescription(value)
    
    // Clear previous timeout
    if (descriptionTimeoutRef.current) {
      clearTimeout(descriptionTimeoutRef.current)
    }
    
    // Debounce API call
    descriptionTimeoutRef.current = setTimeout(() => {
      onUpdateBio({ description: value })
      descriptionTimeoutRef.current = null
    }, 500) // 500ms debounce for better UX
  }, [onUpdateBio])
  
  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (titleTimeoutRef.current) {
        clearTimeout(titleTimeoutRef.current)
      }
      if (descriptionTimeoutRef.current) {
        clearTimeout(descriptionTimeoutRef.current)
      }
    }
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="bio-title">Display Name</Label>
            <Input
              id="bio-title"
              value={localTitle}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Your name or brand"
            />
          </div>
          <div>
            <Label htmlFor="bio-description">Bio Description</Label>
            <Textarea
              id="bio-description"
              value={localDescription}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder="Tell your audience about yourself"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Add Blocks Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Content Blocks</CardTitle>
            <Button onClick={() => setShowAddBlocks(!showAddBlocks)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Block
            </Button>
          </div>
        </CardHeader>
        
        {showAddBlocks && (
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {BLOCK_TYPES.map((blockType) => {
                const Icon = blockType.icon
                return (
                  <Button
                    key={blockType.type}
                    variant="outline"
                    className="h-auto p-2 flex-col items-start text-left space-y-1 min-h-[60px]"
                    onClick={() => handleAddBlock(blockType.type)}
                  >
                    <div className="flex items-center gap-1.5">
                      <Icon className="h-3 w-3" />
                      <span className="font-medium text-sm">{blockType.label}</span>
                    </div>
                    <span className="text-xs text-gray-500 leading-tight overflow-hidden text-ellipsis">{blockType.description}</span>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Active Blocks */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Active Blocks ({blocks?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {!blocks?.length ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No blocks added yet</p>
              <p className="text-sm">Add your first block to get started</p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={blocks.map(b => b.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {blocks.map((block) => {
                    const blockType = BLOCK_TYPES.find(t => t.type === block.type)
                    const Icon = blockType?.icon || MessageSquare
                    
                    return (
                      <SortableItem key={block.id} id={block.id}>
                        <div 
                          className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                            selectedBlock?.id === block.id 
                              ? 'border-blue-200 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => onSelectBlock(block.id)}
                        >
                          <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
                          <Icon className="h-4 w-4 text-gray-600" />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{blockType?.label || block.type}</div>
                            <div className="text-xs text-gray-500">
                              {block.content?.title || block.content?.text || 'Click to edit'}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                onToggleBlock(block.id, !block.isActive)
                              }}
                            >
                              {block.isActive ? (
                                <Eye className="h-4 w-4" />
                              ) : (
                                <EyeOff className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                onDeleteBlock(block.id)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </SortableItem>
                    )
                  })}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>

      {/* Block Editor */}
      {selectedBlock && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Edit {BLOCK_TYPES.find(t => t.type === selectedBlock.type)?.label || selectedBlock.type}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BlockEditor 
              block={selectedBlock} 
              onUpdate={(updates) => onUpdateBlock(selectedBlock.id, updates)}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Simple block editor component
function BlockEditor({ block, onUpdate }) {
  const [localContent, setLocalContent] = useState(block.content || {})
  const timeoutRef = useRef(null)

  // Update local content immediately for responsive UI
  const handleContentUpdate = useCallback((field, value) => {
    const newContent = {
      ...localContent,
      [field]: value
    }
    
    setLocalContent(newContent)

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Debounce the actual update to parent
    timeoutRef.current = setTimeout(() => {
      onUpdate({
        content: newContent
      })
      timeoutRef.current = null
    }, 100) // 100ms debounce - faster response
  }, [localContent, onUpdate])

  // Update local content when block changes from outside
  useEffect(() => {
    setLocalContent(block.content || {})
  }, [block.id])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [])

  switch (block.type) {
    case 'header':
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={localContent?.title || ''}
              onChange={(e) => handleContentUpdate('title', e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={localContent?.description || ''}
              onChange={(e) => handleContentUpdate('description', e.target.value)}
              placeholder="Tell your audience about yourself"
              rows={3}
            />
          </div>
          <div>
            <Label>Location</Label>
            <Input
              value={localContent?.location || ''}
              onChange={(e) => handleContentUpdate('location', e.target.value)}
              placeholder="Your location"
            />
          </div>
        </div>
      )

    case 'text':
      return (
        <div className="space-y-4">
          <div>
            <Label>Text Content</Label>
            <Textarea
              value={localContent?.text || ''}
              onChange={(e) => {
                const newContent = {
                  ...localContent,
                  text: e.target.value
                }
                setLocalContent(newContent)
                handleContentUpdate('text', e.target.value)
              }}
              placeholder="Enter your text here"
              rows={4}
            />
          </div>
        </div>
      )

    case 'links':
      return (
        <LinksBlockEditor
          links={localContent?.links || []}
          onChange={(newLinks) => {
            const newContent = { ...localContent, links: newLinks }
            setLocalContent(newContent)
            onUpdate({ content: newContent })
          }}
        />
      )

    case 'social':
      return (
        <SocialBlockEditor
          socialLinks={localContent?.links || {}}
          onChange={(newLinks) => {
            const newContent = { ...localContent, links: newLinks }
            setLocalContent(newContent)
            onUpdate({ content: newContent })
          }}
        />
      )

    case 'youtube':
      return (
        <YouTubeBlockEditor
          content={localContent}
          onChange={(newContent) => {
            setLocalContent(newContent)
            onUpdate({ content: newContent })
          }}
        />
      )

    case 'gallery':
      return (
        <GalleryBlockEditor
          images={localContent?.images || []}
          onChange={(newImages) => {
            const newContent = { ...localContent, images: newImages }
            setLocalContent(newContent)
            onUpdate({ content: newContent })
          }}
        />
      )

    case 'products':
      return (
        <ProductsBlockEditor
          products={localContent?.products || []}
          onChange={(newProducts) => {
            const newContent = { ...localContent, products: newProducts }
            setLocalContent(newContent)
            onUpdate({ content: newContent })
          }}
        />
      )

    case 'contact':
      return (
        <ContactBlockEditor
          content={localContent}
          onChange={(newContent) => {
            setLocalContent(newContent)
            onUpdate({ content: newContent })
          }}
        />
      )

    case 'support':
      return (
        <SupportBlockEditor
          content={localContent}
          onChange={(newContent) => {
            setLocalContent(newContent)
            onUpdate({ content: newContent })
          }}
        />
      )

    case 'music':
      return (
        <MusicBlockEditor
          content={localContent}
          onChange={(newContent) => {
            setLocalContent(newContent)
            onUpdate({ content: newContent })
          }}
        />
      )

    case 'instagram':
      return (
        <InstagramBlockEditor
          content={localContent}
          onChange={(newContent) => {
            setLocalContent(newContent)
            onUpdate({ content: newContent })
          }}
        />
      )

    case 'faq':
      return (
        <FAQBlockEditor
          faqs={localContent?.faqs || []}
          onChange={(newFaqs) => {
            const newContent = { ...localContent, faqs: newFaqs }
            setLocalContent(newContent)
            onUpdate({ content: newContent })
          }}
        />
      )

    case 'calendar':
      return (
        <CalendarBlockEditor
          content={localContent}
          onChange={(newContent) => {
            setLocalContent(newContent)
            onUpdate({ content: newContent })
          }}
        />
      )

    default:
      return (
        <div className="p-4 border border-dashed rounded-lg text-center text-gray-500">
          <p>Advanced editor for {block.type} coming soon!</p>
          <p className="text-sm">This block will be displayed in the preview</p>
        </div>
      )
  }
}

// Links Block Editor Component
function LinksBlockEditor({ links, onChange }) {
  const [editingIndex, setEditingIndex] = useState(null)

  const addLink = () => {
    const newLink = {
      id: `link-${Date.now()}`,
      title: 'New Link',
      url: 'https://',
      icon: 'link'
    }
    onChange([...links, newLink])
    setEditingIndex(links.length)
  }

  const updateLink = (index, field, value) => {
    const newLinks = [...links]
    newLinks[index] = { ...newLinks[index], [field]: value }
    onChange(newLinks)
  }

  const deleteLink = (index) => {
    const newLinks = links.filter((_, i) => i !== index)
    onChange(newLinks)
    setEditingIndex(null)
  }

  const moveLink = (index, direction) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= links.length) return
    const newLinks = [...links]
    const [removed] = newLinks.splice(index, 1)
    newLinks.splice(newIndex, 0, removed)
    onChange(newLinks)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Links ({links.length})</Label>
        <Button size="sm" onClick={addLink}>
          <Plus className="h-4 w-4 mr-1" />
          Add Link
        </Button>
      </div>

      {links.length === 0 ? (
        <div className="p-4 border border-dashed rounded-lg text-center text-gray-500">
          <p>No links yet</p>
          <p className="text-sm">Click "Add Link" to create your first link</p>
        </div>
      ) : (
        <div className="space-y-2">
          {links.map((link, index) => (
            <div key={link.id} className="border rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{link.title || 'Untitled'}</span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveLink(index, -1)}
                    disabled={index === 0}
                  >
                    ↑
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveLink(index, 1)}
                    disabled={index === links.length - 1}
                  >
                    ↓
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteLink(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>

              {editingIndex === index && (
                <div className="space-y-2 pt-2 border-t">
                  <div>
                    <Label className="text-xs">Title</Label>
                    <Input
                      value={link.title || ''}
                      onChange={(e) => updateLink(index, 'title', e.target.value)}
                      placeholder="Link title"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">URL</Label>
                    <Input
                      value={link.url || ''}
                      onChange={(e) => updateLink(index, 'url', e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Social Block Editor Component
function SocialBlockEditor({ socialLinks, onChange }) {
  const SOCIAL_PLATFORMS = [
    { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/username' },
    { key: 'twitter', label: 'Twitter/X', placeholder: 'https://twitter.com/username' },
    { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@channel' },
    { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
    { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/username' },
    { key: 'website', label: 'Website', placeholder: 'https://yourwebsite.com' },
    { key: 'email', label: 'Email', placeholder: 'mailto:you@example.com' }
  ]

  const updateSocialLink = (key, value) => {
    onChange({ ...socialLinks, [key]: value })
  }

  return (
    <div className="space-y-4">
      <Label>Social Links</Label>
      <p className="text-xs text-gray-500">Add your social media profile URLs</p>

      <div className="space-y-3">
        {SOCIAL_PLATFORMS.map((platform) => (
          <div key={platform.key}>
            <Label className="text-xs">{platform.label}</Label>
            <Input
              value={socialLinks[platform.key] || ''}
              onChange={(e) => updateSocialLink(platform.key, e.target.value)}
              placeholder={platform.placeholder}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// YouTube Block Editor Component
function YouTubeBlockEditor({ content, onChange }) {
  const extractVideoId = (url) => {
    if (!url) return null
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/)
    return match ? match[1] : null
  }

  const videoId = extractVideoId(content?.url)

  return (
    <div className="space-y-4">
      <div>
        <Label>YouTube Video URL</Label>
        <Input
          value={content?.url || ''}
          onChange={(e) => onChange({ ...content, url: e.target.value })}
          placeholder="https://www.youtube.com/watch?v=..."
        />
        <p className="text-xs text-gray-500 mt-1">Paste a YouTube video link</p>
      </div>

      <div>
        <Label>Video Title (optional)</Label>
        <Input
          value={content?.title || ''}
          onChange={(e) => onChange({ ...content, title: e.target.value })}
          placeholder="Video title"
        />
      </div>

      {videoId && (
        <div className="mt-4">
          <Label className="text-xs text-gray-500">Preview</Label>
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mt-1">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={content?.title || 'YouTube video'}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// Gallery Block Editor Component
function GalleryBlockEditor({ images, onChange }) {
  const [editingIndex, setEditingIndex] = useState(null)

  const addImage = () => {
    const newImage = {
      id: `img-${Date.now()}`,
      url: '',
      alt: '',
      caption: ''
    }
    onChange([...images, newImage])
    setEditingIndex(images.length)
  }

  const updateImage = (index, field, value) => {
    const newImages = [...images]
    newImages[index] = { ...newImages[index], [field]: value }
    onChange(newImages)
  }

  const deleteImage = (index) => {
    const newImages = images.filter((_, i) => i !== index)
    onChange(newImages)
    setEditingIndex(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Gallery Images ({images.length})</Label>
        <Button size="sm" onClick={addImage}>
          <Plus className="h-4 w-4 mr-1" />
          Add Image
        </Button>
      </div>

      {images.length === 0 ? (
        <div className="p-4 border border-dashed rounded-lg text-center text-gray-500">
          <Image className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No images yet</p>
          <p className="text-sm">Click "Add Image" to add photos to your gallery</p>
        </div>
      ) : (
        <div className="space-y-2">
          {images.map((image, index) => (
            <div key={image.id} className="border rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {image.url && (
                    <img src={image.url} alt={image.alt} className="w-10 h-10 object-cover rounded" />
                  )}
                  <span className="font-medium text-sm">{image.caption || image.alt || 'Untitled'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteImage(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>

              {editingIndex === index && (
                <div className="space-y-2 pt-2 border-t">
                  <div>
                    <Label className="text-xs">Image URL</Label>
                    <Input
                      value={image.url || ''}
                      onChange={(e) => updateImage(index, 'url', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Alt Text</Label>
                    <Input
                      value={image.alt || ''}
                      onChange={(e) => updateImage(index, 'alt', e.target.value)}
                      placeholder="Image description"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Caption</Label>
                    <Input
                      value={image.caption || ''}
                      onChange={(e) => updateImage(index, 'caption', e.target.value)}
                      placeholder="Optional caption"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Products Block Editor Component
function ProductsBlockEditor({ products, onChange }) {
  const [editingIndex, setEditingIndex] = useState(null)

  const addProduct = () => {
    const newProduct = {
      id: `product-${Date.now()}`,
      title: 'New Product',
      description: '',
      price: '',
      url: '',
      image: ''
    }
    onChange([...products, newProduct])
    setEditingIndex(products.length)
  }

  const updateProduct = (index, field, value) => {
    const newProducts = [...products]
    newProducts[index] = { ...newProducts[index], [field]: value }
    onChange(newProducts)
  }

  const deleteProduct = (index) => {
    const newProducts = products.filter((_, i) => i !== index)
    onChange(newProducts)
    setEditingIndex(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Products ({products.length})</Label>
        <Button size="sm" onClick={addProduct}>
          <Plus className="h-4 w-4 mr-1" />
          Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="p-4 border border-dashed rounded-lg text-center text-gray-500">
          <ShoppingBag className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No products yet</p>
          <p className="text-sm">Click "Add Product" to showcase your products</p>
        </div>
      ) : (
        <div className="space-y-2">
          {products.map((product, index) => (
            <div key={product.id} className="border rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {product.image && (
                    <img src={product.image} alt={product.title} className="w-10 h-10 object-cover rounded" />
                  )}
                  <div>
                    <span className="font-medium text-sm">{product.title || 'Untitled'}</span>
                    {product.price && <span className="text-xs text-gray-500 ml-2">{product.price}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteProduct(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>

              {editingIndex === index && (
                <div className="space-y-2 pt-2 border-t">
                  <div>
                    <Label className="text-xs">Product Name</Label>
                    <Input
                      value={product.title || ''}
                      onChange={(e) => updateProduct(index, 'title', e.target.value)}
                      placeholder="Product name"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Description</Label>
                    <Textarea
                      value={product.description || ''}
                      onChange={(e) => updateProduct(index, 'description', e.target.value)}
                      placeholder="Product description"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Price</Label>
                      <Input
                        value={product.price || ''}
                        onChange={(e) => updateProduct(index, 'price', e.target.value)}
                        placeholder="$29.99"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Product URL</Label>
                      <Input
                        value={product.url || ''}
                        onChange={(e) => updateProduct(index, 'url', e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Image URL</Label>
                    <Input
                      value={product.image || ''}
                      onChange={(e) => updateProduct(index, 'image', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Contact Block Editor Component
function ContactBlockEditor({ content, onChange }) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Contact Form Title</Label>
        <Input
          value={content?.title || ''}
          onChange={(e) => onChange({ ...content, title: e.target.value })}
          placeholder="Get in touch"
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={content?.description || ''}
          onChange={(e) => onChange({ ...content, description: e.target.value })}
          placeholder="Let visitors know how to reach you"
          rows={2}
        />
      </div>

      <div>
        <Label>Email Address</Label>
        <Input
          value={content?.email || ''}
          onChange={(e) => onChange({ ...content, email: e.target.value })}
          placeholder="your@email.com"
        />
        <p className="text-xs text-gray-500 mt-1">Form submissions will be sent to this email</p>
      </div>

      <div className="space-y-2">
        <Label>Form Fields</Label>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={content?.fields?.name !== false}
              onChange={(e) => onChange({
                ...content,
                fields: { ...content?.fields, name: e.target.checked }
              })}
            />
            <span className="text-sm">Name field</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={content?.fields?.email !== false}
              onChange={(e) => onChange({
                ...content,
                fields: { ...content?.fields, email: e.target.checked }
              })}
            />
            <span className="text-sm">Email field</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={content?.fields?.phone !== false}
              onChange={(e) => onChange({
                ...content,
                fields: { ...content?.fields, phone: e.target.checked }
              })}
            />
            <span className="text-sm">Phone field</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={content?.fields?.message !== false}
              onChange={(e) => onChange({
                ...content,
                fields: { ...content?.fields, message: e.target.checked }
              })}
            />
            <span className="text-sm">Message field</span>
          </label>
        </div>
      </div>
    </div>
  )
}

// Support Block Editor Component
function SupportBlockEditor({ content, onChange }) {
  const SUPPORT_PLATFORMS = [
    { key: 'paypal', label: 'PayPal', placeholder: 'https://paypal.me/username' },
    { key: 'kofi', label: 'Ko-fi', placeholder: 'https://ko-fi.com/username' },
    { key: 'buymeacoffee', label: 'Buy Me a Coffee', placeholder: 'https://buymeacoffee.com/username' },
    { key: 'patreon', label: 'Patreon', placeholder: 'https://patreon.com/username' },
    { key: 'gumroad', label: 'Gumroad', placeholder: 'https://gumroad.com/username' },
    { key: 'venmo', label: 'Venmo', placeholder: '@username' },
    { key: 'cashapp', label: 'Cash App', placeholder: '$cashtag' }
  ]

  return (
    <div className="space-y-4">
      <div>
        <Label>Support Title</Label>
        <Input
          value={content?.title || ''}
          onChange={(e) => onChange({ ...content, title: e.target.value })}
          placeholder="Support My Work"
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={content?.description || ''}
          onChange={(e) => onChange({ ...content, description: e.target.value })}
          placeholder="Help me create more content"
          rows={2}
        />
      </div>

      <div className="space-y-3">
        <Label>Payment Links</Label>
        <p className="text-xs text-gray-500">Add your payment platform links</p>

        {SUPPORT_PLATFORMS.map((platform) => (
          <div key={platform.key}>
            <Label className="text-xs">{platform.label}</Label>
            <Input
              value={content?.links?.[platform.key] || ''}
              onChange={(e) => onChange({
                ...content,
                links: { ...content?.links, [platform.key]: e.target.value }
              })}
              placeholder={platform.placeholder}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// Music Block Editor Component
function MusicBlockEditor({ content, onChange }) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Music Title</Label>
        <Input
          value={content?.title || ''}
          onChange={(e) => onChange({ ...content, title: e.target.value })}
          placeholder="My Music"
        />
      </div>

      <div>
        <Label>Spotify Embed URL</Label>
        <Input
          value={content?.spotifyUrl || ''}
          onChange={(e) => onChange({ ...content, spotifyUrl: e.target.value })}
          placeholder="https://open.spotify.com/track/..."
        />
        <p className="text-xs text-gray-500 mt-1">Paste a Spotify track, album, or playlist URL</p>
      </div>

      <div>
        <Label>SoundCloud URL</Label>
        <Input
          value={content?.soundcloudUrl || ''}
          onChange={(e) => onChange({ ...content, soundcloudUrl: e.target.value })}
          placeholder="https://soundcloud.com/..."
        />
      </div>

      <div>
        <Label>Apple Music URL</Label>
        <Input
          value={content?.appleMusicUrl || ''}
          onChange={(e) => onChange({ ...content, appleMusicUrl: e.target.value })}
          placeholder="https://music.apple.com/..."
        />
      </div>

      <div>
        <Label>YouTube Music URL</Label>
        <Input
          value={content?.youtubeMusicUrl || ''}
          onChange={(e) => onChange({ ...content, youtubeMusicUrl: e.target.value })}
          placeholder="https://music.youtube.com/..."
        />
      </div>
    </div>
  )
}

// Instagram Block Editor Component
function InstagramBlockEditor({ content, onChange }) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Instagram Username</Label>
        <Input
          value={content?.username || ''}
          onChange={(e) => onChange({ ...content, username: e.target.value })}
          placeholder="@username"
        />
        <p className="text-xs text-gray-500 mt-1">Enter your Instagram username to show your feed</p>
      </div>

      <div>
        <Label>Instagram Profile URL</Label>
        <Input
          value={content?.profileUrl || ''}
          onChange={(e) => onChange({ ...content, profileUrl: e.target.value })}
          placeholder="https://instagram.com/username"
        />
      </div>

      <div>
        <Label>Number of Posts to Show</Label>
        <Input
          type="number"
          min="1"
          max="12"
          value={content?.postsCount || 6}
          onChange={(e) => onChange({ ...content, postsCount: parseInt(e.target.value) || 6 })}
        />
      </div>

      <div>
        <Label>Display Style</Label>
        <select
          className="w-full p-2 border rounded-md"
          value={content?.displayStyle || 'grid'}
          onChange={(e) => onChange({ ...content, displayStyle: e.target.value })}
        >
          <option value="grid">Grid</option>
          <option value="carousel">Carousel</option>
          <option value="list">List</option>
        </select>
      </div>
    </div>
  )
}

// FAQ Block Editor Component
function FAQBlockEditor({ faqs, onChange }) {
  const [editingIndex, setEditingIndex] = useState(null)

  const addFAQ = () => {
    const newFAQ = {
      id: `faq-${Date.now()}`,
      question: '',
      answer: ''
    }
    onChange([...faqs, newFAQ])
    setEditingIndex(faqs.length)
  }

  const updateFAQ = (index, field, value) => {
    const newFAQs = [...faqs]
    newFAQs[index] = { ...newFAQs[index], [field]: value }
    onChange(newFAQs)
  }

  const deleteFAQ = (index) => {
    const newFAQs = faqs.filter((_, i) => i !== index)
    onChange(newFAQs)
    setEditingIndex(null)
  }

  const moveFAQ = (index, direction) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= faqs.length) return
    const newFAQs = [...faqs]
    const [removed] = newFAQs.splice(index, 1)
    newFAQs.splice(newIndex, 0, removed)
    onChange(newFAQs)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>FAQ Items ({faqs.length})</Label>
        <Button size="sm" onClick={addFAQ}>
          <Plus className="h-4 w-4 mr-1" />
          Add Question
        </Button>
      </div>

      {faqs.length === 0 ? (
        <div className="p-4 border border-dashed rounded-lg text-center text-gray-500">
          <HelpCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No FAQ items yet</p>
          <p className="text-sm">Click "Add Question" to add frequently asked questions</p>
        </div>
      ) : (
        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <div key={faq.id} className="border rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm truncate flex-1">{faq.question || 'New Question'}</span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveFAQ(index, -1)}
                    disabled={index === 0}
                  >
                    ↑
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveFAQ(index, 1)}
                    disabled={index === faqs.length - 1}
                  >
                    ↓
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteFAQ(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>

              {editingIndex === index && (
                <div className="space-y-2 pt-2 border-t">
                  <div>
                    <Label className="text-xs">Question</Label>
                    <Input
                      value={faq.question || ''}
                      onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                      placeholder="What is your question?"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Answer</Label>
                    <Textarea
                      value={faq.answer || ''}
                      onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                      placeholder="Your answer here..."
                      rows={3}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Calendar Block Editor Component
function CalendarBlockEditor({ content, onChange }) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Calendar Title</Label>
        <Input
          value={content?.title || ''}
          onChange={(e) => onChange({ ...content, title: e.target.value })}
          placeholder="Book a Meeting"
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={content?.description || ''}
          onChange={(e) => onChange({ ...content, description: e.target.value })}
          placeholder="Schedule time with me"
          rows={2}
        />
      </div>

      <div>
        <Label>Calendly URL</Label>
        <Input
          value={content?.calendlyUrl || ''}
          onChange={(e) => onChange({ ...content, calendlyUrl: e.target.value })}
          placeholder="https://calendly.com/username"
        />
      </div>

      <div>
        <Label>Cal.com URL</Label>
        <Input
          value={content?.calUrl || ''}
          onChange={(e) => onChange({ ...content, calUrl: e.target.value })}
          placeholder="https://cal.com/username"
        />
      </div>

      <div>
        <Label>Google Calendar Embed</Label>
        <Input
          value={content?.googleCalendarUrl || ''}
          onChange={(e) => onChange({ ...content, googleCalendarUrl: e.target.value })}
          placeholder="Google Calendar embed URL"
        />
      </div>

      <div>
        <Label>Button Text</Label>
        <Input
          value={content?.buttonText || ''}
          onChange={(e) => onChange({ ...content, buttonText: e.target.value })}
          placeholder="Schedule Now"
        />
      </div>
    </div>
  )
}