import React, { useState, useEffect } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Button } from '../ui/button'
import { useAuth } from '../../contexts/AuthContext'
import BlocksPanel from './BlocksPanel/BlocksPanel'
import MobilePreview from './MobilePreview/MobilePreview'
import PropertiesPanel from './PropertiesPanel/PropertiesPanel'
import { BioBuilderSkeleton, BlocksSkeleton, PreviewSkeleton, PropertiesSkeleton } from '../ui/bio-skeleton'
import { useBioData } from '../../hooks/useBioData'
import { useDebouncedCallback } from '../../hooks/useDebounce'
import toast from 'react-hot-toast'
import './VisualBioBuilder.css'


export default function VisualBioBuilder() {
  const { user } = useAuth()
  
  // Use the new bio data hook for optimized data management
  const {
    bio,
    blocks,
    selectedBlock,
    loading,
    bioLoading,
    blocksLoading,
    saving,
    error,
    hasUnsavedChanges,
    updateBioProfile,
    updateBioCustomization,
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    toggleBlockVisibility,
    uploadBioImage,
    refresh,
    saveChanges,
    setSelectedBlock,
    setHasUnsavedChanges
  } = useBioData()
  
  const [previewKey, setPreviewKey] = useState(0)

  // Debounced save function for customization updates - now uses the hook
  const debouncedSaveCustomization = useDebouncedCallback(async (customizationData) => {
    try {
      await updateBioCustomization(customizationData)
    } catch (error) {
      // Error handling is done in the hook
      console.error('Error saving customization:', error)
    }
  }, 500) // 500ms delay

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Bio data is now loaded automatically by the hook
  // No need for manual fetch here

  // convertBioToBlocks function is now handled by the hook

  const handleDragEnd = async (event) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldBlocks = [...blocks]
      const oldIndex = oldBlocks.findIndex(item => item.id === active.id)
      const newIndex = oldBlocks.findIndex(item => item.id === over.id)
      
      const newBlocks = arrayMove(oldBlocks, oldIndex, newIndex)
      
      // Use the hook's reorder function which handles optimistic updates
      await reorderBlocks(newBlocks)
      setPreviewKey(prev => prev + 1)
    }
  }

  const handleAddBlock = async (blockType) => {
    try {
      const blockTemplate = createNewBlock(blockType)
      
      await addBlock({
        type: blockType,
        content: blockTemplate.content,
        settings: blockTemplate.settings
      })
      
      setPreviewKey(prev => prev + 1)
    } catch (error) {
      // Error handling is done in the hook
      console.error('Error adding block:', error)
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

  const handleUpdateBlock = async (blockId, updates) => {
    try {
      await updateBlock(blockId, updates)
      setPreviewKey(prev => prev + 1)
    } catch (error) {
      // Error handling is done in the hook
      console.error('Error updating block:', error)
    }
  }

  const handleDeleteBlock = async (blockId) => {
    try {
      await deleteBlock(blockId)
      setPreviewKey(prev => prev + 1)
    } catch (error) {
      // Error handling is done in the hook
      console.error('Error deleting block:', error)
    }
  }

  const handleToggleBlock = async (blockId) => {
    const block = blocks.find(b => b.id === blockId)
    if (!block) return
    
    await toggleBlockVisibility(blockId, !block.isActive)
    setPreviewKey(prev => prev + 1)
  }

  const handleSaveBio = async () => {
    try {
      // Use the hook's save changes function
      await saveChanges()
      toast.success('Bio saved successfully!')
    } catch (error) {
      console.error('Error saving bio:', error)
      toast.error('Failed to save bio')
    }
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

  // Progressive loading: Show skeleton for initial load, partial skeleton for data loading
  if (loading) {
    return <BioBuilderSkeleton />
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
            onClick={handleSaveBio} 
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
            {blocksLoading ? (
              <div className="w-80 bg-white border-r flex flex-col">
                <div className="p-4 border-b">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-24 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-40"></div>
                </div>
                <div className="flex-1 p-4">
                  <BlocksSkeleton count={3} />
                </div>
              </div>
            ) : (
              <BlocksPanel
                blocks={blocks}
                selectedBlock={selectedBlock}
                onSelectBlock={setSelectedBlock}
                onAddBlock={handleAddBlock}
                onDeleteBlock={handleDeleteBlock}
                onToggleBlock={handleToggleBlock}
              />
            )}
          </SortableContext>

          {/* Center - Mobile Preview */}
          {bioLoading ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <PreviewSkeleton />
            </div>
          ) : (
            <MobilePreview
              blocks={blocks.filter(b => b.isActive)}
              theme={getTheme()}
              username={user?.username}
              key={previewKey}
            />
          )}

          {/* Right Panel - Properties */}
          {bioLoading ? (
            <div className="w-80 bg-white border-l flex flex-col">
              <div className="p-4 border-b">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-28 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-36"></div>
              </div>
              <div className="flex-1 p-4">
                <PropertiesSkeleton />
              </div>
            </div>
          ) : (
            <PropertiesPanel
              selectedBlock={selectedBlock}
              onUpdateBlock={handleUpdateBlock}
              theme={getTheme()}
              onUpdateTheme={(updates) => {
                if (!bio) return
                
                // Update local state immediately for instant preview
                const updatedCustomization = { 
                  ...bio.customization, 
                  ...updates 
                }
                
                // Local state update is handled by the hook
                setPreviewKey(prev => prev + 1)
                
                // Debounced save to backend
                debouncedSaveCustomization(updatedCustomization)
              }}
            />
          )}
        </DndContext>
      </div>
    </div>
  )
}