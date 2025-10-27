import React, { useState, useEffect } from 'react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Eye, 
  Trash2, 
  Copy,
  ExternalLink,
  DollarSign,
  Users,
  Package,
 
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu'
import { useNavigate } from 'react-router-dom'
import productService from '../../services/productService'
import { dashboardColors } from '../../lib/dashboardColors'
import toast from 'react-hot-toast'

const PRODUCT_CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'ebook', label: 'Ebook' },
  { value: 'course', label: 'Video Course' },
  { value: 'template', label: 'Notion Template' },
  { value: 'art', label: 'Digital Art / Presets' },
  { value: 'toolkit', label: 'PDF / Docs / Toolkit' },
  { value: 'audio', label: 'Audio' },
  { value: 'software', label: 'Software' },
  { value: 'other', label: 'Other' }
]

const STATUS_FILTERS = [
  { value: 'all', label: 'All Status' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' }
]

export function ProductsPage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  })

  useEffect(() => {
    fetchProducts()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilter, statusFilter, pagination.currentPage])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = {
        page: pagination.currentPage,
        limit: 12,
        status: statusFilter === 'all' ? undefined : statusFilter,
        category: categoryFilter === 'all' ? undefined : categoryFilter,
        search: searchTerm || undefined
      }

      const response = await productService.getProducts(params)
      setProducts(response.products || [])
      setPagination({
        currentPage: response.currentPage || 1,
        totalPages: response.totalPages || 1,
        total: response.total || 0
      })
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, currentPage: 1 }))
    fetchProducts()
  }

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to archive this product?')) {
      return
    }

    try {
      await productService.deleteProduct(productId)
      toast.success('Product archived successfully')
      fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to archive product')
    }
  }

  const copyProductLink = (product) => {
    const link = `${window.location.origin}/${product.creator.username}/${product.slug}`
    navigator.clipboard.writeText(link)
    toast.success('Product link copied to clipboard')
  }

  const getStatusBadge = (product) => {
    if (product.isArchived) {
      return (
        <Badge className="bg-gray-500 text-white border-0 shadow-sm font-medium px-2.5 py-1">
          Archived
        </Badge>
      )
    }
    if (product.isPublished) {
      return (
        <Badge className="bg-green-500 text-white border-0 shadow-sm font-medium px-2.5 py-1">
          <div className="flex items-center space-x-1">
            <div className="h-1.5 w-1.5 bg-white rounded-full"></div>
            <span>Live</span>
          </div>
        </Badge>
      )
    }
    return (
      <Badge className="bg-orange-500 text-white border-0 shadow-sm font-medium px-2.5 py-1">
        <div className="flex items-center space-x-1">
          <Edit className="h-3 w-3" />
          <span>Draft</span>
        </div>
      </Badge>
    )
  }

  const formatCurrency = (amount, currency = 'INR') => {
    const symbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£' }
    return `${symbols[currency] || currency} ${amount}`
  }

  // Loading skeleton component matching the new design
  const ProductSkeleton = () => (
    <Card className="border border-gray-200 bg-white overflow-hidden">
      {/* Cover Image Skeleton */}
      <div className="relative">
        <div className="aspect-[16/10] w-full bg-gray-200 animate-pulse"></div>
        
        {/* Status Badge Skeleton */}
        <div className="absolute top-3 left-3">
          <div className="h-6 w-16 bg-gray-300 rounded-full animate-pulse"></div>
        </div>
        
        {/* Menu Button Skeleton */}
        <div className="absolute top-3 right-3">
          <div className="h-8 w-8 bg-gray-300 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-5 space-y-4">
        {/* Title and Category */}
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
          <div className="h-5 bg-gray-200 rounded animate-pulse w-20"></div>
        </div>
        
        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
        </div>
        
        {/* Stats */}
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
          <div className="space-y-1">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <div className="h-9 bg-gray-200 rounded animate-pulse flex-1"></div>
          <div className="h-9 bg-gray-200 rounded animate-pulse flex-1"></div>
        </div>
      </div>
    </Card>
  )

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-muted-foreground">
              Manage your digital products and track their performance
            </p>
          </div>
          <Button className={`bg-gradient-to-r ${dashboardColors.primaryButton.gradient} text-white border-0 ${dashboardColors.primaryButton.shadow}`}>
            <Plus className="h-4 w-4 mr-2" />
            Create Product
          </Button>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Card key={i} className="border-0 bg-gradient-to-br from-gray-50 to-gray-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters Skeleton */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-48 h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-48 h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-24 h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }, (_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Manage your digital products and track their performance
          </p>
        </div>
        <Button onClick={() => navigate('/dashboard/products/new')} className={`bg-gradient-to-r ${dashboardColors.primaryButton.gradient} text-white border-0 ${dashboardColors.primaryButton.shadow}`}>
          <Plus className="h-4 w-4 mr-2" />
          Create Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={`border-0 bg-gradient-to-br ${dashboardColors.products.gradient}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${dashboardColors.products.subtext}`}>Total Products</p>
                <p className={`text-2xl font-bold ${dashboardColors.products.text}`}>{pagination.total}</p>
              </div>
              <div className={`h-8 w-8 rounded-full ${dashboardColors.products.icon} flex items-center justify-center`}>
                <Package className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`border-0 bg-gradient-to-br ${dashboardColors.success.gradient}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${dashboardColors.success.text}`}>Published</p>
                <p className={`text-2xl font-bold ${dashboardColors.success.text}`}>
                  {products.filter(p => p.isPublished).length}
                </p>
              </div>
              <div className={`h-8 w-8 rounded-full ${dashboardColors.earnings.icon} flex items-center justify-center`}>
                <Eye className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`border-0 bg-gradient-to-br ${dashboardColors.warning.gradient}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${dashboardColors.warning.text}`}>Drafts</p>
                <p className={`text-2xl font-bold ${dashboardColors.warning.text}`}>
                  {products.filter(p => p.isDraft).length}
                </p>
              </div>
              <div className={`h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center`}>
                <Edit className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`border-0 bg-gradient-to-br ${dashboardColors.earnings.gradient}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${dashboardColors.earnings.subtext}`}>Total Revenue</p>
                <p className={`text-2xl font-bold ${dashboardColors.earnings.text}`}>
                  ₹{products.reduce((sum, p) => sum + (p.stats?.revenue || 0), 0).toLocaleString()}
                </p>
              </div>
              <div className={`h-8 w-8 rounded-full ${dashboardColors.earnings.icon} flex items-center justify-center`}>
                <DollarSign className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_FILTERS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button onClick={handleSearch} variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {products.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="mx-auto h-16 w-16 bg-muted rounded-full flex items-center justify-center">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">No products found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                    ? 'Try adjusting your search filters'
                    : 'Get started by creating your first digital product'}
                </p>
              </div>
              <Button onClick={() => navigate('/dashboard/products/new')} className={`bg-gradient-to-r ${dashboardColors.primaryButton.gradient} text-white border-0 ${dashboardColors.primaryButton.shadow}`}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Product
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <Card 
              key={product._id} 
              className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-200 hover:border-primary/30 bg-white overflow-hidden relative"
            >
              {/* Card Header with Status and Menu */}
              <div className="relative">
                {/* Cover Image */}
                {product.images?.cover ? (
                  <div className="aspect-[16/10] w-full bg-muted overflow-hidden">
                    <img 
                      src={product.images.cover.url} 
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/10] w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <Package className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                
                {/* Status Badge Overlay */}
                <div className="absolute top-3 left-3">
                  {getStatusBadge(product)}
                </div>
                
                {/* Quick Actions Menu */}
                <div className="absolute top-3 right-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-md backdrop-blur-sm"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/dashboard/products/${product._id}/edit`)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Product
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/dashboard/products/${product._id}`)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      {product.isPublished && (
                        <>
                          <DropdownMenuItem onClick={() => copyProductLink(product)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Link
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.open(`/${product.creator.username}/${product.slug}`, '_blank')}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Public Page
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDeleteProduct(product._id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5">
                {/* Title and Category */}
                <div className="space-y-2 mb-4">
                  <h3 className="font-semibold text-lg leading-tight line-clamp-2 text-gray-900">
                    {product.title}
                  </h3>
                  <Badge variant="outline" className="text-xs w-fit">
                    {PRODUCT_CATEGORIES.find(c => c.value === product.category)?.label || product.category}
                  </Badge>
                </div>
                
                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {product.shortDescription || product.description}
                </p>
                
                {/* Stats and Price */}
                <div className="space-y-3 mb-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">
                      {formatCurrency(product.price.amount, product.price.currency)}
                    </span>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {product.stats?.sales || 0} sales
                      </div>
                      <div className="text-xs text-gray-500">
                        ₹{(product.stats?.revenue || 0).toLocaleString()} revenue
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{product.stats?.views || 0} views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{((product.stats?.sales || 0) / Math.max(product.stats?.views || 1, 1) * 100).toFixed(1)}% conversion</span>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    onClick={() => navigate(`/dashboard/products/${product._id}/edit`)}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white h-9"
                    size="sm"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  
                  {product.isPublished ? (
                    <Button 
                      onClick={() => window.open(`/${product.creator.username}/${product.slug}`, '_blank')}
                      variant="outline"
                      className="flex-1 h-9 border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                      size="sm"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Live
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => navigate(`/dashboard/products/${product._id}`)}
                      variant="outline"
                      className="flex-1 h-9"
                      size="sm"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
            disabled={pagination.currentPage === 1}
          >
            Previous
          </Button>
          
          <div className="flex items-center space-x-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter(page => 
                page === 1 || 
                page === pagination.totalPages || 
                Math.abs(page - pagination.currentPage) <= 1
              )
              .map((page, index, array) => (
                <React.Fragment key={page}>
                  {index > 0 && array[index - 1] !== page - 1 && (
                    <span className="text-muted-foreground">...</span>
                  )}
                  <Button
                    variant={pagination.currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: page }))}
                  >
                    {page}
                  </Button>
                </React.Fragment>
              ))
            }
          </div>
          
          <Button
            variant="outline"
            onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
            disabled={pagination.currentPage === pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}