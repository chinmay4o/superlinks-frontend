import React from 'react'

export const PurchaseCardSkeleton = ({ count = 5 }) => {
  return (
    <div className="grid gap-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="border-2 border-border rounded-lg p-6 animate-pulse">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Product Info */}
            <div className="flex items-start gap-4 flex-1">
              {/* Product Image/Icon */}
              <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
              
              {/* Product Details */}
              <div className="flex-1 min-w-0 space-y-2">
                {/* Product Title */}
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                
                {/* Seller Info */}
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
                
                {/* Purchase Details */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </div>

            {/* Status and Actions */}
            <div className="flex items-center gap-4">
              {/* Status Badge */}
              <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <div className="h-8 w-24 bg-gray-200 rounded"></div>
                <div className="h-8 w-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export const MyPurchasesHeaderSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded w-80 animate-pulse"></div>
        </div>
      </div>

      {/* Filters */}
      <div className="border rounded-lg p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-36 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PurchaseCardSkeleton