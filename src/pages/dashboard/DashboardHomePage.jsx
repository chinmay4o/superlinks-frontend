import React from 'react'
import { Link } from 'react-router-dom'
import { 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign,
  Plus,
  ArrowUpRight,
  Eye,
  ShoppingCart
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { formatCurrency, formatNumber } from '../../lib/utils'

// Mock data - in real app this would come from API
const stats = {
  totalEarnings: 12580,
  totalSales: 156,
  totalProducts: 8,
  totalViews: 3420
}

const recentSales = [
  {
    id: 1,
    product: 'React Mastery Course',
    buyer: 'john@example.com',
    amount: 299,
    date: '2024-01-10T10:30:00Z'
  },
  {
    id: 2,
    product: 'UI Design Templates',
    buyer: 'sarah@example.com',
    amount: 49,
    date: '2024-01-10T09:15:00Z'
  },
  {
    id: 3,
    product: 'JavaScript Handbook',
    buyer: 'mike@example.com',
    amount: 79,
    date: '2024-01-09T16:45:00Z'
  }
]

const topProducts = [
  {
    id: 1,
    name: 'React Mastery Course',
    sales: 45,
    revenue: 13455,
    views: 1240
  },
  {
    id: 2,
    name: 'UI Design Templates',
    sales: 67,
    revenue: 3283,
    views: 890
  },
  {
    id: 3,
    name: 'JavaScript Handbook',
    sales: 34,
    revenue: 2686,
    views: 567
  }
]

export function DashboardHomePage() {
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
            <div className="text-2xl font-bold">{formatCurrency(stats.totalEarnings)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalSales)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">+2</span> added this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalViews)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+18.1%</span> from last month
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
              {recentSales.map((sale) => (
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
              ))}
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
              {topProducts.map((product, index) => (
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
                      <span>{((product.sales / product.views) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ))}
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