import { useState, useEffect, useCallback } from 'react'
import bioService from '../services/bioService'
import toast from 'react-hot-toast'

/**
 * Custom hook for managing bio data with caching and optimized operations
 * @returns {Object} - Bio data, loading states, and control functions
 */
export const useBioData = () => {
  const [bio, setBio] = useState(null)
  const [blocks, setBlocks] = useState([])
  const [selectedBlock, setSelectedBlock] = useState(null)
  
  // Loading states for progressive loading
  const [loading, setLoading] = useState(true)
  const [bioLoading, setBioLoading] = useState(true)
  const [blocksLoading, setBlocksLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [error, setError] = useState(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Convert bio data to blocks format (for backward compatibility)
  const convertBioToBlocks = useCallback((bioData) => {
    if (!bioData) return []
    
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
  }, [])

  // Fetch bio data with progressive loading
  const fetchBio = useCallback(async () => {
    try {
      setLoading(true)
      setBioLoading(true)
      setError(null)
      
      const data = await bioService.getBio()
      
      setBio(data.bio)
      setBioLoading(false)
      
      // Process blocks
      setBlocksLoading(true)
      const loadedBlocks = data.bio.blocks || convertBioToBlocks(data.bio)
      setBlocks(loadedBlocks)
      
      // Auto-select first block if available
      if (loadedBlocks.length > 0 && !selectedBlock) {
        setSelectedBlock(loadedBlocks[0])
      }
      
      setBlocksLoading(false)
      
    } catch (error) {
      console.error('Error fetching bio:', error)
      setError(error.message || 'Failed to load bio data')
      toast.error('Failed to load bio data')
    } finally {
      setLoading(false)
    }
  }, [convertBioToBlocks, selectedBlock])

  // Initialize bio data
  useEffect(() => {
    fetchBio()
  }, [fetchBio])

  // Update bio profile with optimistic updates
  const updateBioProfile = useCallback(async (profileData) => {
    try {
      setSaving(true)
      
      // Optimistic update
      setBio(prev => ({
        ...prev,
        profile: { ...prev.profile, ...profileData }
      }))
      
      await bioService.updateBioProfile(profileData)
      setHasUnsavedChanges(false)
      
    } catch (error) {
      console.error('Error updating bio profile:', error)
      toast.error('Failed to update profile')
      
      // Revert optimistic update
      fetchBio()
      throw error
    } finally {
      setSaving(false)
    }
  }, [fetchBio])

  // Update bio customization with optimistic updates
  const updateBioCustomization = useCallback(async (customizationData) => {
    // Optimistic update - update local state immediately for instant preview
    setBio(prev => ({
      ...prev,
      customization: { ...prev.customization, ...customizationData }
    }))

    try {
      // Save to backend
      await bioService.updateBioCustomization(customizationData)
    } catch (error) {
      console.error('Error updating bio customization:', error)
      toast.error('Failed to save customization')
      // Revert on error by refetching
      fetchBio()
      throw error
    }
  }, [fetchBio])

  // Add new block with optimistic updates
  const addBlock = useCallback(async (blockData) => {
    try {
      setSaving(true)
      
      const newBlock = {
        id: `temp-${Date.now()}`,
        ...blockData,
        order: blocks.length
      }
      
      // Optimistic update
      setBlocks(prev => [...prev, newBlock])
      setSelectedBlock(newBlock)
      
      const response = await bioService.addBlock(blockData)
      
      // Replace temp block with real block
      setBlocks(prev => prev.map(block => 
        block.id === newBlock.id ? response.block : block
      ))
      setSelectedBlock(response.block)
      
      toast.success('Block added successfully')
      
    } catch (error) {
      console.error('Error adding block:', error)
      toast.error('Failed to add block')
      
      // Revert optimistic update
      setBlocks(prev => prev.filter(block => block.id !== `temp-${Date.now()}`))
      throw error
    } finally {
      setSaving(false)
    }
  }, [blocks.length])

  // Update block with optimistic updates
  const updateBlock = useCallback(async (blockId, blockData) => {
    try {
      // Optimistic update
      setBlocks(prev => prev.map(block => 
        block.id === blockId ? { ...block, ...blockData } : block
      ))
      
      if (selectedBlock && selectedBlock.id === blockId) {
        setSelectedBlock(prev => ({ ...prev, ...blockData }))
      }
      
      await bioService.updateBlock(blockId, blockData)
      setHasUnsavedChanges(false)
      
    } catch (error) {
      console.error('Error updating block:', error)
      toast.error('Failed to update block')
      
      // Revert optimistic update
      fetchBio()
      throw error
    }
  }, [selectedBlock, fetchBio])

  // Delete block with optimistic updates
  const deleteBlock = useCallback(async (blockId) => {
    try {
      setSaving(true)
      
      // Optimistic update
      setBlocks(prev => prev.filter(block => block.id !== blockId))
      
      if (selectedBlock && selectedBlock.id === blockId) {
        setSelectedBlock(null)
      }
      
      await bioService.deleteBlock(blockId)
      
      toast.success('Block deleted successfully')
      
    } catch (error) {
      console.error('Error deleting block:', error)
      toast.error('Failed to delete block')
      
      // Revert optimistic update
      fetchBio()
      throw error
    } finally {
      setSaving(false)
    }
  }, [selectedBlock, fetchBio])

  // Reorder blocks with optimistic updates
  const reorderBlocks = useCallback(async (newBlocks) => {
    try {
      // Optimistic update
      setBlocks(newBlocks)
      
      const blockOrders = newBlocks.map((block, index) => ({
        id: block.id,
        order: index
      }))
      
      await bioService.reorderBlocks(blockOrders)
      
    } catch (error) {
      console.error('Error reordering blocks:', error)
      toast.error('Failed to reorder blocks')
      
      // Revert optimistic update
      fetchBio()
      throw error
    }
  }, [fetchBio])

  // Toggle block visibility
  const toggleBlockVisibility = useCallback(async (blockId, isActive) => {
    try {
      // Optimistic update
      setBlocks(prev => prev.map(block => 
        block.id === blockId ? { ...block, isActive } : block
      ))
      
      await bioService.toggleBlockVisibility(blockId, isActive)
      
      toast.success(`Block ${isActive ? 'enabled' : 'disabled'} successfully`)
      
    } catch (error) {
      console.error('Error toggling block visibility:', error)
      toast.error('Failed to update block visibility')
      
      // Revert optimistic update
      setBlocks(prev => prev.map(block => 
        block.id === blockId ? { ...block, isActive: !isActive } : block
      ))
      throw error
    }
  }, [])

  // Upload bio image
  const uploadBioImage = useCallback(async (imageFile, type = 'avatar') => {
    try {
      setSaving(true)
      
      const response = await bioService.uploadBioImage(imageFile, type)
      
      // Update bio with new image
      if (type === 'avatar') {
        setBio(prev => ({
          ...prev,
          profile: { 
            ...prev.profile, 
            avatar: response.imageUrl 
          }
        }))
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
  }, [])

  // Refresh bio data
  const refresh = useCallback(async () => {
    bioService.clearCache()
    await fetchBio()
  }, [fetchBio])

  // Save changes manually
  const saveChanges = useCallback(async () => {
    if (!hasUnsavedChanges) return
    
    try {
      setSaving(true)
      // Implementation depends on what changes need to be saved
      setHasUnsavedChanges(false)
      toast.success('Changes saved successfully')
    } catch (error) {
      console.error('Error saving changes:', error)
      toast.error('Failed to save changes')
      throw error
    } finally {
      setSaving(false)
    }
  }, [hasUnsavedChanges])

  return {
    // Data
    bio,
    blocks,
    selectedBlock,
    
    // Loading states
    loading,
    bioLoading,
    blocksLoading,
    saving,
    error,
    hasUnsavedChanges,
    
    // Actions
    fetchBio,
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
  }
}

export default useBioData