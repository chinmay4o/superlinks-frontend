import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Badge } from '../../components/ui/badge'
import { 
  Link as LinkIcon, 
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Facebook,
  Globe,
  Mail,
  Lock,
  Heart,
  ExternalLink,
  Share,
  Copy
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useTheme } from '../../contexts/ThemeContext'

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005/api'

const SOCIAL_ICONS = {
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
  facebook: Facebook,
  website: Globe,
  email: Mail
}

const LINK_ICONS = {
  link: LinkIcon,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
  facebook: Facebook,
  website: Globe,
  email: Mail,
  'shopping-cart': LinkIcon,
  book: LinkIcon,
  music: LinkIcon,
  video: LinkIcon,
  camera: LinkIcon,
  heart: Heart,
  star: LinkIcon,
  gift: LinkIcon
}

export function PublicBioPage() {
  const { username } = useParams()
  const navigate = useNavigate()
  const { theme } = useTheme()
  
  const [bio, setBio] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isPasswordProtected, setIsPasswordProtected] = useState(false)
  const [password, setPassword] = useState('')
  const [emailSubscription, setEmailSubscription] = useState('')
  const [subscribing, setSubscribing] = useState(false)

  useEffect(() => {
    if (username) {
      fetchBio()
    }
  }, [username])

  const fetchBio = async (attemptPassword = '') => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        referrer: document.referrer || 'direct',
        device: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop'
      })
      
      if (attemptPassword) {
        params.append('password', attemptPassword)
      }
      
      const response = await fetch(`${API_BASE_URL}/bio/public/${username}?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setBio(data.bio)
        setIsPasswordProtected(false)
        
        // Apply custom CSS if provided
        if (data.bio?.settings?.customCSS) {
          const styleElement = document.createElement('style')
          styleElement.textContent = data.bio.settings.customCSS
          document.head.appendChild(styleElement)
          
          // Cleanup function to remove custom styles when component unmounts
          return () => {
            if (styleElement.parentNode) {
              styleElement.parentNode.removeChild(styleElement)
            }
          }
        }
      } else if (response.status === 401 && data.isPasswordProtected) {
        setIsPasswordProtected(true)
      } else if (response.status === 404) {
        setError('Bio not found')
      } else {
        setError(data.message || 'Failed to load bio')
      }
    } catch (error) {
      console.error('Error fetching bio:', error)
      setError('Failed to load bio')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (password.trim()) {
      fetchBio(password)
    }
  }

  const handleLinkClick = async (link) => {
    try {
      // Track click
      await fetch(`${API_BASE_URL}/bio/click/${username}/${link.id}`, {
        method: 'POST'
      })
      
      // Open link
      window.open(link.url, '_blank', 'noopener,noreferrer')
    } catch (error) {
      console.error('Error tracking click:', error)
      // Still open the link even if tracking fails
      window.open(link.url, '_blank', 'noopener,noreferrer')
    }
  }

  const handleEmailSubscription = async (e) => {
    e.preventDefault()
    if (!emailSubscription.trim()) return
    
    try {
      setSubscribing(true)
      // Here you would typically send the email to your email service
      // For now, we'll just show a success message
      toast.success('Thank you for subscribing!')
      setEmailSubscription('')
    } catch (error) {
      console.error('Error subscribing:', error)
      toast.error('Failed to subscribe')
    } finally {
      setSubscribing(false)
    }
  }

  const copyBioLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard')
  }

  const shareBio = () => {
    if (navigator.share) {
      navigator.share({
        title: bio?.profile?.title || `${bio?.user?.name}'s Links`,
        text: bio?.profile?.description || 'Check out my links',
        url: window.location.href
      }).catch(console.error)
    } else {
      copyBioLink()
    }
  }

  const getThemeStyles = () => {
    if (!bio?.customization) return {}
    
    const { theme: bioTheme, primaryColor, backgroundColor, textColor, fontFamily } = bio.customization
    
    let styles = {
      backgroundColor: backgroundColor || '#ffffff',
      color: textColor || '#000000',
      fontFamily: fontFamily || 'inter',
      minHeight: '100vh'
    }
    
    // Apply theme-specific styles
    switch (bioTheme) {
      case 'dark':
        styles.backgroundColor = '#1a1a1a'
        styles.color = '#ffffff'
        break
      case 'gradient':
        styles.background = `linear-gradient(135deg, ${primaryColor || '#000000'}, ${backgroundColor || '#ffffff'})`
        break
      case 'neon':
        styles.backgroundColor = '#000000'
        styles.color = primaryColor || '#00ff00'
        break
      case 'minimal':
        styles.backgroundColor = '#fafafa'
        styles.color = '#333333'
        break
      default:
        break
    }
    
    return styles
  }

  const getButtonClasses = () => {
    const { buttonStyle } = bio?.customization || {}
    
    let classes = 'w-full p-4 border transition-all duration-200 flex items-center justify-between group hover:opacity-90 hover:transform hover:scale-[1.02]'
    
    switch (buttonStyle) {
      case 'square':
        classes += ' rounded-none'
        break
      case 'pill':
        classes += ' rounded-full'
        break
      default:
        classes += ' rounded-lg'
        break
    }
    
    return classes
  }
  
  const getButtonStyles = () => {
    if (!bio?.customization) return {}
    
    const { theme: bioTheme, primaryColor, backgroundColor, textColor } = bio.customization
    
    let styles = {
      backgroundColor: 'transparent',
      color: textColor || '#000000',
      borderColor: primaryColor || '#000000'
    }
    
    // Apply theme-specific button styles
    switch (bioTheme) {
      case 'dark':
        styles.backgroundColor = 'rgba(255, 255, 255, 0.1)'
        styles.color = '#ffffff'
        styles.borderColor = 'rgba(255, 255, 255, 0.2)'
        break
      case 'neon':
        styles.backgroundColor = 'transparent'
        styles.color = primaryColor || '#00ff00'
        styles.borderColor = primaryColor || '#00ff00'
        styles.boxShadow = `0 0 10px ${primaryColor || '#00ff00'}`
        break
      case 'gradient':
        styles.background = `linear-gradient(135deg, ${primaryColor || '#000000'}20, transparent)`
        styles.borderColor = primaryColor || '#000000'
        break
      default:
        break
    }
    
    return styles
  }

  const getAvatarClasses = () => {
    const { avatarShape } = bio?.customization || {}
    const baseClasses = 'w-24 h-24 mx-auto mb-4 object-cover border-4 border-white shadow-lg'
    
    return avatarShape === 'square' ? `${baseClasses} rounded-lg` : `${baseClasses} rounded-full`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Bio Not Found</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    )
  }

  if (isPasswordProtected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Password Protected</h1>
              <p className="text-muted-foreground">This bio page is password protected</p>
            </div>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Access Bio
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!bio) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Bio Not Available</h1>
          <p className="text-muted-foreground">This bio page is not currently available</p>
        </div>
      </div>
    )
  }

  const fontFamilyMap = {
    inter: "'Inter', sans-serif",
    poppins: "'Poppins', sans-serif",
    roboto: "'Roboto', sans-serif",
    montserrat: "'Montserrat', sans-serif",
    playfair: "'Playfair Display', serif"
  }

  return (
    <div 
      className="py-8 px-4"
      style={{
        ...getThemeStyles(),
        fontFamily: fontFamilyMap[bio.customization?.fontFamily] || fontFamilyMap.inter
      }}
    >
      <div className="max-w-md mx-auto space-y-6">
        {/* Header with Share Button */}
        <div className="flex justify-end mb-4">
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={copyBioLink}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={shareBio}>
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Profile Section */}
        <div className="text-center">
          {bio.profile?.avatar && (
            <img 
              src={bio.profile.avatar} 
              alt={bio.profile.title || bio.user?.name || 'Profile'} 
              className={getAvatarClasses()}
            />
          )}
          
          <h1 className="text-2xl font-bold mb-2">
            {bio.profile?.title || bio.user?.name || 'Welcome'}
          </h1>
          
          {bio.profile?.location && (
            <p className="text-sm text-muted-foreground mb-2">📍 {bio.profile.location}</p>
          )}
          
          {bio.profile?.description && (
            <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
              {bio.profile.description}
            </p>
          )}
        </div>

        {/* Social Links */}
        {Object.entries(bio.socialLinks || {}).some(([_, url]) => url) && (
          <div className="flex justify-center gap-4">
            {Object.entries(bio.socialLinks || {}).map(([platform, url]) => {
              if (!url) return null
              const Icon = SOCIAL_ICONS[platform]
              if (!Icon) return null
              
              return (
                <button
                  key={platform}
                  className="h-12 w-12 rounded-full border transition-all duration-200 hover:opacity-80 hover:scale-110 flex items-center justify-center"
                  style={{
                    borderColor: bio.customization?.primaryColor || '#000000',
                    color: bio.customization?.primaryColor || '#000000',
                    backgroundColor: 'transparent'
                  }}
                  onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
                >
                  <Icon className="h-5 w-5" />
                </button>
              )
            })}
          </div>
        )}

        {/* Email Subscription */}
        {bio.settings?.collectEmails && (
          <Card>
            <CardContent className="p-4">
              <div className="text-center mb-4">
                <h3 className="font-semibold mb-1">
                  {bio.settings.emailTitle || 'Stay updated!'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {bio.settings.emailDescription || 'Subscribe to get my latest updates'}
                </p>
              </div>
              <form onSubmit={handleEmailSubscription} className="flex gap-2">
                <Input
                  type="email"
                  value={emailSubscription}
                  onChange={(e) => setEmailSubscription(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1"
                  required
                />
                <Button type="submit" disabled={subscribing}>
                  {subscribing ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Links */}
        <div className="space-y-3">
          {bio.links?.filter(link => link.isActive).map((link) => {
            const Icon = LINK_ICONS[link.icon] || LinkIcon
            
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link)}
                className={getButtonClasses()}
                style={{
                  ...getButtonStyles(),
                  ...(link.style?.backgroundColor && { backgroundColor: link.style.backgroundColor }),
                  ...(link.style?.textColor && { color: link.style.textColor }),
                  ...(link.style?.borderColor && { borderColor: link.style.borderColor })
                }}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-medium">{link.title}</div>
                    {link.description && (
                      <div className="text-xs text-muted-foreground">
                        {link.description}
                      </div>
                    )}
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )
          })}
        </div>

        {/* Empty State */}
        {bio.links?.filter(link => link.isActive).length === 0 && (
          <div className="text-center py-8">
            <LinkIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No links available</p>
          </div>
        )}

        {/* Branding */}
        {bio.settings?.showBranding !== false && (
          <div className="text-center pt-8">
            <p className="text-xs text-muted-foreground">
              Powered by{' '}
              <button 
                onClick={() => navigate('/')}
                className="hover:underline font-medium"
              >
                Superlinks
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}