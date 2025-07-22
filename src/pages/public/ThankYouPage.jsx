import React, { useState, useEffect } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Separator } from '../../components/ui/separator'
import { 
  CheckCircle, 
  Download, 
  Mail, 
  Share2, 
  Star,
  Receipt,
  ArrowRight,
  ExternalLink,
  User,
  Shield,
  Clock
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5005/api'

export function ThankYouPage() {
  const { purchaseId } = useParams()
  const location = useLocation()
  const { user } = useAuth()
  const [purchase, setPurchase] = useState(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  
  useEffect(() => {
    // Check if data was passed via navigation state
    if (location.state) {
      setPurchase({
        purchaseId: location.state.purchaseId,
        product: location.state.product,
        amount: location.state.amount
      })
      setLoading(false)
    } else if (purchaseId) {
      fetchPurchaseDetails()
    }
  }, [purchaseId, location.state])
  
  const fetchPurchaseDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/purchases/${purchaseId}`)
      const data = await response.json()
      
      if (response.ok) {
        setPurchase(data.purchase)
      } else {
        throw new Error(data.message || 'Purchase not found')
      }
    } catch (error) {
      console.error('Error fetching purchase:', error)
      toast.error('Failed to load purchase details')
    } finally {
      setLoading(false)
    }
  }
  
  const handleDownload = async () => {
    if (!purchase?.downloadInfo?.downloadKey) {
      toast.error('Download not available')
      return
    }
    
    try {
      setDownloading(true)
      
      // Open download URL in a new window to trigger download
      const downloadUrl = `${API_BASE_URL}/download/${purchase.downloadInfo.downloadKey}`
      window.open(downloadUrl, '_blank')
      
      toast.success('Download started!')
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Download failed')
    } finally {
      setDownloading(false)
    }
  }
  
  const handleShare = async () => {
    const productUrl = `${window.location.origin}/${purchase.product.creator.username}/${purchase.product.slug}`
    
    try {
      await navigator.share({
        title: purchase.product.title,
        text: `Check out this amazing product: ${purchase.product.title}`,
        url: productUrl
      })
    } catch (err) {
      // Fallback to copying to clipboard
      await navigator.clipboard.writeText(productUrl)
      toast.success('Product link copied to clipboard!')
    }
  }
  
  const formatCurrency = (amount, currency = 'INR') => {
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
          <p className="mt-4 text-muted-foreground">Loading purchase details...</p>
        </div>
      </div>
    )
  }
  
  if (!purchase) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold mb-2">Purchase Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find the purchase details. Please check your email for the receipt.
          </p>
          <Button asChild variant="outline">
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-2xl font-bold">
              Superlinks
            </Link>
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link to={`/${purchase.product.creator.username}`}>
                  More by {purchase.product.creator.name}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">
            {purchase.amount === 0 ? 'Thank You! Your Free Product is Ready!' : 'Thank You for Your Purchase!'}
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            {purchase.amount === 0 
              ? 'Your free product has been claimed successfully and you\'ll receive an email with access details.'
              : 'Your order has been confirmed and you\'ll receive an email receipt shortly.'
            }
          </p>
          <p className="text-lg text-gray-500">
            Order ID: <span className="font-mono font-semibold">{purchase.purchaseId}</span>
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Details */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Your Product
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex-shrink-0 overflow-hidden">
                  {purchase.product.images?.cover?.url ? (
                    <img
                      src={purchase.product.images.cover.url}
                      alt={purchase.product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                      {purchase.product.title.charAt(0)}
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{purchase.product.title}</h3>
                  <p className="text-gray-600 mb-2">by {purchase.product.creator.name}</p>
                  <Badge variant="secondary">{purchase.product.category}</Badge>
                </div>
              </div>
              
              {purchase.product.description && (
                <div>
                  <h4 className="font-semibold mb-2">About this product:</h4>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {purchase.product.description}
                  </p>
                </div>
              )}
              
              {/* Content Access Section */}
              <div className="space-y-3">
                <h4 className="font-semibold">Access your content:</h4>
                
                {/* View Rich Text Content Button */}
                {purchase.product.contentMetadata?.hasRichContent && (
                  <Button 
                    asChild
                    className="w-full mb-2"
                    size="lg"
                    variant="default"
                  >
                    <Link to={`/content/${purchase.purchaseId}`}>
                      <div className="flex items-center gap-2">
                        <ExternalLink className="h-5 w-5" />
                        View Content
                      </div>
                    </Link>
                  </Button>
                )}
                
                {/* Download Files Button */}
                {purchase.product.files && purchase.product.files.length > 0 && purchase.downloadInfo?.downloadKey && (
                  <Button 
                    onClick={handleDownload}
                    disabled={downloading}
                    className="w-full"
                    size="lg"
                    variant={purchase.product.contentMetadata?.hasRichContent ? "outline" : "default"}
                  >
                    {downloading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Downloading...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Download className="h-5 w-5" />
                        Download Files
                      </div>
                    )}
                  </Button>
                )}
                
                <p className="text-xs text-gray-500 text-center">
                  {purchase.product.contentMetadata?.hasRichContent 
                    ? "View your content online or download additional files. Access available for 30 days."
                    : "Download link will be available for 30 days. Check your email for backup links."
                  }
                </p>
              </div>
              
              {/* Share Product */}
              <div className="pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={handleShare}
                  className="w-full"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share this product
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>{purchase.product.title}</span>
                    <span>
                      {purchase.amount === 0 ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">FREE</Badge>
                      ) : (
                        formatCurrency(purchase.amount, purchase.currency)
                      )}
                    </span>
                  </div>
                  
                  {purchase.discount && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({purchase.discount.code})</span>
                      <span>-{formatCurrency(purchase.discount.amount, purchase.currency)}</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold text-lg">
                    <span>{purchase.amount === 0 ? 'Total' : 'Total Paid'}</span>
                    <span>
                      {purchase.amount === 0 ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 text-lg">FREE</Badge>
                      ) : (
                        formatCurrency(purchase.amount, purchase.currency)
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Next Steps */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Check Your Email</h4>
                    <p className="text-sm text-gray-600">
                      We've sent your receipt and download links to your email address.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Leave a Review</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Help others by sharing your experience with this product.
                    </p>
                    <Button variant="outline" size="sm">
                      Write a Review
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <ExternalLink className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Explore More</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Discover more amazing products from {purchase.product.creator.name}.
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/${purchase.product.creator.username}`}>
                        View Profile
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Buyer Login Prompt - Only show if user is not logged in */}
            {!user && (
              <Card className="shadow-lg border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <User className="h-5 w-5" />
                    Save Your Purchase for Later
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-green-700">
                    Create a free account to easily access all your purchases anytime, anywhere! 
                    Never lose your downloads again.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Shield className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-sm text-green-800">Secure Access</h4>
                        <p className="text-xs text-green-600">
                          Your purchases are safely stored in your personal dashboard
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Clock className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-sm text-green-800">Lifetime Access</h4>
                        <p className="text-xs text-green-600">
                          Re-download your products whenever you need them
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Download className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-sm text-green-800">Easy Management</h4>
                        <p className="text-xs text-green-600">
                          View all your purchases in one convenient location
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <Button asChild className="flex-1">
                      <Link to="/register" state={{ buyerEmail: purchase?.buyer?.email }}>
                        Create Account
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="flex-1">
                      <Link to="/login" state={{ returnUrl: `/dashboard/my-purchases` }}>
                        Sign In
                      </Link>
                    </Button>
                  </div>
                  
                  <p className="text-xs text-green-600 text-center">
                    Already have an account? Sign in to add this purchase to your dashboard!
                  </p>
                </CardContent>
              </Card>
            )}
            
            {/* Support */}
            <Card className="shadow-lg border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-3">
                  If you have any questions about your purchase or need assistance downloading your files, 
                  we're here to help.
                </p>
                <Button variant="outline" size="sm">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}