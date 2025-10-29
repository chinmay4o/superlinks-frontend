import React from 'react'
import Frame from 'react-frame-component'
import { motion } from 'framer-motion'
import './MobilePreview.css'
import PreviewContent from './PreviewContent'

export default function MobilePreview({ blocks, theme, username }) {
  const previewUrl = `superlinks.ai/${username || 'username'}`
  
  // Ensure theme has default values to prevent null errors
  const safeTheme = {
    fontFamily: 'inter',
    backgroundColor: '#ffffff', 
    textColor: '#000000',
    primaryColor: '#000000',
    buttonStyle: 'rounded',
    ...theme
  }
  
  // CSS to inject into the iframe
  const initialContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Montserrat:wght@400;500;600;700&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet">
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
            min-height: 100vh;
            overflow-x: hidden;
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
        </style>
      </head>
      <body>
        <div id="root"></div>
      </body>
    </html>
  `

  return (
    <div className="mobile-preview">
      <div className="preview-container" style={{ marginTop: '90px' }} >
        {/* iPhone Frame */}
        <div className="iphone-frame">
          {/* Status Bar */}
          <div className="status-bar">
            <div className="status-left">
              <span className="time">9:41</span>
            </div>
            <div className="status-right">
              <div className="signal"></div>
              <div className="wifi"></div>
              <div className="battery"></div>
            </div>
          </div>

          {/* URL Bar */}
          <div className="url-bar">
            <div className="url-content">
              <div className="lock-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0110 0v4"></path>
                </svg>
              </div>
              <span className="url-text">{previewUrl}</span>
            </div>
          </div>

          {/* Content Area */}
          <div className="preview-content">
            <Frame
              initialContent={initialContent}
              style={{ width: '100%', height: '100%', border: 'none' }}
            >
              <PreviewContent blocks={blocks || []} theme={safeTheme} username={username} />
            </Frame>
          </div>

          {/* Home Indicator */}
          <div className="home-indicator"></div>
        </div>

        {/* Device Frame */}
        <div className="device-frame"></div>
      </div>

      {/* Footer - Removed non-functional controls */}
    </div>
  )
}

function getFontFamily(font) {
  const fonts = {
    inter: "'Inter', sans-serif",
    poppins: "'Poppins', sans-serif",
    roboto: "'Roboto', sans-serif",
    montserrat: "'Montserrat', sans-serif",
    playfair: "'Playfair Display', serif"
  }
  return fonts[font] || fonts.inter
}