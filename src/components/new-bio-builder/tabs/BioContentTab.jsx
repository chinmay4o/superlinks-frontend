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