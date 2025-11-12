import React, { useState, useEffect } from 'react'
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

  const handleBioUpdate = (field, value) => {
    onUpdateBio({
      [field]: value
    })
  }

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
              value={bio?.title || ''}
              onChange={(e) => handleBioUpdate('title', e.target.value)}
              placeholder="Your name or brand"
            />
          </div>
          <div>
            <Label htmlFor="bio-description">Bio Description</Label>
            <Textarea
              id="bio-description"
              value={bio?.description || ''}
              onChange={(e) => handleBioUpdate('description', e.target.value)}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BLOCK_TYPES.map((blockType) => {
                const Icon = blockType.icon
                return (
                  <Button
                    key={blockType.type}
                    variant="outline"
                    className="h-auto p-4 flex-col items-start text-left space-y-2"
                    onClick={() => handleAddBlock(blockType.type)}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span className="font-medium">{blockType.label}</span>
                    </div>
                    <span className="text-xs text-gray-500">{blockType.description}</span>
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
                      <div 
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedBlock?.id === block.id 
                            ? 'border-blue-200 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => onSelectBlock(block)}
                      >
                        <SortableItem key={block.id} id={block.id}>
                          <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
                        </SortableItem>
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
  const [updateTimeout, setUpdateTimeout] = useState(null)

  // Update local content immediately for responsive UI
  const handleContentUpdate = (field, value) => {
    const newContent = {
      ...localContent,
      [field]: value
    }
    
    setLocalContent(newContent)

    // Clear previous timeout
    if (updateTimeout) {
      clearTimeout(updateTimeout)
    }

    // Debounce the actual update to parent
    const newTimeout = setTimeout(() => {
      onUpdate({
        content: newContent
      })
    }, 300) // 300ms debounce

    setUpdateTimeout(newTimeout)
  }

  // Update local content when block prop changes from outside
  useEffect(() => {
    setLocalContent(block.content || {})
  }, [block.id]) // Only update when block ID changes, not content

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeout) {
        clearTimeout(updateTimeout)
      }
    }
  }, [updateTimeout])

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
              onChange={(e) => handleContentUpdate('text', e.target.value)}
              placeholder="Enter your text here"
              rows={4}
            />
          </div>
        </div>
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