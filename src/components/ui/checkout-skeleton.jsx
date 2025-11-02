import React from 'react'

export const CheckoutSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Customer Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
            </div>

            {/* Customer Information Form */}
            <div className="border rounded-lg p-6 space-y-6">
              <div className="h-6 bg-gray-200 rounded w-40 animate-pulse"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email */}
                <div className="md:col-span-2 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* Full Name */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* Mobile */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* GST ID */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Discount Code Section */}
            <div className="border rounded-lg p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="flex space-x-2">
                <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Support Creator Section */}
            <div className="border rounded-lg p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-40 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              
              {/* Tip Options */}
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
              
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Order Summary Card */}
            <div className="border rounded-lg p-6 space-y-6">
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
              
              {/* Product Info */}
              <div className="flex space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>
              </div>

              {/* Separator */}
              <div className="h-px bg-gray-200 animate-pulse"></div>

              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              </div>

              {/* Separator */}
              <div className="h-px bg-gray-200 animate-pulse"></div>

              {/* Total */}
              <div className="flex justify-between">
                <div className="h-6 bg-gray-200 rounded w-12 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>

              {/* Purchase Button */}
              <div className="h-12 bg-gray-200 rounded animate-pulse"></div>

              {/* Security Notice */}
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
            </div>

            {/* Money Back Guarantee */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const CheckoutFormSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="border rounded-lg p-6 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-40"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const OrderSummarySkeleton = () => {
  return (
    <div className="border rounded-lg p-6 space-y-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-32"></div>
      
      {/* Product */}
      <div className="flex space-x-4">
        <div className="w-16 h-16 bg-gray-200 rounded"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>

      {/* Price breakdown */}
      <div className="space-y-3">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-12"></div>
          </div>
        ))}
      </div>

      {/* Button */}
      <div className="h-12 bg-gray-200 rounded"></div>
    </div>
  )
}

export default CheckoutSkeleton