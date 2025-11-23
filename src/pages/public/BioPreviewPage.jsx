import React, { useMemo, useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import PreviewContent from '../../components/bio-builder/MobilePreview/PreviewContent'

export function BioPreviewPage() {
  const { username } = useParams()
  const [searchParams] = useSearchParams()
  const [themeData, setThemeData] = useState(null)
  
  // Listen for postMessage from parent iframe (for future image updates)
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'UPDATE_BIO_IMAGE') {
        setThemeData(event.data.imageData)
      }
    }
    
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])
  
  // Convert URL params back to bio object that matches PublicBioPage expectations
  const mockBio = useMemo(() => {
    // Parse profile data
    const profile = {
      avatar: searchParams.get('avatar') || '',
      title: searchParams.get('title') || 'Your Name',
      description: searchParams.get('description') || 'Tell your audience about yourself',
      location: searchParams.get('location') || ''
    }
    
    // Parse customization data
    let customization = {
      theme: 'default',
      primaryColor: '#000000',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      fontFamily: 'inter',
      buttonStyle: 'rounded'
    }
    
    try {
      const customizationParam = searchParams.get('customization')
      if (customizationParam) {
        customization = {
          ...customization,
          ...JSON.parse(decodeURIComponent(customizationParam))
        }
      }
    } catch (e) {
      console.warn('Error parsing customization:', e)
    }
    
    // Parse blocks data
    let blocks = []
    try {
      const blocksParam = searchParams.get('blocks')
      if (blocksParam) {
        blocks = JSON.parse(decodeURIComponent(blocksParam))
      }
    } catch (e) {
      console.warn('Error parsing blocks:', e)
    }
    
    // If no blocks, create default header block from profile
    if (blocks.length === 0 && profile.title) {
      blocks.push({
        id: 'header-preview',
        type: 'header',
        order: 0,
        isActive: true,
        content: profile
      })
    }
    
    // Parse settings
    let settings = {
      isPublished: true,
      allowComments: true,
      showAnalytics: true
    }
    
    try {
      const settingsParam = searchParams.get('settings')
      if (settingsParam) {
        settings = {
          ...settings,
          ...JSON.parse(decodeURIComponent(settingsParam))
        }
      }
    } catch (e) {
      console.warn('Error parsing settings:', e)
    }
    
    return {
      profile,
      customization,
      blocks,
      settings
    }
  }, [searchParams])
  
  // Filter active blocks for preview
  const activeBlocks = mockBio.blocks.filter(block => block.isActive)
  
  // Handle preview mode for responsive display
  const previewMode = searchParams.get('previewMode') || 'mobile'
  
  // For mobile preview, use the existing PreviewContent component
  if (previewMode === 'mobile') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: mockBio.customization.backgroundColor,
        fontFamily: getFontFamily(mockBio.customization.fontFamily)
      }}>
        <PreviewContent 
          blocks={activeBlocks} 
          theme={mockBio.customization} 
          username={username || 'preview'} 
        />
      </div>
    )
  }
  
  // For desktop preview, create a full-width layout
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: mockBio.customization.backgroundColor,
      fontFamily: getFontFamily(mockBio.customization.fontFamily),
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <PreviewContent 
        blocks={activeBlocks} 
        theme={mockBio.customization} 
        username={username || 'preview'} 
      />
    </div>
  )
}

function getFontFamily(font) {
  const fonts = {
    inter: "'Inter', sans-serif",
    poppins: "'Poppins', sans-serif",
    'source-sans': "'Source Sans Pro', sans-serif",
    montserrat: "'Montserrat', sans-serif",
    playfair: "'Playfair Display', serif"
  }
  return fonts[font] || fonts.inter
}

export default BioPreviewPage