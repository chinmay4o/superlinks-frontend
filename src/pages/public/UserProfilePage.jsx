import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { SimpleThemeToggle } from '../../components/ui/theme-toggle'
import { 
  Globe, 
  MapPin, 
  Calendar,
  Star,
  Download,
  Users,
  Package,
  ExternalLink,
  Heart,
  Share2,
  Mail
} from 'lucide-react'
import { toast } from 'react-hot-toast'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5005/api'

export function UserProfilePage() {
  const { username } = useParams()
  const [user, setUser] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    fetchUserProfile()
  }, [username])
  
  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      
      // Fetch user profile
      const userResponse = await fetch(`${API_BASE_URL}/users/profile/${username}`)
      if (!userResponse.ok) {
        throw new Error('User not found')
      }
      const userData = await userResponse.json()
      setUser(userData.user)
      
      // Fetch user's published products
      const productsResponse = await fetch(`${API_BASE_URL}/products/public/${username}`)
      if (productsResponse.ok) {
        const productsData = await productsResponse.json()
        setProducts(productsData.products || [])
      }
      
    } catch (error) {
      console.error('Error fetching profile:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }
  
  const formatCurrency = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }
  
  const handleShare = () => {
    const profileUrl = window.location.href
    if (navigator.share) {
      navigator.share({
        title: `${user.name}'s Profile`,
        text: `Check out ${user.name}'s digital products`,
        url: profileUrl
      })
    } else {
      navigator.clipboard.writeText(profileUrl)
      toast.success('Profile link copied to clipboard!')
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">👤</div>
          <h1 className="text-2xl font-bold mb-2">Creator Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The creator @{username} doesn't exist or their profile is private.
          </p>
          <Button onClick={() => window.history.back()} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-2xl font-bold">
              Superlinks
            </Link>
            <div className="flex items-center space-x-4">
              <SimpleThemeToggle />
              <Button size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="mb-12">
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
                {/* Avatar */}
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-2xl">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                {/* Profile Info */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                      <p className="text-muted-foreground mb-3">@{user.username}</p>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex space-x-6 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-lg">{products.length}</div>
                        <div className="text-muted-foreground">Products</div>
                      </div>
                      {user.settings?.showEarnings && (
                        <div className="text-center">
                          <div className="font-bold text-lg">
                            {formatCurrency(user.stats?.totalEarnings || 0)}
                          </div>
                          <div className="text-muted-foreground">Earned</div>
                        </div>
                      )}
                      <div className="text-center">
                        <div className="font-bold text-lg">{user.stats?.totalSales || 0}</div>
                        <div className="text-muted-foreground">Sales</div>
                      </div>
                    </div>
                  </div>
                  
                  {user.bio && (
                    <p className="text-muted-foreground mb-4">{user.bio}</p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {user.website && (
                      <a 
                        href={user.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center hover:text-foreground transition-colors"
                      >
                        <Globe className="h-4 w-4 mr-1" />
                        Website
                      </a>
                    )}
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Joined {new Date(user.createdAt).toLocaleDateString('en-US', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Products Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Products</h2>
            <Badge variant="secondary">{products.length} item{products.length !== 1 ? 's' : ''}</Badge>
          </div>
          
          {products.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Products Yet</h3>
                <p className="text-muted-foreground">
                  {user.name} hasn't published any products yet. Check back later!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product._id} className="group hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-0">
                    {/* Product Image */}
                    <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg overflow-hidden">
                      {product.images?.cover?.url ? (
                        <img
                          src={product.images.cover.url}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white">
                          <div className="text-center">
                            <Package className="h-8 w-8 mx-auto mb-2" />
                            <div className="font-bold text-lg">{product.title.charAt(0)}</div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1 line-clamp-2">{product.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {product.category}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xl font-bold">
                          {product.price.amount === 0 ? (
                            <Badge className="bg-green-100 text-green-800">FREE</Badge>
                          ) : (
                            formatCurrency(product.price.amount, product.price.currency)
                          )}
                        </div>
                        
                        <Link to={`/checkout/${product._id}`}>
                          <Button size="sm">
                            {product.price.amount === 0 ? 'Get Free' : 'Buy Now'}
                          </Button>
                        </Link>
                      </div>
                      
                      {/* Product Stats */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Download className="h-3 w-3 mr-1" />
                          {product.stats?.totalSales || 0} sales
                        </div>
                        {product.averageRating > 0 && (
                          <div className="flex items-center">
                            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                            {product.averageRating.toFixed(1)}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="mt-16 pt-8 border-t text-center text-muted-foreground">
          <p>Powered by <span className="font-semibold">Superlinks</span></p>
        </div>
      </div>
    </div>
  )
}