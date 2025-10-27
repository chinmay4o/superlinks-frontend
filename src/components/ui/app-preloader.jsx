import React from 'react'

export const AppPreloader = () => {
  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        {/* Logo or Brand */}
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <div className="h-4 w-4 bg-white rounded-sm"></div>
          </div>
          <span className="text-xl font-bold text-foreground">Superlinks</span>
        </div>
        
        {/* Loading Animation */}
        <div className="flex space-x-1">
          <div 
            className="h-2 w-2 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: '0ms' }}
          ></div>
          <div 
            className="h-2 w-2 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          ></div>
          <div 
            className="h-2 w-2 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          ></div>
        </div>
        
        <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
      </div>
    </div>
  )
}