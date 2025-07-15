import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { ArrowLeft, Clock, Eye, User, Calendar, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import productService from '../services/productService'

// Rich content renderer - renders the Tiptap JSON content
const ContentRenderer = ({ content }) => {
  if (!content) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No content available</p>
      </div>
    )
  }

  const renderContent = (node) => {
    if (!node) return null

    const { type, content: children, attrs, text } = node

    switch (type) {
      case 'doc':
        return (
          <div className="prose prose-lg max-w-none">
            {children?.map((child, index) => (
              <div key={index}>{renderContent(child)}</div>
            ))}
          </div>
        )

      case 'paragraph':
        return (
          <p className="mb-4 leading-relaxed">
            {children?.map((child, index) => (
              <span key={index}>{renderContent(child)}</span>
            ))}
          </p>
        )

      case 'heading':
        const HeadingTag = `h${attrs?.level || 1}`
        return (
          <HeadingTag className={`font-bold mb-4 ${
            attrs?.level === 1 ? 'text-3xl' :
            attrs?.level === 2 ? 'text-2xl' :
            attrs?.level === 3 ? 'text-xl' : 'text-lg'
          }`}>
            {children?.map((child, index) => (
              <span key={index}>{renderContent(child)}</span>
            ))}
          </HeadingTag>
        )

      case 'bulletList':
        return (
          <ul className="list-disc pl-6 mb-4 space-y-2">
            {children?.map((child, index) => (
              <li key={index}>{renderContent(child)}</li>
            ))}
          </ul>
        )

      case 'orderedList':
        return (
          <ol className="list-decimal pl-6 mb-4 space-y-2">
            {children?.map((child, index) => (
              <li key={index}>{renderContent(child)}</li>
            ))}
          </ol>
        )

      case 'listItem':
        return (
          <div>
            {children?.map((child, index) => (
              <span key={index}>{renderContent(child)}</span>
            ))}
          </div>
        )

      case 'blockquote':
        return (
          <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-4 text-gray-600">
            {children?.map((child, index) => (
              <div key={index}>{renderContent(child)}</div>
            ))}
          </blockquote>
        )

      case 'codeBlock':
        return (
          <pre className="bg-gray-100 rounded-lg p-4 mb-4 overflow-x-auto">
            <code className="text-sm">
              {children?.map((child, index) => (
                <span key={index}>{renderContent(child)}</span>
              ))}
            </code>
          </pre>
        )

      case 'imageUpload':
        return (
          <figure className={`mb-6 ${attrs?.alignment === 'center' ? 'text-center' : 
                               attrs?.alignment === 'right' ? 'text-right' : 'text-left'}`}>
            <img
              src={attrs?.src}
              alt={attrs?.alt || ''}
              title={attrs?.title || ''}
              className="max-w-full h-auto rounded-lg"
              style={{
                width: attrs?.width || 'auto',
                maxHeight: attrs?.height || 'auto',
                margin: attrs?.alignment === 'center' ? '0 auto' : 
                        attrs?.alignment === 'right' ? '0 0 0 auto' : '0'
              }}
            />
            {attrs?.caption && (
              <figcaption className="mt-2 text-sm text-gray-600 italic">
                {attrs.caption}
              </figcaption>
            )}
          </figure>
        )

      case 'videoUpload':
        const isYoutube = attrs?.src?.includes('youtube.com') || attrs?.src?.includes('youtu.be')
        const isVimeo = attrs?.src?.includes('vimeo.com')
        
        let embedSrc = attrs?.src
        if (isYoutube) {
          const videoId = attrs?.src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
          if (videoId) {
            embedSrc = `https://www.youtube.com/embed/${videoId[1]}`
          }
        } else if (isVimeo) {
          const videoId = attrs?.src.match(/vimeo\.com\/(\d+)/)
          if (videoId) {
            embedSrc = `https://player.vimeo.com/video/${videoId[1]}`
          }
        }

        return (
          <figure className="video-wrapper mb-6">
            {isYoutube || isVimeo || attrs?.isExternal ? (
              <iframe
                src={embedSrc}
                title={attrs?.title || 'Video'}
                width={attrs?.width || '100%'}
                height={attrs?.height || '400'}
                frameBorder="0"
                allowFullScreen
                className="w-full rounded-lg"
                style={{ minHeight: '300px' }}
              />
            ) : (
              <video
                src={attrs?.src}
                poster={attrs?.poster}
                controls={attrs?.controls !== false}
                autoPlay={attrs?.autoplay || false}
                loop={attrs?.loop || false}
                className="w-full rounded-lg"
                style={{
                  width: attrs?.width || '100%',
                  height: attrs?.height || 'auto'
                }}
              >
                Your browser does not support the video tag.
              </video>
            )}
            {attrs?.caption && (
              <figcaption className="mt-2 text-sm text-gray-600 text-center italic">
                {attrs.caption}
              </figcaption>
            )}
          </figure>
        )

      case 'hardBreak':
        return <br />

      case 'text':
        let textElement = text || ''
        
        // Apply text marks
        if (node.marks) {
          node.marks.forEach(mark => {
            switch (mark.type) {
              case 'bold':
                textElement = <strong key="bold">{textElement}</strong>
                break
              case 'italic':
                textElement = <em key="italic">{textElement}</em>
                break
              case 'code':
                textElement = <code key="code" className="bg-gray-100 px-1 rounded">{textElement}</code>
                break
              case 'link':
                textElement = (
                  <a 
                    key="link"
                    href={mark.attrs?.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {textElement}
                  </a>
                )
                break
            }
          })
        }
        
        return textElement

      default:
        // Fallback for unknown node types
        return children?.map((child, index) => (
          <span key={index}>{renderContent(child)}</span>
        ))
    }
  }

  try {
    // Always try to parse as JSON first (for Tiptap content)
    const parsedContent = typeof content === 'string' ? JSON.parse(content) : content
    return renderContent(parsedContent)
  } catch (error) {
    console.error('Error rendering content:', error)
    
    // If JSON parsing fails and it's an HTML string, migrate and render it
    if (typeof content === 'string' && content.trim().startsWith('<')) {
      console.warn('Migrating HTML content to proper format')
      
      // Migrate corrupted video tags with image sources
      let migratedContent = content.replace(
        /<video[^>]*src="([^"]*\.(png|jpg|jpeg|gif|webp|bmp|svg))"[^>]*>.*?<\/video>/gi,
        (match, src, ext) => {
          console.log('Migrating video tag with image source to img tag:', src)
          return `<img src="${src}" alt="Image" class="max-w-full h-auto rounded-lg" />`
        }
      )
      
      // Also handle figure-wrapped video tags
      migratedContent = migratedContent.replace(
        /<figure[^>]*class="[^"]*video-block[^"]*"[^>]*>\s*<video[^>]*src="([^"]*\.(png|jpg|jpeg|gif|webp|bmp|svg))"[^>]*>.*?<\/video>\s*<\/figure>/gi,
        (match, src, ext) => {
          console.log('Migrating figure-wrapped video tag with image source:', src)
          return `<figure class="image-block" style="text-align: center; margin: 1rem 0;"><img src="${src}" alt="Image" class="max-w-full h-auto rounded-lg" /></figure>`
        }
      )
      
      return (
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: migratedContent }}
        />
      )
    }
    
    return (
      <div className="text-center py-12 text-red-500">
        <p>Error loading content</p>
      </div>
    )
  }
}

