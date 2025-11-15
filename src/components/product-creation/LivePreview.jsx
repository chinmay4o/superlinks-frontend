import React, { useMemo, useState, useEffect } from 'react'

export function LivePreview({ productData, previewMode }) {
  // Debounced product data to prevent iframe reloading on every keystroke
  const [debouncedProductData, setDebouncedProductData] = useState(productData)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedProductData(productData)
    }, 500) // 500ms delay

    return () => clearTimeout(timer)
  }, [productData])

  // Generate preview URL with debounced form data as params
  const previewUrl = useMemo(() => {
    const params = new URLSearchParams({
      title: debouncedProductData.title || 'Your Product Title',
      description: debouncedProductData.description || '',
      price: debouncedProductData.price?.amount || '100',
      currency: debouncedProductData.price?.currency || 'INR',
      // Skip coverImage URL param - handle via postMessage instead
      files: JSON.stringify(debouncedProductData.files || []),
      creatorName: 'Your Profile',
      // Add testimonials and FAQ data
      testimonials: JSON.stringify(debouncedProductData.testimonialsData || []),
      faqs: JSON.stringify(debouncedProductData.faqData || []),
      aboutMe: JSON.stringify(debouncedProductData.aboutMeData || {}),
      themeStyle: debouncedProductData.themeStyle || 'default',
      // Add preview mode to determine layout
      previewMode: previewMode
    })
    
    return `/preview/your-profile/preview-product?${params.toString()}`
  }, [debouncedProductData, previewMode])

  // Device Frame Component with proper viewport sizing
  const DeviceFrame = ({ children, mode }) => {
    if (mode === 'mobile') {
      // Compact mobile preview for sidebar - OnePlus 7 dimensions (15% larger total)
      return (
        <div className="mx-auto" style={{ width: '277px' }}>
          {/* OnePlus 7 Frame - Premium */}
          <div className="rounded-[20px] shadow-2xl" style={{ 
            padding: '3px',
            background: 'linear-gradient(145deg, #1f2937 0%, #111827 50%, #000000 100%)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)'
          }}>
            <div className="bg-white rounded-[17px] overflow-hidden relative" style={{ 
              height: '546px', 
              width: '265px',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}>
              {/* OnePlus 7 Notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-black rounded-b-lg z-10" style={{ width: '60px', height: '8px' }}></div>
              
              {/* Status Bar */}
              <div className="absolute left-2 right-2 flex justify-between items-center text-black font-medium z-20" style={{ top: '4px', fontSize: '7px' }}>
                <span style={{ marginLeft: '26px' }}>9:41</span>
                <div className="flex items-center" style={{ gap: '2px' }}>
                  <div className="flex" style={{ gap: '1px' }}>
                    <div className="bg-black rounded-full" style={{ width: '2px', height: '2px' }}></div>
                    <div className="bg-black rounded-full" style={{ width: '2px', height: '2px' }}></div>
                    <div className="bg-black rounded-full" style={{ width: '2px', height: '2px' }}></div>
                    <div className="bg-gray-400 rounded-full" style={{ width: '2px', height: '2px' }}></div>
                  </div>
                  <div className="bg-black rounded-sm" style={{ width: '10px', height: '6px', marginLeft: '2px' }}></div>
                </div>
              </div>

              {/* Content - iframe with mobile scaling */}
              <div style={{ 
                paddingTop: '16px', 
                height: 'calc(100% - 16px)',
                width: '100%',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '375px', // Mobile viewport width
                  height: '100%', // Fill available height
                  transform: 'scale(0.707)', // Scale to fit (265px / 375px ≈ 0.707)
                  transformOrigin: 'top left',
                  pointerEvents: 'auto' // Enable interactions for scrolling
                }}>
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Desktop Frame - 15% larger total
    return (
      <div className="w-full" style={{ width: '637px', margin: '0 auto' }}>
        {/* MacBook Frame - Premium */}
        <div className="rounded-2xl shadow-2xl" style={{ 
          padding: '8px',
          background: 'linear-gradient(145deg, #374151 0%, #1f2937 50%, #111827 100%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)'
        }}>
          <div className="bg-white rounded-xl overflow-hidden" style={{ 
            width: '100%', 
            height: '369px',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            {/* Browser Bar - Premium */}
            <div className="flex items-center" style={{ 
              height: '32px', 
              paddingLeft: '12px', 
              paddingRight: '12px',
              background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
              borderBottom: '1px solid rgba(203, 213, 225, 0.6)'
            }}>
              <div className="flex" style={{ gap: '8px' }}>
                <div className="rounded-full" style={{ 
                  width: '12px', 
                  height: '12px',
                  background: 'linear-gradient(145deg, #ef4444, #dc2626)',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                }}></div>
                <div className="rounded-full" style={{ 
                  width: '12px', 
                  height: '12px',
                  background: 'linear-gradient(145deg, #eab308, #ca8a04)',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                }}></div>
                <div className="rounded-full" style={{ 
                  width: '12px', 
                  height: '12px',
                  background: 'linear-gradient(145deg, #22c55e, #16a34a)',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                }}></div>
              </div>
              <div className="flex-1 bg-white rounded-md mx-4" style={{ 
                height: '20px', 
                paddingLeft: '10px', 
                paddingRight: '10px', 
                display: 'flex', 
                alignItems: 'center',
                border: '1px solid #e2e8f0',
                boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)'
              }}>
                <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '500' }}>superlinks.ai/your-product</span>
              </div>
            </div>

            {/* Content - iframe with desktop scaling */}
            <div style={{ 
              height: 'calc(100% - 28px)', 
              width: '100%',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '1440px', // Full desktop width
                height: '750px', // Full desktop height
                transform: 'scale(0.439)', // Scale down to fit (637px / 1440px ≈ 0.439) - 15% larger
                transformOrigin: 'top left',
                pointerEvents: 'auto' // Enable interactions for scrolling
              }}>
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
      backgroundImage: `
        radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 50% 100%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
      `,
      backgroundSize: '800px 800px, 800px 800px, 1200px 600px, 40px 40px, 40px 40px',
      backgroundPosition: '0 0, 0 0, 0 0, 0 0, 20px 20px',
      minHeight: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative'
    }}>
      <DeviceFrame mode={previewMode}>
        <iframe 
          key={previewUrl} // Add key to prevent unnecessary reloads
          src={previewUrl}
          width="100%" 
          height="100%"
          style={{ 
            border: 'none',
            backgroundColor: '#f9fafb' // bg-gray-50 to match landing page
          }}
          title="Product Preview"
          onLoad={(e) => {
            // Send image data via postMessage after iframe loads, but only once
            const iframe = e.target
            if (debouncedProductData.coverImage?.preview && !iframe.dataset.imageSent) {
              iframe.dataset.imageSent = 'true'
              iframe.contentWindow.postMessage({
                type: 'UPDATE_COVER_IMAGE',
                imageData: debouncedProductData.coverImage.preview
              }, window.location.origin)
            }
          }}
        />
      </DeviceFrame>
    </div>
  )
}

export default LivePreview