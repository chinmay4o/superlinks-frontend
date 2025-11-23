import React, { memo } from 'react'
import Frame from 'react-frame-component'
import { motion } from 'framer-motion'
import PreviewContent from './MobilePreview/PreviewContent'

function BioLivePreview({ 
  bio, 
  blocks, 
  theme, 
  username, 
  previewMode = 'mobile',
  loading 
}) {
  const previewUrl = `superlinks.ai/${username || 'username'}`
  
  // Ensure theme has default values to prevent null errors
  const safeTheme = {
    fontFamily: 'inter',
    backgroundColor: '#ffffff', 
    textColor: '#000000',
    primaryColor: '#000000',
    buttonStyle: 'rounded',
    layout: 'center',
    ...theme
  }
  
  // CSS to inject into the iframe
  const initialContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Source+Sans+Pro:wght@400;600&family=Montserrat:wght@400;500;600;700&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: ${getFontFamily(safeTheme.fontFamily)};
            background-color: ${safeTheme.backgroundColor || '#ffffff'};
            color: ${safeTheme.textColor || '#000000'};
            min-height: 100%;
            height: auto;
            overflow-x: hidden;
            line-height: 1.6;
            margin: 0;
            padding: 0;
          }
          
          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 6px;
          }
          
          ::-webkit-scrollbar-track {
            background: transparent;
          }
          
          ::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 3px;
          }
          
          /* Animation classes */
          .fade-in {
            animation: fadeIn 0.5s ease-out;
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .slide-up {
            animation: slideUp 0.5s ease-out;
          }
          
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          /* Responsive container */
          html {
            height: 100%;
            font-size: 10px; /* Smaller base font size for preview */
          }
          
          #root {
            width: 100%;
            min-height: 100%;
            overflow-x: hidden;
          }
          
          /* Background image support */
          ${safeTheme.backgroundImage ? `
            body::before {
              content: '';
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-image: url('${safeTheme.backgroundImage}');
              background-size: cover;
              background-position: center;
              opacity: 0.1;
              z-index: -1;
            }
          ` : ''}
        </style>
      </head>
      <body>
        <div id="root"></div>
      </body>
    </html>
  `

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading preview...</p>
        </div>
      </div>
    )
  }

  if (previewMode === 'desktop') {
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
        <div className="w-full" style={{ width: '552px', margin: '0 auto' }}>
          {/* MacBook Frame - Complete frame matching product builder */}
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
                  <span style={{ fontSize: '9px', color: '#666' }}>{previewUrl}</span>
                </div>
              </div>

              {/* Content - iframe with desktop scaling matching product builder */}
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
                  <Frame
                    initialContent={initialContent}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                  >
                    <PreviewContent blocks={blocks || []} theme={safeTheme} username={username} />
                  </Frame>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Mobile Preview (default) - Match product builder dimensions
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
      <div className="mx-auto" style={{ width: '233px' }}>
        {/* iPhone Frame - Compact matching product builder */}
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

            {/* Content - iframe with natural mobile sizing */}
            <div style={{ 
              paddingTop: '16px', 
              height: 'calc(100% - 16px)',
              width: '100%',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '100%', // Use full container width
                height: '100%', // Use full container height
                transformOrigin: 'top left',
                pointerEvents: 'auto' // Enable interactions for scrolling
              }}>
                <Frame
                  initialContent={initialContent}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                >
                  <PreviewContent blocks={blocks || []} theme={safeTheme} username={username} />
                </Frame>
              </div>
            </div>
          </div>
        </div>
      </div>
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

// Use shallow memo for better real-time updates
export default memo(BioLivePreview)