import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Home, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Mail, 
  Settings,
  User,
  CreditCard,
  Globe,
  Link as LinkIcon,
  Instagram,
  Target,
  Download
} from 'lucide-react'

const navigation = [
  {
    name: 'Home',
    href: '/dashboard',
    icon: Home,
    description: 'Overview dashboard showing earnings, product stats'
  },
  {
    name: 'Products',
    href: '/dashboard/products',
    icon: Package,
    description: 'Create, edit, or delete digital products'
  },
  {
    name: 'Sales',
    href: '/dashboard/purchases',
    icon: ShoppingCart,
    description: 'Customer transactions and sales analytics'
  },
  {
    name: 'My Purchases',
    href: '/dashboard/my-purchases',
    icon: Download,
    description: 'View products you have purchased'
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    description: 'Graphs and charts of your performance'
  },
  {
    name: 'Communications',
    href: '/dashboard/communications',
    icon: Mail,
    description: 'Email and WhatsApp campaigns'
  },
  {
    name: 'Link in Bio',
    href: '/dashboard/bio',
    icon: LinkIcon,
    description: 'Create your link-in-bio page'
  },
  {
    name: 'Instagram Automation',
    href: '/dashboard/instagram/settings',
    icon: Instagram,
    description: 'Connect Instagram and set up comment funnels'
  },
  {
    name: 'Comment Funnels',
    href: '/dashboard/instagram/funnels',
    icon: Target,
    description: 'Create and manage Instagram comment funnels'
  }
]

const settingsNavigation = [
  {
    name: 'Profile Settings',
    href: '/dashboard/settings/profile',
    icon: User,
    description: 'User name, email, profile photo, bio'
  },
  {
    name: 'Payment Settings',
    href: '/dashboard/settings/payments',
    icon: CreditCard,
    description: 'Bank account integration and payout history'
  },
  {
    name: 'Custom Domain',
    href: '/dashboard/settings/domain',
    icon: Globe,
    description: 'Connect a custom domain via DNS or CNAME'
  },
  {
    name: 'General Settings',
    href: '/dashboard/settings',
    icon: Settings,
    description: 'General account settings'
  }
]

export function Sidebar({ className }) {
  const location = useLocation()
  const { user } = useAuth()

  const isActive = (href) => {
    return location.pathname === href || location.pathname.startsWith(href + '/')
  }

  return (
    <div className={cn('flex h-full w-64 flex-col bg-card border-r', className)}>
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">SL</span>
          </div>
          <span className="font-semibold text-lg">Superlinks</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {/* Main Navigation */}
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'sidebar-nav-item group',
                  isActive(item.href) && 'active'
                )}
                title={item.description}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </Link>
            )
          })}
        </div>

        {/* Settings Section */}
        <div className="pt-6">
          <div className="px-3 pb-2">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Settings
            </h3>
          </div>
          <div className="space-y-1">
            {settingsNavigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'sidebar-nav-item group',
                    isActive(item.href) && 'active'
                  )}
                  title={item.description}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* User Info */}
      <div className="border-t p-4">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center overflow-hidden">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name || 'User'} 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-primary-foreground font-medium text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.name || 'Loading...'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email || 'Loading...'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}