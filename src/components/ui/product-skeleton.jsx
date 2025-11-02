import React from 'react'

export const ProductLandingSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
            
            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-6">
            {/* Creator Info */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="space-y-1">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <div key={i} className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>

            {/* Purchase Button */}
            <div className="h-12 bg-gray-200 rounded animate-pulse"></div>

            {/* Features */}
            <div className="space-y-3">
              <div className="h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-12 space-y-6">
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="space-y-3">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            ))}
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 space-y-6">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          
          {/* Rating Summary */}
          <div className="border rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
              <div className="space-y-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <div className="h-3 bg-gray-200 rounded w-8 animate-pulse"></div>
                    <div className="h-2 bg-gray-200 rounded w-32 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-6 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-4">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="space-y-1">
                      <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {Array.from({ length: 5 }, (_, j) => (
                      <div key={j} className="w-3 h-3 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export const ProductHeaderSkeleton = () => {
  return (
    <div className="flex items-center space-x-3 animate-pulse">
      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
      <div className="space-y-1">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  )
}

export const ReviewsSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="border rounded-lg p-4 space-y-3 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="space-y-1">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            <div className="flex space-x-1">
              {Array.from({ length: 5 }, (_, j) => (
                <div key={j} className="w-3 h-3 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProductLandingSkeleton