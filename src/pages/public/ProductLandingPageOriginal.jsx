import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Star, Download, Eye, ShoppingCart, Share2, Check, X, Heart, MessageCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5005/api'

export function ProductLandingPage() {
  const { slug, username, productSlug } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const showPurchaseButton = true
  
  // Determine which slug and API endpoint to use
  const actualSlug = slug || productSlug
  const isUserProduct = Boolean(username && productSlug)
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        
        let url
        if (isUserProduct) {
          url = `${API_BASE_URL}/products/public/${username}/${productSlug}`
        } else {
          url = `${API_BASE_URL}/products/slug/${actualSlug}`
        }
        
        const response = await fetch(url)
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.message || 'Product not found')
        }
        
        setProduct(data.product)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching product:', err)
      } finally {
        setLoading(false)
      }
    }
    
    if (actualSlug) {
      fetchProduct()
    }
  }, [actualSlug, username, productSlug, isUserProduct])
  
  const handlePurchase = () => {
    if (!product) return
    navigate(`/checkout/${product._id}`)
  }
  
  const handleShare = async () => {
    const url = window.location.href
    try {
      await navigator.share({
        title: product.title,
        text: product.shortDescription || product.description.substring(0, 100),
        url: url
      })
    } catch (err) {
      // Fallback to copying to clipboard
      await navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard!')
    }
  }
  
  const formatPrice = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }
  
  const getCategoryIcon = (category) => {
    const icons = {
      ebook: '📚',
      course: '🎓',
      template: '📄',
      art: '🎨',
      toolkit: '🛠️',
      audio: '🎵',
      software: '💻',
      other: '📦'
    }
    return icons[category] || icons.other
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading product...</p>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => navigate('/')} variant="outline">
            Go Home
          </Button>
        </div>
      </div>
    )
  }
  
  if (!product) {
    return null
  }
  
  const mainImage = product.images?.cover?.url || '/placeholder-product.jpg'
  const galleryImages = product.images?.gallery || []
  const allImages = [product.images?.cover, ...galleryImages].filter(Boolean)
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="font-bold text-xl">
            Superlinks
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Product Image & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Image */}
            <div className="bg-muted rounded-lg overflow-hidden border">
              <img
                src={allImages[selectedImageIndex]?.url || mainImage}
                alt={product.title}
                className="w-full aspect-video object-cover"
                onError={(e) => {
                  e.target.src = '/placeholder-product.jpg'
                }}
              />
            </div>
            
            {/* Image Gallery */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index
                        ? 'border-primary shadow-md'
                        : 'border-muted hover:border-muted-foreground'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Product Title & Creator */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-sm">
                  {formatPrice(product.discountedPrice || product.price.amount, product.price.currency)}
                </Badge>
                <Link
                  to={`/${product.creator.username}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {product.creator.avatar && (
                    <img
                      src={product.creator.avatar}
                      alt={product.creator.name}
                      className="w-5 h-5 rounded-full"
                    />
                  )}
                  <span>{product.creator.name}</span>
                </Link>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
                {product.title}
              </h1>
              
              {/* Rating Stars */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${
                        i < Math.floor(product.stats?.rating?.average || 0) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.stats?.rating?.count || 0} ratings
                </span>
              </div>
            </div>
        
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Product Details */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{product.stats?.views || 0} views</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span>{product.stats?.sales || 0} sales</span>
              </div>
              {product.stats?.rating?.count > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{product.stats.rating.average.toFixed(1)} ({product.stats.rating.count})</span>
                </div>
              )}
            </div>
            
            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">What's included:</h3>
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Requirements */}
            {product.requirements && product.requirements.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Requirements:</h3>
                <ul className="space-y-3">
                  {product.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <X className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Right Column - Purchase Section */}
          <div className="lg:sticky lg:top-8 h-fit">
            <Card className="p-6">
              {/* Price */}
              <div className="space-y-4 mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">
                    {formatPrice(product.discountedPrice || product.price.amount, product.price.currency)}
                  </span>
                  {product.price.originalPrice > product.price.amount && (
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(product.price.originalPrice, product.price.currency)}
                    </span>
                  )}
                </div>
                
                {/* Purchase Button */}
                {showPurchaseButton && (
                  <Button 
                    onClick={handlePurchase}
                    className="w-full h-12 text-lg font-semibold"
                    disabled={!product.isAvailable}
                    size="lg"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {product.isAvailable ? 'Buy Now' : 'Out of Stock'}
                  </Button>
                )}
                
                {/* Inventory Status */}
                {product.inventory?.type === 'limited' && (
                  <p className="text-sm text-muted-foreground text-center">
                    {product.inventory.quantity - product.inventory.sold} left in stock
                  </p>
                )}
              </div>
              
              {/* Quick Features Summary */}
              {product.features && product.features.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Quick Overview:</h4>
                  <ul className="space-y-2">
                    {product.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {product.features.length > 3 && (
                      <li className="text-xs text-muted-foreground ml-6">
                        +{product.features.length - 3} more features
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </Card>
          </div>
        </div>
        </div>
        
        {/* Description */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">About this product</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                {product.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 last:mb-0 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Files Preview */}
        {product.files && product.files.length > 0 && (
          <div className="max-w-4xl mx-auto mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Download includes</CardTitle>
                <CardDescription>
                  You'll get access to these files after purchase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {product.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                          <span className="text-xs font-mono">
                            {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(1)} MB
                          </p>
                        </div>
                      </div>
                      {file.isPreview && (
                        <Badge variant="outline">Preview</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Creator Info */}
        <div className="max-w-4xl mx-auto mt-8">
          <Card>
            <CardHeader>
              <CardTitle>About the creator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                  {product.creator.avatar ? (
                    <img
                      src={product.creator.avatar}
                      alt={product.creator.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold">
                      {product.creator.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{product.creator.name}</h3>
                  <p className="text-muted-foreground mb-3">@{product.creator.username}</p>
                  {product.creator.bio && (
                    <p className="text-sm">{product.creator.bio}</p>
                  )}
                  <div className="mt-4">
                    <Link to={`/${product.creator.username}`}>
                      <Button variant="outline" size="sm">
                        View all products
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="max-w-4xl mx-auto mt-8">
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </main>
      
      {/* Sticky CTA */}
      {showPurchaseButton && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t lg:hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">
                {formatPrice(product.discountedPrice || product.price.amount, product.price.currency)}
              </p>
              <p className="text-sm text-muted-foreground">{product.title}</p>
            </div>
            <Button onClick={handlePurchase} disabled={!product.isAvailable}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Buy Now
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}