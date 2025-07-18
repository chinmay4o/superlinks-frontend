import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Separator } from '../../components/ui/separator'
import { 
  Search, 
  Download, 
  Eye,
  Calendar,
  DollarSign,
  Package,
  ExternalLink,
  ShoppingBag,
  Star,
  User,
  FileText,
  Video,
  Image as ImageIcon
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { Link } from 'react-router-dom'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5005/api'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' }
]

export function MyPurchasesPage() {
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  
  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 20
  })

  const fetchPurchases = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      const queryParams = new URLSearchParams({
        page: pagination.currentPage,
        limit: pagination.limit,
        status: statusFilter,
        search: searchTerm
      })

      const response = await fetch(`${API_BASE_URL}/purchases/my-purchases?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch purchases')
      }

      const data = await response.json()
      setPurchases(data.purchases || [])
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        total: data.total,
        limit: pagination.limit
      })
    } catch (error) {
      console.error('Error fetching purchases:', error)
      toast.error('Failed to load your purchases')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPurchases()
  }, [pagination.currentPage, statusFilter, searchTerm])

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency
    }).format(amount || 0)
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: 'bg-green-500', label: 'Completed' },
      pending: { color: 'bg-yellow-500', label: 'Pending' },
      failed: { color: 'bg-red-500', label: 'Failed' },
      refunded: { color: 'bg-gray-500', label: 'Refunded' },
      cancelled: { color: 'bg-gray-500', label: 'Cancelled' }
    }
    
    const config = statusConfig[status] || { color: 'bg-gray-500', label: status }
    
    return (
      <Badge className={`${config.color} text-white`}>
        {config.label}
      </Badge>
    )
  }

  const getProductIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'ebook':
      case 'pdf':
        return <FileText className="h-4 w-4" />
      case 'video':
      case 'course':
        return <Video className="h-4 w-4" />
      case 'template':
      case 'design':
        return <ImageIcon className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Purchases</h1>
        </div>
        <div className="text-center py-8">Loading your purchases...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Purchases</h1>
          <p className="text-muted-foreground">
            View and access all products you've purchased
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by purchase ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchases List */}
      {purchases.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No purchases found</h3>
            <p className="text-muted-foreground mb-4">
              You haven't purchased any products yet. Start exploring!
            </p>
            <Button asChild>
              <Link to="/">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {purchases.map((purchase) => (
            <Card key={purchase._id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Product Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      {purchase.product?.images?.cover ? (
                        <img 
                          src={purchase.product.images.cover} 
                          alt={purchase.product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getProductIcon(purchase.product?.category)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-1 truncate">
                        {purchase.product?.title || 'Product Deleted'}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <User className="h-3 w-3" />
                        <span>by {purchase.seller?.name || 'Unknown Seller'}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(purchase.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          <span>{formatCurrency(purchase.amount, purchase.currency)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>ID: {purchase.purchaseId}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      {getStatusBadge(purchase.status)}
                    </div>
                    
                    {purchase.status === 'completed' && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          asChild
                        >
                          <Link to={`/dashboard/content/${purchase.purchaseId}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Content
                          </Link>
                        </Button>
                        {purchase.canDownload && (
                          <Button 
                            size="sm"
                            asChild
                          >
                            <a 
                              href={`${API_BASE_URL}${purchase.downloadUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </a>
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Download Info for completed purchases */}
                {purchase.status === 'completed' && purchase.downloadInfo && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div>
                        Downloads: {purchase.downloadInfo.downloadCount || 0} / {purchase.downloadInfo.maxDownloads || 3}
                      </div>
                      {purchase.downloadInfo.expiresAt && (
                        <div>
                          Expires: {formatDate(purchase.downloadInfo.expiresAt)}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.total)} of {pagination.total} purchases
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
              disabled={pagination.currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}