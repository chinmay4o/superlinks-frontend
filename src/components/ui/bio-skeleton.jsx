import React from 'react'

export const BioBuilderSkeleton = () => {
  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Panel - Blocks */}
      <div className="w-80 bg-white border-r flex flex-col">
        {/* Panel Header */}
        <div className="p-4 border-b">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-24 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-40"></div>
        </div>
        
        {/* Blocks List */}
        <div className="flex-1 p-4 space-y-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                <div className="h-6 w-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-32"></div>
            </div>
          ))}
        </div>
        
        {/* Add Block Button */}
        <div className="p-4 border-t">
          <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
        </div>
      </div>
      
      {/* Center Panel - Mobile Preview */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-80 bg-white rounded-3xl shadow-xl overflow-hidden border-8 border-gray-800">
          {/* Phone Header */}
          <div className="h-6 bg-gray-800"></div>
          
          {/* Phone Content */}
          <div className="p-6 space-y-4">
            {/* Profile Section */}
            <div className="text-center space-y-3">
              <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse mx-auto"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-48 mx-auto"></div>
            </div>
            
            {/* Links Section */}
            <div className="space-y-3">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
            
            {/* Social Links */}
            <div className="flex justify-center space-x-4">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Panel - Properties */}
      <div className="w-80 bg-white border-l flex flex-col">
        {/* Panel Header */}
        <div className="p-4 border-b">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-28 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-36"></div>
        </div>
        
        {/* Properties Form */}
        <div className="flex-1 p-4 space-y-6">
          {/* Form Group 1 */}
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
          </div>
          
          {/* Form Group 2 */}
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
            <div className="h-24 bg-gray-200 rounded animate-pulse w-full"></div>
          </div>
          
          {/* Form Group 3 */}
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
          </div>
          
          {/* Form Group 4 */}
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
            <div className="flex space-x-2">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="w-12 h-8 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Save Button */}
        <div className="p-4 border-t">
          <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
        </div>
      </div>
    </div>
  )
}

export const BlocksSkeleton = ({ count = 6 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="p-3 border border-gray-200 rounded-lg animate-pulse">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="h-6 w-10 bg-gray-200 rounded"></div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
      ))}
    </div>
  )
}

export const PreviewSkeleton = () => {
  return (
    <div className="w-80 bg-white rounded-3xl shadow-xl overflow-hidden border-8 border-gray-800">
      {/* Phone Header */}
      <div className="h-6 bg-gray-800"></div>
      
      {/* Phone Content */}
      <div className="p-6 space-y-4">
        {/* Profile Section */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse mx-auto"></div>
          <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-48 mx-auto"></div>
        </div>
        
        {/* Links Section */}
        <div className="space-y-3">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
        
        {/* Social Links */}
        <div className="flex justify-center space-x-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const PropertiesSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Form Group 1 */}
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
        <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
      </div>
      
      {/* Form Group 2 */}
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
        <div className="h-24 bg-gray-200 rounded animate-pulse w-full"></div>
      </div>
      
      {/* Form Group 3 */}
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
        <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
      </div>
      
      {/* Form Group 4 */}
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
        <div className="flex space-x-2">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="w-12 h-8 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BioBuilderSkeleton