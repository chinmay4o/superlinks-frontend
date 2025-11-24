import React, { memo } from 'react'
import PreviewContent from '../bio-builder/MobilePreview/PreviewContent'

/**
 * BioLivePreview - Direct rendering approach
 *
 * Uses the same PreviewContent component as the public bio page
 * for guaranteed visual consistency. No iframe, instant updates.
 */
function BioLivePreview({
  bio,
  blocks,
  theme,
  username,
  previewMode = 'mobile',
  loading
}) {
  const previewDisplayUrl = `superlinks.ai/${username || 'username'}`

  // Ensure theme has safe defaults
  const safeTheme = {
    fontFamily: 'inter',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    primaryColor: '#000000',
    buttonStyle: 'rounded',
    avatarShape: 'circle',
    ...theme
  }

  // Device Frame Component with proper viewport sizing
  const DeviceFrame = ({ children, mode }) => {
    if (mode === 'mobile') {
      return (
        <div className="mx-auto" style={{ width: '233px' }}>
          {/* iPhone Frame */}
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

              {/* Content - Direct rendering */}
              <div style={{
                paddingTop: '16px',
                height: 'calc(100% - 16px)',
                width: '100%',
                overflow: 'auto'
              }}>
                {children}
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Desktop mode
    return (
      <div style={{ width: '552px', margin: '0 auto' }}>
        {/* MacBook Frame */}
        <div className="bg-gray-800 rounded-xl" style={{ padding: '6px' }}>
          <div className="bg-white rounded-lg overflow-hidden" style={{ width: '100%', height: '319px' }}>
            {/* Browser Bar */}
            <div className="bg-gray-100 flex items-center" style={{ height: '28px', paddingLeft: '10px', paddingRight: '10px' }}>
              <div className="flex" style={{ gap: '6px' }}>
                <div className="rounded-full bg-red-500" style={{ width: '12px', height: '12px' }}></div>
                <div className="rounded-full bg-yellow-400" style={{ width: '12px', height: '12px' }}></div>
                <div className="rounded-full bg-green-500" style={{ width: '12px', height: '12px' }}></div>
              </div>
              <div className="flex-1 bg-white rounded border mx-3" style={{ height: '18px', paddingLeft: '8px', paddingRight: '8px', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '9px', color: '#666' }}>{previewDisplayUrl}</span>
              </div>
            </div>

            {/* Content */}
            <div style={{ height: 'calc(100% - 28px)', width: '100%', overflow: 'auto' }}>
              {children}
            </div>
          </div>
        </div>
      </div>
    )
  }

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

  // Main preview container with background
  const backgroundStyle = {
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
  }

  return (
    <div style={backgroundStyle}>
      <DeviceFrame mode={previewMode}>
        {/* Direct rendering - same component as public bio page */}
        <div
          className="bio-preview-content"
          style={{
            backgroundColor: safeTheme.backgroundColor,
            minHeight: '100%',
            width: '100%'
          }}
        >
          <PreviewContent
            blocks={blocks || []}
            theme={safeTheme}
            username={username}
          />
        </div>
      </DeviceFrame>
    </div>
  )
}

// Memo to prevent unnecessary re-renders
export default memo(BioLivePreview)
