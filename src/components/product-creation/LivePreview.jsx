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
      creatorName: 'Your Profile'
    })
    
    return `/preview/your-profile/preview-product?${params.toString()}`
  }, [debouncedProductData])

  // Device Frame Component with proper viewport sizing
  const DeviceFrame = ({ children, mode }) => {
    if (mode === 'mobile') {
      // Compact mobile preview for sidebar
      return (
        <div className="mx-auto" style={{ width: '233px' }}>
          {/* iPhone Frame - Compact */}
          <div className="bg-black rounded-[18px] shadow-lg" style={{ padding: '4px' }}>
            <div className="bg-white rounded-[14px] overflow-hidden relative" style={{ height: '407px', width: '221px' }}>
              {/* iPhone Dynamic Island */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-black rounded-b-lg z-10" style={{ width: '50px', height: '12px' }}></div>
              
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
                  width: '393px', // iPhone 17 actual width
                  height: '850px', // iPhone 17 actual height
                  transform: 'scale(0.56)', // Scale to fit (221px / 393px ≈ 0.56)
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

    // Desktop Frame - Pixel perfect match to target
    return (
      <div className="w-full" style={{ width: '552px', margin: '0 auto' }}>
        {/* MacBook Frame - Complete frame with bottom */}
        <div className="bg-gray-800 rounded-xl" style={{ padding: '6px' }}>
          <div className="bg-white rounded-lg overflow-hidden" style={{ width: '100%', height: '319px' }}>
            {/* Browser Bar - Pixel perfect */}
            <div className="bg-gray-100 flex items-center" style={{ height: '28px', paddingLeft: '10px', paddingRight: '10px' }}>
              <div className="flex" style={{ gap: '6px' }}>
                <div className="rounded-full bg-red-500" style={{ width: '12px', height: '12px' }}></div>
                <div className="rounded-full bg-yellow-400" style={{ width: '12px', height: '12px' }}></div>
                <div className="rounded-full bg-green-500" style={{ width: '12px', height: '12px' }}></div>
              </div>
              <div className="flex-1 bg-white rounded border mx-3" style={{ height: '18px', paddingLeft: '8px', paddingRight: '8px', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '9px', color: '#666' }}>superlinks.ai/your-product</span>
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
                transform: 'scale(0.38)', // Scale down to fit (552px / 1440px ≈ 0.38)
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
      background: 'linear-gradient(135deg, #f1f5f9 0%, #d1d5db 30%, #9ca3af 70%, #6b7280 100%)',
      backgroundImage: `
        linear-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.4) 1px, transparent 1px),
        linear-gradient(rgba(30, 41, 59, 0.15) 1px, transparent 1px),
        linear-gradient(90deg, rgba(30, 41, 59, 0.15) 1px, transparent 1px),
        radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.12) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.12) 0%, transparent 50%)
      `,
      backgroundSize: '24px 24px, 24px 24px, 24px 24px, 24px 24px, 600px 600px, 600px 600px',
      backgroundPosition: '0 0, 0 0, 12px 12px, 12px 12px, 0 0, 0 0',
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