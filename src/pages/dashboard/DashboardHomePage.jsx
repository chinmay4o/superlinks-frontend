import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign,
  Plus,
  ArrowUpRight,
  Eye,
  ShoppingCart,
  Loader2
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { formatCurrency, formatNumber } from '../../lib/utils'
import toast from 'react-hot-toast'

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005/api'

export function DashboardHomePage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalSales: 0,
    totalProducts: 0,
    totalViews: 0
  })
  const [recentSales, setRecentSales] = useState([])
  const [topProducts, setTopProducts] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch analytics overview
      const [analyticsResponse, purchasesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/analytics/overview`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }),
        fetch(`${API_BASE_URL}/purchases?limit=5&status=completed`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      ])

      const analyticsData = await analyticsResponse.json()
      const purchasesData = await purchasesResponse.json()

      if (analyticsResponse.ok) {
        setStats(analyticsData)
      } else {
        toast.error('Failed to load analytics data')
      }

      if (purchasesResponse.ok) {
        // Transform purchases data for recent sales
        const transformedSales = purchasesData.purchases.map(purchase => ({
          id: purchase._id,
          product: purchase.product?.title || 'Unknown Product',
          buyer: purchase.buyerEmail,
          amount: purchase.sellerAmount,
          date: purchase.createdAt
        }))
        setRecentSales(transformedSales)

        // Calculate top products from purchases (temporary solution)
        const productStats = {}
        purchasesData.purchases.forEach(purchase => {
          if (purchase.product) {
            const productId = purchase.product._id
            if (!productStats[productId]) {
              productStats[productId] = {
                id: productId,
                name: purchase.product.title,
                sales: 0,
                revenue: 0,
                views: purchase.product.views || 0
              }
            }
            productStats[productId].sales += 1
            productStats[productId].revenue += purchase.sellerAmount
          }
        })
        
        // Get top 3 products by revenue
        const topProductsList = Object.values(productStats)
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 3)
        
        setTopProducts(topProductsList)
      } else {
        toast.error('Failed to load recent sales')
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link to="/dashboard/products/new">
            <Plus className="h-4 w-4" />
            Create Product
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalEarnings || 0)}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalSales || 0)}</div>
            <p className="text-xs text-muted-foreground">
              Total completed sales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground">
              Published products
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalViews || 0)}</div>
            <p className="text-xs text-muted-foreground">
              Total product views
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Sales */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>Your latest customer transactions</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/purchases" className="gap-1">
                View all
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.length > 0 ? (
                recentSales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{sale.product}</p>
                      <p className="text-xs text-muted-foreground">{sale.buyer}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(sale.amount)}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(sale.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <ShoppingCart className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No sales yet</p>
                  <p className="text-xs text-muted-foreground">Sales will appear here once you start selling</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>Your best performing products</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/analytics" className="gap-1">
                View analytics
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.length > 0 ? (
                topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">#{index + 1}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.sales} sales • {formatNumber(product.views)} views
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(product.revenue)}</p>
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <TrendingUp className="h-3 w-3" />
                        <span>{product.views > 0 ? ((product.sales / product.views) * 100).toFixed(1) : 0}%</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No products yet</p>
                  <p className="text-xs text-muted-foreground">Create your first product to see performance</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with these common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2" asChild>
              <Link to="/dashboard/products/new">
                <Package className="h-6 w-6 text-primary" />
                <div className="text-center">
                  <div className="font-medium">Create Your First Product</div>
                  <div className="text-xs text-muted-foreground">Upload and sell digital products</div>
                </div>
              </Link>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2" asChild>
              <Link to="/dashboard/settings/profile">
                <Users className="h-6 w-6 text-primary" />
                <div className="text-center">
                  <div className="font-medium">Customize Your Profile</div>
                  <div className="text-xs text-muted-foreground">Set up your creator profile</div>
                </div>
              </Link>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2" asChild>
              <Link to="/dashboard/settings/payments">
                <DollarSign className="h-6 w-6 text-primary" />
                <div className="text-center">
                  <div className="font-medium">Setup Payments</div>
                  <div className="text-xs text-muted-foreground">Configure your payment methods</div>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}