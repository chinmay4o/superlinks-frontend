import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Star, Download, Eye, ShoppingCart, Share2, Check, X, Heart, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { toast } from 'react-hot-toast'
import reviewService from '../../services/reviewService'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5005/api'

export function ProductLandingPage() {
  const { slug, username, productSlug } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [ratingDistribution, setRatingDistribution] = useState([])
  const [reviewsSummary, setReviewsSummary] = useState({ totalReviews: 0, averageRating: 0 })
  const [showAllReviews, setShowAllReviews] = useState(false)
  const showPurchaseButton = true
  
  // Determine which slug and API endpoint to use
  const actualSlug = slug || productSlug
  const isUserProduct = Boolean(username && productSlug)
  
  // Fetch reviews for a product
  const fetchReviews = async (productId) => {
    try {
      setReviewsLoading(true)
      const data = await reviewService.getProductReviews(productId, {
        page: 1,
        limit: showAllReviews ? 50 : 3,
        sortBy: 'newest'
      })
      
      setReviews(data.reviews || [])
      setRatingDistribution(data.ratingDistribution || [])
      setReviewsSummary(data.summary || { totalReviews: 0, averageRating: 0 })
    } catch (err) {
      console.error('Error fetching reviews:', err)
      // Don't show error to user for reviews, just use empty state
      setReviews([])
      setRatingDistribution([])
      setReviewsSummary({ totalReviews: 0, averageRating: 0 })
    } finally {
      setReviewsLoading(false)
    }
  }

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
        
        // Fetch reviews after product is loaded
        if (data.product?._id) {
          fetchReviews(data.product._id)
        }
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

  // Refetch reviews when showAllReviews changes
  useEffect(() => {
    if (product?._id) {
      fetchReviews(product._id)
    }
  }, [showAllReviews])
  
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
            <Button variant="ghost" size="sm">
              Continue shopping
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content - Gumroad Style Layout */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Product Image & Details (2/3 width) */}
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
            
            {/* Image Gallery Thumbnails */}
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
                        i < Math.floor(reviewsSummary.averageRating || product.stats?.rating?.average || 0) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {reviewsSummary.totalReviews || product.stats?.rating?.count || 0} ratings
                </span>
              </div>
            </div>
            
            {/* What You Get Section */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg">What You Get</h3>
              <ul className="space-y-3">
                {product.features && product.features.length > 0 ? (
                  product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))
                ) : (
                  <>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">A complete digital product with instant access</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">Step-by-step guidance and implementation</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">Pre-built examples and templates for quick start</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">Comprehensive documentation and resources</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
            
            {/* Description */}
            <div className="space-y-4">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                {product.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 last:mb-0 leading-relaxed text-sm">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            
            {/* Files Preview */}
            {product.files && product.files.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Download includes</h3>
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
                          <p className="font-medium text-sm">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(1)} MB
                          </p>
                        </div>
                      </div>
                      {file.isPreview && (
                        <Badge variant="outline" className="text-xs">Preview</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {product.requirements && product.requirements.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Requirements</h3>
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

            {/* Related Products Section - Commented out for now */}
            {/* 
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Customers who bought this item also bought</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="w-full h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg mb-3 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">Sample Product</span>
                  </div>
                  <h4 className="font-medium mb-1">Related Course</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded-full bg-muted"></div>
                    <span className="text-sm text-muted-foreground">{product.creator.name}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">$0+</Badge>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="w-full h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg mb-3 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">Guide</span>
                  </div>
                  <h4 className="font-medium mb-1">Complete Guide</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded-full bg-muted"></div>
                    <span className="text-sm text-muted-foreground">{product.creator.name}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">$0+</Badge>
                </div>
              </div>
            </div>
            */}
          </div>
          
          {/* Right Column - Purchase Card & Ratings (1/3 width) */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <Card className="p-6 sticky top-8">
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Price:</p>
                  <div className="flex items-baseline justify-center gap-2 mb-4">
                    <span className="text-3xl font-bold">
                      {formatPrice(product.discountedPrice || product.price.amount, product.price.currency)}
                    </span>
                    {product.price.originalPrice > product.price.amount && (
                      <span className="text-lg text-muted-foreground line-through">
                        {formatPrice(product.price.originalPrice, product.price.currency)}
                      </span>
                    )}
                  </div>
                  
                  {showPurchaseButton && (
                    <Button 
                      onClick={handlePurchase}
                      className="w-full h-12 text-lg font-semibold mb-3"
                      disabled={!product.isAvailable}
                      size="lg"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      {product.isAvailable ? 'Add to cart' : 'Out of Stock'}
                    </Button>
                  )}
                  
                  <p className="text-xs text-muted-foreground">
                    {product.shortDescription || 'Use this guide to get instant access to advanced techniques and strategies'}
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Heart className="h-4 w-4 mr-2" />
                    Add to wishlist
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Inventory Status */}
                {product.inventory?.type === 'limited' && (
                  <p className="text-sm text-muted-foreground text-center">
                    {product.inventory.quantity - product.inventory.sold} left in stock
                  </p>
                )}
              </div>
            </Card>
            
            {/* Ratings Section */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">Ratings</h3>
                  {reviewsLoading && (
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                  )}
                </div>
                
                {reviewsSummary.totalReviews > 0 ? (
                  <>
                    {/* Rating Distribution */}
                    <div className="space-y-2">
                      {ratingDistribution.map((rating) => (
                        <div key={rating.stars} className="flex items-center gap-2">
                          <span className="text-sm font-medium">{rating.stars} stars</span>
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary rounded-full h-2 transition-all duration-300"
                              style={{ width: `${rating.percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{rating.percentage}%</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Individual Reviews */}
                    <div className="space-y-4 pt-4 border-t">
                      {reviews.length > 0 ? (
                        <>
                          {reviews.map((review) => (
                            <div key={review._id} className="space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                  ))}
                                </div>
                                {review.isVerifiedPurchase && (
                                  <Badge variant="outline" className="text-xs">Verified Purchase</Badge>
                                )}
                              </div>
                              <p className="text-sm leading-relaxed">{review.comment}</p>
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center overflow-hidden">
                                  {review.user.avatar ? (
                                    <img 
                                      src={review.user.avatar} 
                                      alt={review.user.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-xs text-white font-medium">
                                      {review.user.name.charAt(0).toUpperCase()}
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {review.user.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  • {new Date(review.reviewedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          ))}
                          
                          {/* Load More / Show Less */}
                          {reviewsSummary.totalReviews > 3 && (
                            <Button 
                              variant="link" 
                              size="sm" 
                              className="text-xs p-0 h-auto flex items-center gap-1"
                              onClick={() => setShowAllReviews(!showAllReviews)}
                              disabled={reviewsLoading}
                            >
                              {showAllReviews ? (
                                <>
                                  Show less
                                  <ChevronUp className="h-3 w-3" />
                                </>
                              ) : (
                                <>
                                  Show all {reviewsSummary.totalReviews} reviews
                                  <ChevronDown className="h-3 w-3" />
                                </>
                              )}
                            </Button>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No reviews yet
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">⭐</div>
                    <p className="text-sm text-muted-foreground">No ratings yet</p>
                    <p className="text-xs text-muted-foreground mt-1">Be the first to review this product!</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
        
        {/* Creator Info Section */}
        <div className="max-w-7xl mx-auto mt-12">
          <Card className="p-6">
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
                  <p className="text-sm mb-4">{product.creator.bio}</p>
                )}
                <div className="flex items-center gap-4">
                  <Link to={`/${product.creator.username}`}>
                    <Button variant="outline" size="sm">
                      View all products
                    </Button>
                  </Link>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{product.stats?.views || 0} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      <span>{product.stats?.sales || 0} sales</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="max-w-7xl mx-auto mt-8">
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
      
      {/* Sticky CTA for Mobile */}
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
              Add to cart
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}