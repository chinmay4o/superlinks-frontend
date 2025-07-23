// Dashboard Color System
// Centralized color configuration for consistent theming across all dashboard pages

export const dashboardColors = {
  // Stats Card Colors
  earnings: {
    gradient: 'from-green-50 to-green-100 dark:from-green-950 dark:to-green-900',
    icon: 'bg-green-500',
    text: 'text-green-700 dark:text-green-300',
    subtext: 'text-green-600 dark:text-green-400',
  },
  
  sales: {
    gradient: 'from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900',
    icon: 'bg-blue-500',
    text: 'text-blue-700 dark:text-blue-300',
    subtext: 'text-blue-600 dark:text-blue-400',
  },
  
  products: {
    gradient: 'from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900',
    icon: 'bg-purple-500',
    text: 'text-purple-700 dark:text-purple-300',
    subtext: 'text-purple-600 dark:text-purple-400',
  },
  
  views: {
    gradient: 'from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900',
    icon: 'bg-orange-500',
    text: 'text-orange-700 dark:text-orange-300',
    subtext: 'text-orange-600 dark:text-orange-400',
  },
  
  // Section Colors
  recentSales: {
    gradient: 'from-rose-50 to-pink-50 dark:from-rose-950 dark:to-pink-950',
    title: 'text-rose-900 dark:text-rose-100',
    button: 'text-rose-600 hover:text-rose-700 hover:bg-rose-100',
  },
  
  topProducts: {
    gradient: 'from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950',
    title: 'text-amber-900 dark:text-amber-100',
    button: 'text-amber-600 hover:text-amber-700 hover:bg-amber-100',
  },
  
  // Quick Actions Colors
  quickActions: {
    gradient: 'from-indigo-50 via-white to-cyan-50 dark:from-indigo-950 dark:via-slate-900 dark:to-cyan-950',
    title: 'text-indigo-900 dark:text-indigo-100',
    
    createProduct: {
      border: 'border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300',
      icon: 'bg-indigo-500',
      text: 'text-indigo-900 dark:text-indigo-100',
      subtext: 'text-indigo-600 dark:text-indigo-400',
    },
    
    profile: {
      border: 'border-teal-200 hover:bg-teal-50 hover:border-teal-300',
      icon: 'bg-teal-500',
      text: 'text-teal-900 dark:text-teal-100',
      subtext: 'text-teal-600 dark:text-teal-400',
    },
    
    payments: {
      border: 'border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300',
      icon: 'bg-emerald-500',
      text: 'text-emerald-900 dark:text-emerald-100',
      subtext: 'text-emerald-600 dark:text-emerald-400',
    },
  },
  
  // Ranking Badge Colors
  rankings: {
    first: 'from-yellow-400 to-yellow-500',
    second: 'from-gray-300 to-gray-400',
    third: 'from-orange-400 to-orange-500',
  },
  
  // Primary CTA Button
  primaryButton: {
    gradient: 'from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700',
    shadow: 'shadow-lg',
  },
  
  // Common colors for consistency
  success: {
    gradient: 'from-green-50 to-green-100 dark:from-green-950 dark:to-green-900',
    text: 'text-green-600 dark:text-green-400',
    icon: 'text-green-500',
  },
  
  error: {
    gradient: 'from-red-50 to-red-100 dark:from-red-950 dark:to-red-900',
    text: 'text-red-600 dark:text-red-400',
    icon: 'text-red-500',
  },
  
  warning: {
    gradient: 'from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900',
    text: 'text-yellow-600 dark:text-yellow-400',
    icon: 'text-yellow-500',
  },
  
  info: {
    gradient: 'from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900',
    text: 'text-blue-600 dark:text-blue-400',
    icon: 'text-blue-500',
  },
}

// Helper function to get color classes as string
export const getColorClasses = (colorPath) => {
  const paths = colorPath.split('.')
  let current = dashboardColors
  
  for (const path of paths) {
    current = current[path]
    if (!current) return ''
  }
  
  return current
}