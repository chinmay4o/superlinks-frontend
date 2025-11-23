import React, { useMemo, useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { ProductLandingPageV2 } from './ProductLandingPageV2'

export function ProductPreviewPage() {
  const { username, slug } = useParams()
  const [searchParams] = useSearchParams()
  const [coverImageData, setCoverImageData] = useState(null)
  
  // Listen for postMessage from parent iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'UPDATE_COVER_IMAGE') {
        setCoverImageData(event.data.imageData)
      }
    }
    
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])
  
  // Convert URL params back to product object that matches ProductLandingPageV2 expectations
  const mockProduct = useMemo(() => {
    const title = searchParams.get('title') || 'Your Product Title'
    const description = searchParams.get('description') || 'Product description will appear here'
    const price = searchParams.get('price') || '100'
    const currency = searchParams.get('currency') || 'INR'
    const coverImageUrl = searchParams.get('coverImage')
    const files = searchParams.get('files') ? JSON.parse(decodeURIComponent(searchParams.get('files'))) : []
    
    // Parse testimonials, FAQs, and about me data
    let testimonials = []
    let faqs = []
    let aboutMe = {}
    
    try {
      testimonials = searchParams.get('testimonials') ? JSON.parse(decodeURIComponent(searchParams.get('testimonials'))) : []
    } catch (e) {
      console.warn('Error parsing testimonials:', e)
    }
    
    try {
      faqs = searchParams.get('faqs') ? JSON.parse(decodeURIComponent(searchParams.get('faqs'))) : []
    } catch (e) {
      console.warn('Error parsing FAQs:', e)
    }
    
    try {
      aboutMe = searchParams.get('aboutMe') ? JSON.parse(decodeURIComponent(searchParams.get('aboutMe'))) : {}
    } catch (e) {
      console.warn('Error parsing about me:', e)
    }
    
    const themeStyle = searchParams.get('themeStyle') || 'default'
    const previewMode = searchParams.get('previewMode') || 'desktop'
    
    return {
      _id: 'preview-id',
      title,
      description,
      slug: slug || 'preview-product',
      price: {
        amount: parseFloat(price),
        currency
      },
      images: {
        cover: {
          url: coverImageData || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xOTQuNSAxODBMMTc2IDEzNy41TDE0MiAxNDlMMTE2IDE4MEg5NEwxNDAgMTA4TDE2MC41IDEyNC41TDE4MiA5MEwyMjAgMTI0LjVMMjQyIDEwOEwyODggMTgwSDI2NkwyNDAgMTQ5TDIwNi41IDEzNy41TDE5NC41IDE4MFoiIGZpbGw9IiNEMUQ1REIiLz4KPGNpcmNsZSBjeD0iMzEyIiBjeT0iMTMwIiByPSIyNCIgZmlsbD0iI0QxRDVEQiIvPgo8L3N2Zz4K',
          alt: title
        }
      },
      files: files.map((file, index) => ({
        name: file.name || `File ${index + 1}`,
        size: file.size || 1024,
        type: file.type || 'application/pdf',
        url: file.url || '#'
      })),
      creator: {
        _id: 'preview-creator',
        name: searchParams.get('creatorName') || 'Your Profile',
        username: username || 'preview-user',
        bio: 'Creator bio'
      },
      category: searchParams.get('category') || 'other',
      // Add optional sections data for testimonials, FAQ, and about me
      optionalSections: {
        testimonialsData: testimonials,
        faqData: faqs,
        aboutMeData: aboutMe
      },
      // Add advanced settings for theme
      advanced: {
        themeStyle: themeStyle
      },
      // Add preview mode
      previewMode: previewMode,
      stats: {
        views: 0,
        sales: 0,
        rating: {
          average: 0,
          count: 0
        }
      },
      isPublished: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  }, [searchParams, username, slug, coverImageData])

  // Mock reviews for preview
  const mockReviews = []
  const mockReviewsSummary = { totalReviews: 0, averageRating: 0 }
  
  // Override the ProductLandingPageV2 component to use our mock data
  return (
    <div style={{ 
      margin: 0, 
      padding: 0, 
      minHeight: '100vh',
      backgroundColor: '#f9fafb' // bg-gray-50
    }}>
      <ProductLandingPageV2 
        mockProduct={mockProduct}
        mockReviews={mockReviews}
        mockReviewsSummary={mockReviewsSummary}
        isPreview={true}
        previewMode={mockProduct.previewMode}
      />
    </div>
  )
}