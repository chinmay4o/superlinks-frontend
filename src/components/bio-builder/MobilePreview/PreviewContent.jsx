import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Instagram, Twitter, Youtube, Linkedin, Facebook, Globe, Mail,
  ExternalLink, Heart, Music, Play, Calendar, MessageSquare, Image
} from 'lucide-react'

const SOCIAL_ICONS = {
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
  facebook: Facebook,
  website: Globe,
  email: Mail
}

export default function PreviewContent({ blocks, theme, username }) {
  // Ensure we have safe defaults
  const safeBlocks = blocks || []
  const safeTheme = {
    fontFamily: 'inter',
    backgroundColor: '#ffffff', 
    textColor: '#000000',
    primaryColor: '#000000',
    buttonStyle: 'rounded',
    avatarShape: 'circle',
    ...theme
  }

  // Generate background styles based on theme
  const getBackgroundStyles = () => {
    const styles = {
      minHeight: '100%',
      paddingBottom: '2rem',
      position: 'relative'
    }

    if (safeTheme.backgroundType === 'image' && safeTheme.backgroundImage?.url) {
      // For image backgrounds, we'll use a separate background div
      styles.backgroundColor = 'transparent'
    } else {
      styles.backgroundColor = safeTheme.backgroundColor || '#ffffff'
    }

    return styles
  }

  // Generate background image layer styles
  const getBackgroundImageStyles = () => {
    if (safeTheme.backgroundType === 'image' && safeTheme.backgroundImage?.url) {
      const bgImg = safeTheme.backgroundImage
      const styles = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url(${bgImg.url})`,
        backgroundPosition: bgImg.position || 'center',
        backgroundSize: bgImg.size || 'cover',
        backgroundRepeat: bgImg.repeat || 'no-repeat',
        backgroundAttachment: 'fixed',
        zIndex: 0
      }
      
      // Apply blur effect
      if (bgImg.blur > 0) {
        styles.filter = `blur(${bgImg.blur}px)`
      }
      
      // Apply opacity
      if (bgImg.opacity < 1) {
        styles.opacity = bgImg.opacity
      }
      
      return styles
    }
    return null
  }

  // Get overlay styles for better text readability
  const getOverlayStyles = () => {
    if (safeTheme.backgroundType === 'image' && safeTheme.backgroundImage?.overlay) {
      return {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: safeTheme.backgroundImage.overlay,
        zIndex: 1
      }
    }
    return null
  }

  const renderBlock = (block, index) => {
    if (!block || !block.type) return null
    
    const animationDelay = index * 0.1

    switch (block.type) {
      case 'header':
        return (
          <motion.div
            key={block.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: animationDelay }}
            className="header-block"
            style={{ textAlign: 'center', padding: '2rem 1rem' }}
          >
            {block.content.avatar && (
              <img
                src={block.content.avatar}
                alt="Avatar"
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: safeTheme.avatarShape === 'square' ? '12px' : '50%',
                  objectFit: 'cover',
                  margin: '0 auto 1rem',
                  border: '4px solid white',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              />
            )}
            {block.content.title && (
              <h1 style={{ 
                fontSize: '24px', 
                fontWeight: '700',
                marginBottom: '0.5rem',
                color: safeTheme.textColor 
              }}>
                {block.content.title}
              </h1>
            )}
            {block.content.description && (
              <p style={{ 
                fontSize: '16px',
                color: safeTheme.textColor,
                opacity: 0.8,
                lineHeight: '1.5',
                maxWidth: '300px',
                margin: '0 auto'
              }}>
                {block.content.description}
              </p>
            )}
            {block.content.location && (
              <p style={{
                fontSize: '14px',
                color: safeTheme.textColor,
                opacity: 0.6,
                marginTop: '0.5rem'
              }}>
                📍 {block.content.location}
              </p>
            )}
          </motion.div>
        )

      case 'text':
        return (
          <motion.div
            key={block.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: animationDelay }}
            className="text-block"
            style={{
              padding: '1rem',
              textAlign: block.content.alignment || 'center'
            }}
          >
            <p style={{
              fontSize: block.content.fontSize === 'large' ? '18px' : 
                       block.content.fontSize === 'small' ? '14px' : '16px',
              color: theme.textColor,
              lineHeight: '1.6'
            }}>
              {block.content.text}
            </p>
          </motion.div>
        )

      case 'links':
        return (
          <motion.div
            key={block.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: animationDelay }}
            className="links-block"
            style={{ padding: '0 1rem' }}
          >
            {(block.content.links || []).map((link, linkIndex) => (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: animationDelay + (linkIndex * 0.05) }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  marginBottom: '0.75rem',
                  backgroundColor: 'transparent',
                  border: `1px solid ${safeTheme.primaryColor}`,
                  borderRadius: safeTheme.buttonStyle === 'pill' ? '9999px' : 
                               safeTheme.buttonStyle === 'square' ? '0' : '8px',
                  color: safeTheme.textColor,
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)'
                  e.currentTarget.style.backgroundColor = `${safeTheme.primaryColor}20`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <span style={{ fontWeight: '500' }}>{link.title}</span>
                <ExternalLink size={16} style={{ opacity: 0.5 }} />
              </motion.a>
            ))}
          </motion.div>
        )

      case 'social':
        return (
          <motion.div
            key={block.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: animationDelay }}
            className="social-block"
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              padding: '1rem'
            }}
          >
            {Object.entries(block.content.links || {}).map(([platform, url]) => {
              if (!url) return null
              const Icon = SOCIAL_ICONS[platform]
              if (!Icon) return null
              
              return (
                <motion.a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    border: `1px solid ${safeTheme.primaryColor}`,
                    color: theme.primaryColor,
                    backgroundColor: 'transparent',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.primaryColor
                    e.currentTarget.style.color = '#fff'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = theme.primaryColor
                  }}
                >
                  <Icon size={20} />
                </motion.a>
              )
            })}
          </motion.div>
        )

      case 'youtube':
        return (
          <motion.div
            key={block.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: animationDelay }}
            className="youtube-block"
            style={{ padding: '1rem' }}
          >
            {(!block.content.videos || block.content.videos.length === 0) ? (
              <div style={{
                padding: '2rem',
                textAlign: 'center',
                border: '2px dashed #e5e7eb',
                borderRadius: '12px',
                color: '#6b7280'
              }}>
                <Youtube size={32} style={{ margin: '0 auto 1rem' }} />
                <p style={{ fontSize: '14px' }}>No videos added yet</p>
                <p style={{ fontSize: '12px', opacity: 0.7 }}>Add videos in the properties panel</p>
              </div>
            ) : (
              (block.content.videos || []).map((video, videoIndex) => {
                if (!video.videoId) return null;
                
                return (
                  <div
                    key={videoIndex}
                    style={{
                      position: 'relative',
                      marginBottom: '1rem',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      backgroundColor: '#000',
                      aspectRatio: '16/9'
                    }}
                    onClick={() => {
                      window.open(`https://www.youtube.com/watch?v=${video.videoId}`, '_blank')
                    }}
                  >
                    <img
                      src={`https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}
                      alt={video.title || 'YouTube Video'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        // Fallback to medium quality thumbnail
                        e.target.src = `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`;
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}>
                      <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        backgroundColor: '#ff0000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: 'scale(1)',
                        transition: 'transform 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <Play size={24} color="white" fill="white" style={{ marginLeft: '4px' }} />
                      </div>
                    </div>
                    {video.title && (
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '1rem',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
                      }}>
                        <h3 style={{ 
                          color: 'white', 
                          fontSize: '14px', 
                          fontWeight: '600',
                          margin: 0,
                          textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                        }}>
                          {video.title}
                        </h3>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </motion.div>
        )

      case 'contact':
        const ContactForm = () => {
          const [formData, setFormData] = useState({
            name: '',
            email: '',
            message: '',
            subject: ''
          });
          const [isSubmitting, setIsSubmitting] = useState(false);
          const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null
          const [errorMessage, setErrorMessage] = useState('');

          const handleInputChange = (field, value) => {
            setFormData(prev => ({ ...prev, [field]: value }));
          };

          const handleSubmit = async (e) => {
            e.preventDefault();
            
            // Don't submit if already submitting
            if (isSubmitting) return;
            
            // Reset status
            setSubmitStatus(null);
            setErrorMessage('');
            
            // Validate required fields
            const requiredFields = block.content.fields || ['name', 'email', 'message'];
            const missingFields = requiredFields.filter(field => !formData[field]?.trim());
            
            if (missingFields.length > 0) {
              setSubmitStatus('error');
              setErrorMessage(`Please fill in: ${missingFields.join(', ')}`);
              return;
            }
            
            // Validate email
            const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
            if (!emailRegex.test(formData.email)) {
              setSubmitStatus('error');
              setErrorMessage('Please enter a valid email address');
              return;
            }
            
            setIsSubmitting(true);
            
            try {
              const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005/api'}/bio/contact/${username}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  name: formData.name.trim(),
                  email: formData.email.trim(),
                  message: formData.message.trim(),
                  subject: formData.subject?.trim() || ''
                })
              });
              
              const data = await response.json();
              
              if (response.ok) {
                setSubmitStatus('success');
                // Reset form
                setFormData({ name: '', email: '', message: '', subject: '' });
              } else {
                setSubmitStatus('error');
                setErrorMessage(data.message || 'Failed to send message');
              }
            } catch (error) {
              console.error('Contact form error:', error);
              setSubmitStatus('error');
              setErrorMessage('Network error. Please try again.');
            } finally {
              setIsSubmitting(false);
            }
          };

          return (
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{
                margin: '0 0 1rem 0',
                fontSize: '18px',
                fontWeight: '600',
                color: safeTheme.textColor,
                textAlign: 'center'
              }}>
                {block.content.title || 'Get in Touch'}
              </h3>
              
              {block.content.description && (
                <p style={{
                  margin: '0 0 1.5rem 0',
                  fontSize: '14px',
                  color: safeTheme.textColor,
                  opacity: 0.8,
                  textAlign: 'center'
                }}>
                  {block.content.description}
                </p>
              )}
              
              {submitStatus === 'success' && (
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#dcfce7',
                  border: '1px solid #16a34a',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  textAlign: 'center'
                }}>
                  <p style={{ margin: 0, color: '#166534', fontSize: '14px', fontWeight: '500' }}>
                    ✅ Message sent successfully! We'll get back to you soon.
                  </p>
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #dc2626',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  textAlign: 'center'
                }}>
                  <p style={{ margin: 0, color: '#991b1b', fontSize: '14px', fontWeight: '500' }}>
                    ❌ {errorMessage}
                  </p>
                </div>
              )}
              
              <form 
                style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
                onSubmit={handleSubmit}
              >
                {(block.content.fields || ['name', 'email', 'message']).map((field) => {
                  const isTextarea = field === 'message';
                  const Component = isTextarea ? 'textarea' : 'input';
                  
                  return React.createElement(Component, {
                    key: field,
                    type: field === 'email' ? 'email' : isTextarea ? undefined : 'text',
                    placeholder: `${field.charAt(0).toUpperCase() + field.slice(1)}${field === 'name' || field === 'email' || field === 'message' ? ' *' : ''}`,
                    rows: isTextarea ? 4 : undefined,
                    value: formData[field] || '',
                    onChange: (e) => handleInputChange(field, e.target.value),
                    disabled: isSubmitting,
                    style: {
                      padding: '0.75rem',
                      border: `1px solid ${theme.primaryColor}40`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: isSubmitting ? '#f9fafb' : 'white',
                      color: safeTheme.textColor,
                      fontFamily: 'inherit',
                      resize: isTextarea ? 'vertical' : undefined,
                      minHeight: isTextarea ? '100px' : undefined,
                      transition: 'border-color 0.2s',
                      opacity: isSubmitting ? 0.7 : 1
                    },
                    onFocus: (e) => {
                      if (!isSubmitting) {
                        e.target.style.borderColor = theme.primaryColor;
                      }
                    },
                    onBlur: (e) => {
                      e.target.style.borderColor = `${theme.primaryColor}40`;
                    }
                  });
                })}
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: isSubmitting ? '#9ca3af' : theme.primaryColor,
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    marginTop: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.opacity = '0.9';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {isSubmitting ? 'Sending...' : (block.content.submitText || 'Send Message')}
                </button>
              </form>
            </div>
          );
        };

        return (
          <motion.div
            key={block.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: animationDelay }}
            className="contact-block"
            style={{ padding: '1rem' }}
          >
            <ContactForm />
          </motion.div>
        )

      case 'support':
        return (
          <motion.div
            key={block.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: animationDelay }}
            className="support-block"
            style={{ padding: '1rem' }}
          >
            <div style={{
              textAlign: 'center',
              padding: '1.5rem',
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
              borderRadius: '12px',
              border: '1px solid rgba(0, 0, 0, 0.1)'
            }}>
              <Heart size={32} style={{ color: '#ef4444', margin: '0 auto 1rem' }} />
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                margin: '0 0 0.5rem 0',
                color: theme.textColor
              }}>
                {block.content.title || 'Support Me'}
              </h3>
              <p style={{
                fontSize: '14px',
                color: safeTheme.textColor,
                opacity: 0.7,
                marginBottom: '1rem'
              }}>
                Help support my work and content creation
              </p>
              <button style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                ❤️ Support
              </button>
            </div>
          </motion.div>
        )

      case 'newsletter':
        return (
          <motion.div
            key={block.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: animationDelay }}
            className="newsletter-block"
            style={{ padding: '1rem' }}
          >
            <div style={{
              padding: '1.5rem',
              backgroundColor: `${theme.primaryColor}10`,
              borderRadius: '12px',
              border: `1px solid ${theme.primaryColor}20`,
              textAlign: 'center'
            }}>
              <Mail size={32} style={{ color: theme.primaryColor, margin: '0 auto 1rem' }} />
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                margin: '0 0 0.5rem 0',
                color: theme.textColor
              }}>
                {block.content.title || 'Stay Updated'}
              </h3>
              <p style={{
                fontSize: '14px',
                color: safeTheme.textColor,
                opacity: 0.8,
                marginBottom: '1rem'
              }}>
                {block.content.description || 'Subscribe to get my latest updates'}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: `1px solid ${theme.primaryColor}40`,
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
                <button style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: theme.primaryColor,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}>
                  {block.content.buttonText || 'Subscribe'}
                </button>
              </div>
            </div>
          </motion.div>
        )

      case 'gallery':
        return (
          <motion.div
            key={block.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: animationDelay }}
            className="gallery-block"
            style={{ padding: '1rem' }}
          >
            {(!block.content.images || block.content.images.length === 0) ? (
              <div style={{
                padding: '2rem',
                textAlign: 'center',
                border: '2px dashed #e5e7eb',
                borderRadius: '12px',
                color: '#6b7280'
              }}>
                <Image size={32} style={{ margin: '0 auto 1rem' }} />
                <p style={{ fontSize: '14px' }}>No images added yet</p>
                <p style={{ fontSize: '12px', opacity: 0.7 }}>Add images in the properties panel</p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${block.content.columns || 2}, 1fr)`,
                gap: '0.5rem'
              }}>
                {block.content.images.map((image, index) => (
                  <div
                    key={index}
                    style={{
                      aspectRatio: '1',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      backgroundColor: '#f3f4f6'
                    }}
                  >
                    <img
                      src={image.url}
                      alt={image.alt || `Gallery image ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )

      default:
        return (
          <motion.div
            key={block.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: animationDelay }}
            className="placeholder-block"
            style={{ 
              padding: '2rem 1rem',
              textAlign: 'center',
              color: '#6b7280',
              border: '2px dashed #e5e7eb',
              borderRadius: '12px',
              margin: '1rem'
            }}
          >
            <p style={{ fontSize: '14px', fontWeight: '500' }}>
              {block.type.charAt(0).toUpperCase() + block.type.slice(1)} Block
            </p>
            <p style={{ fontSize: '12px', opacity: 0.7 }}>
              Coming soon! This block type is under development.
            </p>
          </motion.div>
        )
    }
  }

  const overlayStyles = getOverlayStyles()
  const backgroundImageStyles = getBackgroundImageStyles()

  return (
    <div style={getBackgroundStyles()}>
      {/* Background image layer */}
      {backgroundImageStyles && <div style={backgroundImageStyles} />}
      
      {/* Overlay for better text readability */}
      {overlayStyles && <div style={overlayStyles} />}
      
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {safeBlocks.map((block, index) => renderBlock(block, index))}
        
        {/* Branding */}
        <div style={{
          textAlign: 'center',
          padding: '2rem 1rem',
          fontSize: '12px',
          color: safeTheme.textColor || '#000000',
          opacity: 0.5
        }}>
          Powered by Superlinks
        </div>
      </div>
    </div>
  )
}