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
      return <Badge variant="secondary">Archived</Badge>
    }
    if (product.isPublished) {
      return <Badge variant="default">Published</Badge>
    }
    return <Badge variant="outline">Draft</Badge>
  }

  const formatCurrency = (amount, currency = 'INR') => {
    const symbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£' }
    return `${symbols[currency] || currency} ${amount}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading products...</p>
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
        <Button onClick={() => navigate('/dashboard/products/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Create Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{pagination.total}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-2xl font-bold">
                  {products.filter(p => p.isPublished).length}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <Eye className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Drafts</p>
                <p className="text-2xl font-bold">
                  {products.filter(p => p.isDraft).length}
                </p>
              </div>
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Edit className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">
                  ₹{products.reduce((sum, p) => sum + (p.stats?.revenue || 0), 0).toLocaleString()}
                </p>
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-purple-600" />
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
              <Button onClick={() => navigate('/dashboard/products/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Product
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product._id} className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg line-clamp-2">{product.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(product)}
                      <Badge variant="outline" className="text-xs">
                        {PRODUCT_CATEGORIES.find(c => c.value === product.category)?.label || product.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/dashboard/products/${product._id}/edit`)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/dashboard/products/${product._id}`)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
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
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {product.images?.cover && (
                    <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden">
                      <img 
                        src={product.images.cover.url} 
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {product.shortDescription || product.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-4">
                        <span className="font-semibold">
                          {formatCurrency(product.price.amount, product.price.currency)}
                        </span>
                        <span className="text-muted-foreground">
                          {product.stats?.sales || 0} sales
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>{product.stats?.views || 0} views</span>
                        <span>₹{(product.stats?.revenue || 0).toLocaleString()} revenue</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
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