export function ContentViewer() {
  const { id, purchaseId } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Determine if this is public access via purchaseId or dashboard access via productId
  const isPublicAccess = window.location.pathname.startsWith('/content/')
  const identifier = purchaseId || id

  useEffect(() => {
    fetchProductContent()
  }, [identifier])

  const fetchProductContent = async () => {
    try {
      setLoading(true)
      
      if (isPublicAccess) {
        // Fetch content via purchase ID for public access
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5005/api'}/content/purchase/${identifier}`)
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to load content')
        }
        
        setProduct(data.product)
      } else {
        // Use existing productService for dashboard access
        const response = await productService.getProductContent(identifier)
        setProduct(response.product)
      }
    } catch (error) {
      console.error('Error fetching product content:', error)
      setError(error.message || 'Failed to load content')
      
      if (error.response?.data?.requiresPurchase) {
        toast.error('You need to purchase this product to access its content')
        navigate(isPublicAccess ? '/' : '/dashboard')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading content...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => navigate(isPublicAccess ? '/' : '/dashboard')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Content not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <Button 
          onClick={() => navigate('/dashboard')} 
          variant="ghost" 
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            
            {/* Creator Info */}
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={product.creator?.avatar} />
                  <AvatarFallback>
                    {product.creator?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span>by {product.creator?.name}</span>
              </div>
            </div>
          </div>
          
          {/* Content Metadata */}
          {product.contentMetadata?.hasRichContent && (
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              {product.contentMetadata.wordCount > 0 && (
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{product.contentMetadata.wordCount} words</span>
                </div>
              )}
              {product.contentMetadata.readTime > 0 && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{product.contentMetadata.readTime} min read</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Separator className="mb-8" />

      {/* Main Content */}
      <Card>
        <CardContent className="p-8">
          {product.content ? (
            <ContentRenderer content={product.content} />
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>This product doesn't have rich content available.</p>
              <p className="text-sm mt-2">The creator may have provided downloadable files instead.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Resources */}
      {product.contentFiles && product.contentFiles.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <h3 className="text-lg font-semibold">Additional Resources</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {product.contentFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <ExternalLink className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{file.originalName}</p>
                      <p className="text-sm text-muted-foreground">
                        {file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'File'}
                      </p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => window.open(file.url, '_blank')}
                  >
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ContentViewer