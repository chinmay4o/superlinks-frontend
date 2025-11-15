import { useState, useEffect, useCallback } from 'react'
import bioService from '../services/bioService'
import toast from 'react-hot-toast'

/**
 * Simplified bio data hook following product creation pattern
 * Focuses on direct state updates and real-time preview sync
 */
export const useBioDataSimple = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Core bio data - simplified structure like product creation
  const [bioData, setBioData] = useState({
    profile: {
      avatar: '',
      title: '',
      description: '',
      location: ''
    },
    customization: {
      theme: 'default',
      primaryColor: '#000000',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      fontFamily: 'inter',
      buttonStyle: 'rounded'
    },
    blocks: [],
    settings: {
      isPublished: false,
      allowComments: true,
      showAnalytics: true
    }
  })

  const [selectedBlockId, setSelectedBlockId] = useState(null)
  
  // Get selected block object
  const selectedBlock = bioData.blocks.find(block => block.id === selectedBlockId) || null

  // Load bio data on mount
  useEffect(() => {
    fetchBioData()
  }, [])

  const fetchBioData = async () => {
    try {
      setLoading(true)
      const response = await bioService.getBio()
      
      if (response.bio) {
        console.log('Raw bio response:', response) // Debug log
        
        // Handle legacy data structure - convert old format if no blocks exist
        let blocks = response.bio.blocks || []
        if (blocks.length === 0) {
          // Convert legacy format to blocks
          if (response.bio.profile) {
            blocks.push({
              id: 'header-' + Date.now(),
              type: 'header',
              order: 0,
              isActive: true,
              content: {
                avatar: response.bio.profile.avatar || '',
                title: response.bio.profile.title || '',
                description: response.bio.profile.description || '',
                location: response.bio.profile.location || ''
              }
            })
          }
          
          if (response.bio.links && response.bio.links.length > 0) {
            blocks.push({
              id: 'links-' + Date.now(),
              type: 'links',
              order: 1,
              isActive: true,
              content: { links: response.bio.links }
            })
          }
          
          if (response.bio.socialLinks && Object.values(response.bio.socialLinks).some(url => url)) {
            blocks.push({
              id: 'social-' + Date.now(),
              type: 'social', 
              order: 2,
              isActive: true,
              content: { links: response.bio.socialLinks }
            })
          }
        }
        
        // Map server data to our simplified structure
        const newBioData = {
          profile: {
            avatar: response.bio.profile?.avatar || '',
            title: response.bio.profile?.title || '',
            description: response.bio.profile?.description || '',
            location: response.bio.profile?.location || ''
          },
          customization: {
            theme: 'default',
            primaryColor: '#000000',
            backgroundColor: '#ffffff',
            textColor: '#000000',
            fontFamily: 'inter',
            buttonStyle: 'rounded',
            ...response.bio.customization
          },
          blocks: blocks,
          settings: {
            isPublished: false,
            allowComments: true,
            showAnalytics: true,
            ...response.bio.settings
          }
        }
        
        console.log('Mapped bio data:', newBioData) // Debug log
        setBioData(newBioData)
        
        // Auto-select first block if available
        if (blocks.length > 0 && !selectedBlockId) {
          setSelectedBlockId(blocks[0].id)
        }
      } else {
        console.log('No bio data received from server')
      }
    } catch (error) {
      console.error('Error fetching bio:', error)
      toast.error('Failed to load bio data')
    } finally {
      setLoading(false)
    }
  }

  // Direct input handler like product creation
  const handleInputChange = useCallback((field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setBioData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setBioData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }, [])

  // Update profile data directly (real-time updates)
  const updateProfile = useCallback((profileUpdates) => {
    setBioData(prev => ({
      ...prev,
      profile: { ...prev.profile, ...profileUpdates }
    }))
  }, [])

  // Update customization directly (real-time updates)
  const updateCustomization = useCallback((customizationUpdates) => {
    setBioData(prev => ({
      ...prev,
      customization: { ...prev.customization, ...customizationUpdates }
    }))
  }, [])

  // Add new block
  const addBlock = useCallback(async (blockType) => {
    const newBlock = createNewBlock(blockType, bioData.blocks.length)
    
    try {
      setSaving(true)
      
      // Optimistic update for real-time preview
      setBioData(prev => ({
        ...prev,
        blocks: [...prev.blocks, newBlock]
      }))
      
      // Select the new block
      setSelectedBlockId(newBlock.id)
      
      // Save to server (non-blocking for UI)
      const response = await bioService.addBlock(newBlock)
      
      // Update with server response if needed
      if (response.block && response.block.id !== newBlock.id) {
        setBioData(prev => ({
          ...prev,
          blocks: prev.blocks.map(block => 
            block.id === newBlock.id ? response.block : block
          )
        }))
        setSelectedBlockId(response.block.id)
      }
      
      toast.success('Block added successfully')
      
    } catch (error) {
      // Revert optimistic update on error
      setBioData(prev => ({
        ...prev,
        blocks: prev.blocks.filter(block => block.id !== newBlock.id)
      }))
      console.error('Error adding block:', error)
      toast.error('Failed to add block')
    } finally {
      setSaving(false)
    }
  }, [bioData.blocks])

  // Update block directly (real-time updates)
  const updateBlock = useCallback((blockId, blockUpdates) => {
    setBioData(prev => ({
      ...prev,
      blocks: prev.blocks.map(block =>
        block.id === blockId ? { ...block, ...blockUpdates } : block
      )
    }))
    
    // Update selected block if it's the one being updated
    if (selectedBlockId === blockId) {
      // selectedBlock will update automatically due to useMemo dependency
    }
  }, [selectedBlockId])

  // Delete block
  const deleteBlock = useCallback(async (blockId) => {
    const originalBlocks = bioData.blocks
    
    try {
      setSaving(true)
      
      // Optimistic update
      setBioData(prev => ({
        ...prev,
        blocks: prev.blocks.filter(block => block.id !== blockId)
      }))
      
      // Clear selection if deleting selected block
      if (selectedBlockId === blockId) {
        setSelectedBlockId(null)
      }
      
      await bioService.deleteBlock(blockId)
      toast.success('Block deleted successfully')
      
    } catch (error) {
      // Revert on error
      setBioData(prev => ({
        ...prev,
        blocks: originalBlocks
      }))
      console.error('Error deleting block:', error)
      toast.error('Failed to delete block')
    } finally {
      setSaving(false)
    }
  }, [bioData.blocks, selectedBlockId])

  // Toggle block visibility
  const toggleBlockVisibility = useCallback((blockId, isActive) => {
    setBioData(prev => ({
      ...prev,
      blocks: prev.blocks.map(block =>
        block.id === blockId ? { ...block, isActive } : block
      )
    }))
  }, [])

  // Reorder blocks
  const reorderBlocks = useCallback((newBlocks) => {
    setBioData(prev => ({
      ...prev,
      blocks: newBlocks
    }))
  }, [])

  // Save all changes to server
  const saveChanges = useCallback(async () => {
    try {
      setSaving(true)
      
      // Save profile
      await bioService.updateBioProfile(bioData.profile)
      
      // Save customization
      await bioService.updateBioCustomization(bioData.customization)
      
      // Note: Blocks are saved individually when modified for better UX
      
      toast.success('Bio saved successfully!')
      
    } catch (error) {
      console.error('Error saving bio:', error)
      toast.error('Failed to save bio')
      throw error
    } finally {
      setSaving(false)
    }
  }, [bioData])

  // Upload image
  const uploadImage = useCallback(async (file, type = 'avatar') => {
    try {
      setSaving(true)
      const response = await bioService.uploadBioImage(file, type)
      
      if (type === 'avatar') {
        updateProfile({ avatar: response.imageUrl })
      }
      
      toast.success('Image uploaded successfully')
      return response.imageUrl
      
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
      throw error
    } finally {
      setSaving(false)
    }
  }, [updateProfile])

  return {
    // Data
    bioData,
    selectedBlock,
    selectedBlockId,
    
    // States
    loading,
    saving,
    
    // Actions
    handleInputChange,
    updateProfile,
    updateCustomization,
    addBlock,
    updateBlock,
    deleteBlock,
    toggleBlockVisibility,
    reorderBlocks,
    saveChanges,
    uploadImage,
    setSelectedBlockId,
    refresh: fetchBioData
  }
}

// Helper function to create new blocks
function createNewBlock(type, order) {
  const blockTemplates = {
    header: {
      avatar: '',
      title: 'Your Name',
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
    contact: {
      fields: ['name', 'email', 'message'],
      submitText: 'Send Message'
    }
  }

  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    order,
    isActive: true,
    content: blockTemplates[type] || {},
    settings: {}
  }
}

export default useBioDataSimple