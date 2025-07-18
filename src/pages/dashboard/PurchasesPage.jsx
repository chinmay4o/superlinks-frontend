import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Separator } from '../../components/ui/separator'
import { 
  Search, 
  Filter, 
  Download, 
  Eye,
  Mail,
  User,
  Calendar,
  DollarSign,
  Package,
  X,
  ExternalLink,
  Copy,
  MoreHorizontal,
  RefreshCw,
  Check
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu'
import { Checkbox } from '../../components/ui/checkbox'
import { toast } from 'react-hot-toast'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5005/api'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' }
]

const TIME_FILTERS = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' },
  { value: 'year', label: 'This Year' }
]

export function PurchasesPage() {
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPurchase, setSelectedPurchase] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [timeFilter, setTimeFilter] = useState('all')
  const [productFilter, setProductFilter] = useState('all')
  
  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 20
  })
  
  // Stats
  const [stats, setStats] = useState({
    totalPurchases: 0,
    totalRevenue: 0,
    completedPurchases: 0,
    pendingPurchases: 0
  })
  
  const fetchPurchases = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.currentPage,
        limit: pagination.limit,
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(timeFilter !== 'all' && { timeFilter }),
        ...(productFilter !== 'all' && { product: productFilter }),
        ...(searchTerm && { search: searchTerm })
      })
      
      const response = await fetch(`${API_BASE_URL}/purchases?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setPurchases(data.purchases || [])
        setPagination({
          currentPage: data.currentPage || 1,
          totalPages: data.totalPages || 1,
          total: data.total || 0,
          limit: pagination.limit
        })
        
        // Calculate stats
        calculateStats(data.purchases || [])
      } else {
        throw new Error(data.message || 'Failed to fetch purchases')
      }
    } catch (error) {
      console.error('Error fetching purchases:', error)
      toast.error('Failed to load purchases')
      setPurchases([])
    } finally {
      setLoading(false)
    }
  }, [statusFilter, timeFilter, productFilter, pagination.currentPage, searchTerm, pagination.limit])

  useEffect(() => {
    fetchPurchases()
  }, [fetchPurchases])
  
  const calculateStats = (purchaseList) => {
    const stats = purchaseList.reduce((acc, purchase) => {
      acc.totalPurchases++
      acc.totalRevenue += purchase.amount || 0
      
      if (purchase.status === 'completed') {
        acc.completedPurchases++
      } else if (purchase.status === 'pending') {
        acc.pendingPurchases++
      }
      
      return acc
    }, {
      totalPurchases: 0,
      totalRevenue: 0,
      completedPurchases: 0,
      pendingPurchases: 0
    })
    
    setStats(stats)
  }
  
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, currentPage: 1 }))
    fetchPurchases()
  }
  
  const handlePurchaseClick = (purchase) => {
    setSelectedPurchase(purchase)
    setSidebarOpen(true)
  }
  
  const closeSidebar = () => {
    setSidebarOpen(false)
    setSelectedPurchase(null)
  }
  
  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { 
        className: 'bg-green-100 text-green-800 border-green-200 px-3 py-1 rounded-full text-xs font-medium', 
        label: 'Completed' 
      },
      pending: { 
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200 px-3 py-1 rounded-full text-xs font-medium', 
        label: 'Pending' 
      },
      failed: { 
        className: 'bg-red-100 text-red-800 border-red-200 px-3 py-1 rounded-full text-xs font-medium', 
        label: 'Failed' 
      },
      refunded: { 
        className: 'bg-gray-100 text-gray-800 border-gray-200 px-3 py-1 rounded-full text-xs font-medium', 
        label: 'Refunded' 
      }
    }
    
    const config = statusConfig[status] || { 
      className: 'bg-blue-100 text-blue-800 border-blue-200 px-3 py-1 rounded-full text-xs font-medium', 
      label: status 
    }
    
    return (
      <span className={config.className}>
        {config.label}
      </span>
    )
  }
  
  const formatCurrency = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const getPaymentMethodBadge = (method) => {
    const methodConfig = {
      razorpay: { 
        className: 'bg-purple-100 text-purple-800 border-purple-200 px-3 py-1 rounded-full text-xs font-medium', 
        label: 'Razorpay' 
      },
      free: { 
        className: 'bg-green-100 text-green-800 border-green-200 px-3 py-1 rounded-full text-xs font-medium', 
        label: 'Free' 
      },
      stripe: { 
        className: 'bg-blue-100 text-blue-800 border-blue-200 px-3 py-1 rounded-full text-xs font-medium', 
        label: 'Stripe' 
      },
      paypal: { 
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200 px-3 py-1 rounded-full text-xs font-medium', 
        label: 'PayPal' 
      }
    }
    
    const config = methodConfig[method] || { 
      className: 'bg-gray-100 text-gray-800 border-gray-200 px-3 py-1 rounded-full text-xs font-medium', 
      label: method || 'Unknown' 
    }
    
    return (
      <span className={config.className}>
        {config.label}
      </span>
    )
  }

  const handleSelectAll = (checked) => {
    setSelectAll(checked)
    if (checked) {
      setSelectedItems(purchases.map(p => p.purchaseId))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (purchaseId, checked) => {
    if (checked) {
      const newSelectedItems = [...selectedItems, purchaseId]
      setSelectedItems(newSelectedItems)
      
      // Check if all items are now selected
      if (newSelectedItems.length === purchases.length) {
        setSelectAll(true)
      }
    } else {
      setSelectedItems(prev => prev.filter(id => id !== purchaseId))
      setSelectAll(false)
    }
  }

  const handleBulkAction = (action) => {
    if (action === 'Export') {
      exportToCSV()
    } else {
      console.log(`Bulk action: ${action}`, selectedItems)
      toast.success(`${action} action applied to ${selectedItems.length} items`)
      setSelectedItems([])
      setSelectAll(false)
    }
  }

  const exportToCSV = () => {
    try {
      // Get selected purchases or all purchases if none selected
      const purchasesToExport = selectedItems.length > 0 
        ? purchases.filter(p => selectedItems.includes(p.purchaseId))
        : purchases
      
      if (purchasesToExport.length === 0) {
        toast.error('No purchases to export')
        return
      }
      
      // Define CSV headers
      const headers = [
        'Purchase ID',
        'Customer Name',
        'Customer Email',
        'Customer Mobile',
        'Product Title',
        'Product Category',
        'Purchase Date',
        'Amount',
        'Currency',
        'Status',
        'Payment Method',
        'Country',
        'Seller Amount'
      ]
      
      // Convert purchases to CSV rows
      const csvRows = purchasesToExport.map(purchase => [
        purchase.purchaseId || '',
        purchase.buyer?.name || '',
        purchase.buyer?.email || '',
        purchase.buyer?.mobile || '',
        purchase.product?.title || '',
        purchase.product?.category || '',
        purchase.createdAt ? new Date(purchase.createdAt).toLocaleDateString('en-IN') : '',
        purchase.amount || 0,
        purchase.currency || 'INR',
        purchase.status || '',
        purchase.payment?.method || '',
        purchase.customerInfo?.country || purchase.buyer?.country || '',
        purchase.sellerAmount || 0
      ])
      
      // Combine headers and rows
      const csvContent = [headers, ...csvRows]
        .map(row => row.map(field => 
          // Escape fields that contain commas or quotes
          typeof field === 'string' && (field.includes(',') || field.includes('"')) 
            ? `"${field.replace(/"/g, '""')}"`
            : field
        ).join(','))
        .join('\n')
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      
      link.setAttribute('href', url)
      link.setAttribute('download', `sales-export-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success(`Exported ${purchasesToExport.length} sales records`)
      
      // Clear selection after export
      setSelectedItems([])
      setSelectAll(false)
      
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export CSV')
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading sales...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sales</h1>
          <p className="text-muted-foreground">
            Track and manage customer transactions
          </p>
        </div>
        <Button onClick={fetchPurchases} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-2xl font-bold">{stats.totalPurchases}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="h-4 w-4 text-blue-600" />
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
                  {formatCurrency(stats.totalRevenue)}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats.completedPurchases}</p>
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
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{stats.pendingPurchases}</p>
              </div>
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Calendar className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by customer email, purchase ID, or product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Time" />
              </SelectTrigger>
              <SelectContent>
                {TIME_FILTERS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button onClick={handleSearch} variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {selectedItems.length} item(s) selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('Export')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedItems([])
                    setSelectAll(false)
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Purchases Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
          <CardDescription>
            {pagination.total} total sales found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {purchases.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No sales found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' || timeFilter !== 'all'
                  ? 'Try adjusting your search filters'
                  : 'Your sales will appear here once customers make purchases'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 p-4 bg-muted/30 rounded-t-lg text-sm font-medium text-muted-foreground border-b">
                <div className="col-span-1 flex items-center">
                  <Checkbox 
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                    className="mr-2"
                  />
                </div>
                <div className="col-span-3">Customer</div>
                <div className="col-span-2">Product Info</div>
                <div className="col-span-2">Purchase Date</div>
                <div className="col-span-2">Amount</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1">Actions</div>
              </div>
              
              {/* Table Body */}
              <div className="divide-y divide-border">
                {purchases.map((purchase) => {
                  const customerInitials = purchase.buyer?.name
                    ? purchase.buyer.name.split(' ').map(n => n[0]).join('').toUpperCase()
                    : purchase.buyer?.email?.charAt(0).toUpperCase() || 'C'
                  
                  return (
                    <div
                      key={purchase.purchaseId}
                      className="grid grid-cols-12 gap-4 p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handlePurchaseClick(purchase)}
                    >
                      {/* Checkbox Column */}
                      <div className="col-span-1 flex items-center">
                        <Checkbox 
                          checked={selectedItems.includes(purchase.purchaseId)}
                          onCheckedChange={(checked) => handleSelectItem(purchase.purchaseId, checked)}
                          onClick={(e) => e.stopPropagation()}
                          className="mr-2"
                        />
                      </div>
                      {/* Customer Column */}
                      <div className="col-span-3 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                          {customerInitials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm truncate">
                            {purchase.buyer?.name || 'Unknown Customer'}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {purchase.buyer?.email || 'No email'}
                          </div>
                          {purchase.buyer?.mobile && (
                            <div className="text-xs text-muted-foreground truncate">
                              {purchase.buyer.mobile}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Product Info Column */}
                      <div className="col-span-2 flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-md flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                          {purchase.product?.images?.cover?.url ? (
                            <img
                              src={purchase.product.images.cover.url}
                              alt={purchase.product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            purchase.product?.title?.charAt(0) || 'P'
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm truncate">
                            {purchase.product?.title || 'Unknown Product'}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {purchase.product?.category || 'Digital Product'}
                          </div>
                        </div>
                      </div>
                      
                      {/* Purchase Date Column */}
                      <div className="col-span-2 flex items-center">
                        <div className="text-sm">
                          <div className="font-medium">
                            {new Date(purchase.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(purchase.createdAt).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                      
                      {/* Amount Column */}
                      <div className="col-span-2 flex items-center">
                        <div className="text-sm">
                          <div className="font-semibold">
                            {formatCurrency(purchase.amount, purchase.currency)}
                          </div>
                          {purchase.sellerAmount && (
                            <div className="text-xs text-muted-foreground">
                              Earnings: {formatCurrency(purchase.sellerAmount, purchase.currency)}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Status Column */}
                      <div className="col-span-1 flex items-center gap-2">
                        <div className="flex flex-col gap-2">
                          {getStatusBadge(purchase.status)}
                          {purchase.payment?.method && getPaymentMethodBadge(purchase.payment.method)}
                        </div>
                      </div>
                      
                      {/* Actions Column */}
                      <div className="col-span-1 flex items-center justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => e.stopPropagation()}
                              className="h-8 w-8 p-0"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => copyToClipboard(purchase.purchaseId)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy Purchase ID
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => copyToClipboard(purchase.buyer?.email)}>
                              <Mail className="h-4 w-4 mr-2" />
                              Copy Customer Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handlePurchaseClick(purchase)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View Receipt
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download Files
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              {/* Table Footer with Summary */}
              {purchases.length > 0 && (
                <div className="p-4 bg-muted/20 rounded-b-lg border-t">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-6">
                      <span className="text-muted-foreground">
                        Showing {purchases.length} of {pagination.total} sales
                      </span>
                      <span className="text-muted-foreground">
                        Page {pagination.currentPage} of {pagination.totalPages}
                      </span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="font-medium">
                          Total Revenue: {formatCurrency(stats.totalRevenue)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {stats.completedPurchases} completed • {stats.pendingPurchases} pending
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
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
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const page = i + 1
              return (
                <Button
                  key={page}
                  variant={pagination.currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: page }))}
                >
                  {page}
                </Button>
              )
            })}
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
      
      {/* User Details Sidebar */}
      {sidebarOpen && selectedPurchase && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 transition-opacity duration-300" 
            onClick={closeSidebar} 
          />
          
          {/* Sidebar */}
          <div className="ml-auto w-full max-w-md bg-background border-l shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Purchase Details</h2>
              <Button variant="ghost" size="sm" onClick={closeSidebar}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Purchase Info */}
              <div>
                <h3 className="font-semibold mb-3">Purchase Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Purchase ID:</span>
                    <span className="font-mono">{selectedPurchase.purchaseId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    {getStatusBadge(selectedPurchase.status)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-semibold">
                      {formatCurrency(selectedPurchase.amount, selectedPurchase.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span>{formatDate(selectedPurchase.createdAt)}</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold mb-3">Customer Information</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground block">Name:</span>
                    <span className="font-medium">{selectedPurchase.buyer?.name || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Email:</span>
                    <span className="font-medium">{selectedPurchase.buyer?.email}</span>
                  </div>
                  {selectedPurchase.buyer?.mobile && (
                    <div>
                      <span className="text-muted-foreground block">Mobile:</span>
                      <span className="font-medium">{selectedPurchase.buyer.mobile}</span>
                    </div>
                  )}
                  {selectedPurchase.customerInfo?.country && (
                    <div>
                      <span className="text-muted-foreground block">Country:</span>
                      <span className="font-medium">{selectedPurchase.customerInfo.country}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <Separator />
              
              {/* Product Info */}
              <div>
                <h3 className="font-semibold mb-3">Product Information</h3>
                <div className="flex gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold overflow-hidden">
                    {selectedPurchase.product?.images?.cover?.url ? (
                      <img
                        src={selectedPurchase.product.images.cover.url}
                        alt={selectedPurchase.product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      selectedPurchase.product?.title?.charAt(0) || 'P'
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">{selectedPurchase.product?.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedPurchase.product?.category}
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Payment Info */}
              <div>
                <h3 className="font-semibold mb-3">Payment Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Method:</span>
                    <span className="capitalize">{selectedPurchase.payment?.method || 'Unknown'}</span>
                  </div>
                  {selectedPurchase.payment?.razorpayPaymentId && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transaction ID:</span>
                      <span className="font-mono text-xs">
                        {selectedPurchase.payment.razorpayPaymentId}
                      </span>
                    </div>
                  )}
                  {selectedPurchase.fees && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Platform Fee:</span>
                        <span>{formatCurrency(selectedPurchase.fees.platform?.amount || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment Fee:</span>
                        <span>{formatCurrency(selectedPurchase.fees.payment?.amount || 0)}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span className="text-muted-foreground">Your Earnings:</span>
                        <span>{formatCurrency(selectedPurchase.sellerAmount || 0)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Actions */}
              <div className="space-y-2">
                <Button variant="outline" className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Customer
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
                {selectedPurchase.status === 'completed' && (
                  <Button variant="destructive" className="w-full">
                    Process Refund
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}