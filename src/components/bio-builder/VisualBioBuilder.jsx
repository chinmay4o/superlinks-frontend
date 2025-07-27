import React, { useState, useEffect } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Button } from '../ui/button'
import { useAuth } from '../../contexts/AuthContext'
import BlocksPanel from './BlocksPanel/BlocksPanel'
import MobilePreview from './MobilePreview/MobilePreview'
import PropertiesPanel from './PropertiesPanel/PropertiesPanel'
import { useDebouncedCallback } from '../../hooks/useDebounce'
import toast from 'react-hot-toast'
import './VisualBioBuilder.css'

const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005/api'

export default function VisualBioBuilder() {
  const { user } = useAuth()
  const [blocks, setBlocks] = useState([])
  const [selectedBlock, setSelectedBlock] = useState(null)
  const [bio, setBio] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [previewKey, setPreviewKey] = useState(0)

  // Debounced save function for customization updates
  const debouncedSaveCustomization = useDebouncedCallback(async (customizationData) => {
    try {
      const response = await fetch(`${API_URL}/bio/customization`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(customizationData)
      })
      
      if (!response.ok) {
        throw new Error('Failed to save customization')
      }
      
      const data = await response.json()
      console.log('Customization saved:', data.message)
    } catch (error) {
      console.error('Error saving customization:', error)
      toast.error('Failed to save customization')
    }
  }, 500) // 500ms delay

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    fetchBio()
  }, [])

  const fetchBio = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/bio`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setBio(data.bio)
        // Use blocks from API response, or convert old format if needed
        const loadedBlocks = data.bio.blocks || convertBioToBlocks(data.bio)
        setBlocks(loadedBlocks)
        
        // Automatically select the first block if available
        if (loadedBlocks.length > 0) {
          setSelectedBlock(loadedBlocks[0])
        }
      }
    } catch (error) {
      console.error('Error fetching bio:', error)
      toast.error('Failed to load bio')
    } finally {
      setLoading(false)
    }
  }

  const convertBioToBlocks = (bioData) => {
    const blocks = []
    
    // Header block
    if (bioData.profile) {
      blocks.push({
        id: 'header-' + Date.now(),
        type: 'header',
        order: 0,
        isActive: true,
        content: {
          avatar: bioData.profile.avatar,
          title: bioData.profile.title,
          description: bioData.profile.description,
          location: bioData.profile.location
        }
      })
    }

    // Links block
    if (bioData.links && bioData.links.length > 0) {
      blocks.push({
        id: 'links-' + Date.now(),
        type: 'links',
        order: 1,
        isActive: true,
        content: {
          links: bioData.links
        }
      })
    }

    // Social links block
    if (bioData.socialLinks && Object.values(bioData.socialLinks).some(url => url)) {
      blocks.push({
        id: 'social-' + Date.now(),
        type: 'social',
        order: 2,
        isActive: true,
        content: {
          links: bioData.socialLinks
        }
      })
    }

    return blocks
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldBlocks = [...blocks]
      const oldIndex = oldBlocks.findIndex(item => item.id === active.id)
      const newIndex = oldBlocks.findIndex(item => item.id === over.id)
      
      const newBlocks = arrayMove(oldBlocks, oldIndex, newIndex)
      const blockOrders = newBlocks.map((block, index) => ({
        id: block.id,
        order: index
      }))

      // Optimistically update UI
      setBlocks(newBlocks.map((block, index) => ({
        ...block,
        order: index
      })))
      setPreviewKey(prev => prev + 1)

      // Update backend
      try {
        console.log('Sending blockOrders:', blockOrders)
        const response = await fetch(`${API_URL}/bio/blocks/reorder`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ blockOrders })
        })

        const data = await response.json()

        if (response.ok) {
          setBlocks(data.bio.blocks || [])
          setBio(data.bio)
        } else {
          // Revert on error
          setBlocks(oldBlocks)
          toast.error(data.message || 'Failed to reorder blocks')
        }
      } catch (error) {
        // Revert on error
        setBlocks(oldBlocks)
        console.error('Error reordering blocks:', error)
        toast.error('Failed to reorder blocks')
      }
    }
  }

  const addBlock = async (blockType) => {
    try {
      const blockTemplate = createNewBlock(blockType)
      
      const response = await fetch(`${API_URL}/bio/blocks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          type: blockType,
          content: blockTemplate.content,
          settings: blockTemplate.settings,
          order: blocks.length
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setBlocks(data.bio.blocks || [])
        setBio(data.bio)
        setSelectedBlock(data.block)
        setPreviewKey(prev => prev + 1)
        // toast.success(`${blockType} block added`) // Disabled to reduce toast spam
      } else {
        toast.error(data.message || 'Failed to add block')
      }
    } catch (error) {
      console.error('Error adding block:', error)
      toast.error('Failed to add block')
    }
  }

  const createNewBlock = (type) => {
    const blockTemplates = {
      header: {
        avatar: '',
        title: user?.name || 'Your Name',
        description: 'Tell your audience about yourself',
        location: ''
      },
      text: {
        text: 'Add your text here',
        alignment: 'center',
        fontSize: 'medium'
      },
      links: {
        links: []
      },
      youtube: {
        videos: [],
        layout: 'grid'
      },
      contact: {
        fields: ['name', 'email', 'message'],
        submitText: 'Send Message'
      },
      support: {
        platforms: ['buymeacoffee', 'patreon'],
        customAmount: true,
        title: 'Support Me'
      },
      social: {
        links: {
          instagram: '',
          twitter: '',
          youtube: '',
          linkedin: '',
          facebook: '',
          website: '',
          email: ''
        }
      },
      gallery: {
        images: [],
        layout: 'grid',
        columns: 2
      },
      products: {
        products: [],
        layout: 'grid',
        showPrice: true
      },
      newsletter: {
        title: 'Stay Updated',
        description: 'Subscribe to get my latest updates',
        buttonText: 'Subscribe'
      },
      music: {
        tracks: [],
        autoplay: false
      },
      instagram: {
        username: '',
        posts: []
      },
      faq: {
        questions: []
      },
      calendar: {
        title: 'Book a Meeting',
        description: 'Schedule a time that works for you',
        calendarUrl: ''
      }
    }

    return {
      id: `${type}-${Date.now()}`,
      type,
      order: blocks.length,
      isActive: true,
      content: blockTemplates[type] || {}
    }
  }

  const updateBlock = async (blockId, updates) => {
    try {
      // Optimistically update UI first
      const updatedBlocks = blocks.map(block => 
        block.id === blockId ? { ...block, ...updates } : block
      )
      setBlocks(updatedBlocks)
      setPreviewKey(prev => prev + 1)
      
      // Update selected block if it's the one being updated
      if (selectedBlock?.id === blockId) {
        setSelectedBlock({ ...selectedBlock, ...updates })
      }
      
      const response = await fetch(`${API_URL}/bio/blocks/${blockId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updates)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setBlocks(data.bio.blocks || [])
        setBio(data.bio)
        // Update selected block with server response
        if (selectedBlock?.id === blockId) {
          const updatedBlock = data.bio.blocks.find(b => b.id === blockId)
          if (updatedBlock) {
            setSelectedBlock(updatedBlock)
          }
        }
        // toast.success('Block updated successfully') // Disabled to reduce toast spam
      } else {
        // Revert optimistic update on error
        setBlocks(blocks)
        if (selectedBlock?.id === blockId) {
          setSelectedBlock(selectedBlock)
        }
        toast.error(data.message || 'Failed to update block')
      }
    } catch (error) {
      // Revert optimistic update on error
      setBlocks(blocks)
      if (selectedBlock?.id === blockId) {
        setSelectedBlock(selectedBlock)
      }
      console.error('Error updating block:', error)
      toast.error('Failed to update block')
    }
  }

  const deleteBlock = async (blockId) => {
    try {
      const response = await fetch(`${API_URL}/bio/blocks/${blockId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setBlocks(data.bio.blocks || [])
        setBio(data.bio)
        if (selectedBlock?.id === blockId) {
          setSelectedBlock(null)
        }
        setPreviewKey(prev => prev + 1)
        // toast.success('Block deleted') // Disabled to reduce toast spam
      } else {
        toast.error(data.message || 'Failed to delete block')
      }
    } catch (error) {
      console.error('Error deleting block:', error)
      toast.error('Failed to delete block')
    }
  }

  const toggleBlock = async (blockId) => {
    const block = blocks.find(b => b.id === blockId)
    if (!block) return
    
    await updateBlock(blockId, { isActive: !block.isActive })
  }

  const saveBio = async () => {
    try {
      setSaving(true)
      
      // The bio is automatically saved when blocks are updated
      // This button can be used for manual save or publishing
      const response = await fetch(`${API_URL}/bio`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.ok) {
        toast.success('Bio saved successfully!')
      } else {
        toast.error('Failed to save bio')
      }
    } catch (error) {
      console.error('Error saving bio:', error)
      toast.error('Failed to save bio')
    } finally {
      setSaving(false)
    }
  }

  const convertBlocksToBio = (blocks) => {
    const bioData = {
      profile: {},
      links: [],
      socialLinks: {},
      customization: bio?.customization || {},
      settings: bio?.settings || {}
    }

    blocks.forEach(block => {
      if (block.type === 'header' && block.isActive) {
        bioData.profile = block.content
      } else if (block.type === 'links' && block.isActive) {
        bioData.links = block.content.links || []
      } else if (block.type === 'social' && block.isActive) {
        bioData.socialLinks = block.content.links || {}
      }
    })

    return bioData
  }

  const getTheme = () => {
    return bio?.customization || {
      theme: 'default',
      primaryColor: '#000000',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      fontFamily: 'inter',
      buttonStyle: 'rounded'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading bio builder...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="visual-bio-builder">
      {/* Header */}
      <div className="builder-header">
        <div className="header-left">
          <h1 className="text-xl font-bold">Link in Bio</h1>
          <div className="page-tabs">
            <button className="page-tab active">Home</button>
            <button className="page-tab">+ New Page</button>
          </div>
        </div>
        <div className="header-right">
          <div className="domain-selector">
            <span className="domain-text">superlinks.ai/bio/{user?.username}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                const url = `https://superlinks.ai/bio/${user?.username}`
                navigator.clipboard.writeText(url)
                toast.success('URL copied to clipboard!')
              }}
              title="Copy URL"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                toast('Custom domain feature coming soon!')
              }}
              title="Edit domain"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </Button>
          </div>
          <Button 
            onClick={saveBio} 
            disabled={saving}
            className="share-button"
          >
            {saving ? 'SAVING...' : 'SAVE'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="builder-content">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={blocks.map(b => b.id)}
            strategy={verticalListSortingStrategy}
          >
            {/* Left Panel - Blocks */}
            <BlocksPanel
              blocks={blocks}
              selectedBlock={selectedBlock}
              onSelectBlock={setSelectedBlock}
              onAddBlock={addBlock}
              onDeleteBlock={deleteBlock}
              onToggleBlock={toggleBlock}
            />
          </SortableContext>

          {/* Center - Mobile Preview */}
          <MobilePreview
            blocks={blocks.filter(b => b.isActive)}
            theme={getTheme()}
            username={user?.username}
            key={previewKey}
          />

          {/* Right Panel - Properties */}
          <PropertiesPanel
            selectedBlock={selectedBlock}
            onUpdateBlock={updateBlock}
            theme={getTheme()}
            onUpdateTheme={(updates) => {
              if (!bio) return
              
              // Update local state immediately for instant preview
              const updatedCustomization = { 
                ...bio.customization, 
                ...updates 
              }
              
              setBio({
                ...bio,
                customization: updatedCustomization
              })
              setPreviewKey(prev => prev + 1)
              
              // Debounced save to backend
              debouncedSaveCustomization(updatedCustomization)
            }}
          />
        </DndContext>
      </div>
    </div>
  )
}