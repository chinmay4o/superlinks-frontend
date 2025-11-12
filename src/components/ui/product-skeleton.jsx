import React from 'react'

// Enhanced animated skeleton loader with varying speeds
const SkeletonBox = ({ className, delay = 0, duration = 1.5 }) => (
  <div 
    className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-pulse ${className}`}
    style={{
      animation: `shimmer ${duration}s ease-in-out ${delay}s infinite`,
      backgroundImage: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)'
    }}
  >
  </div>
)

// Add CSS keyframes for shimmer effect
const shimmerStyles = `
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
    100% {
      background-position: 200% 0;
      opacity: 0.6;
    }
  }
  
  @keyframes pulse-slow {
    0%, 100% {
      opacity: 0.4;
    }
    50% {
      opacity: 0.8;
    }
  }
  
  @keyframes pulse-medium {
    0%, 100% {
      opacity: 0.5;
    }
    50% {
      opacity: 0.9;
    }
  }
  
  @keyframes pulse-fast {
    0%, 100% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
  }
`

export const ProductLandingSkeleton = () => {
  // Inject shimmer styles
  React.useEffect(() => {
    const styleSheet = document.createElement('style')
    styleSheet.textContent = shimmerStyles
    document.head.appendChild(styleSheet)
    return () => document.head.removeChild(styleSheet)
  }, [])

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background dots */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-300 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `pulse-slow ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="border-b relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <SkeletonBox className="h-8 w-32 rounded" duration={1.2} />
          <SkeletonBox className="h-8 w-8 rounded" duration={1.8} delay={0.1} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Product Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Main Image */}
            <SkeletonBox className="aspect-video rounded-lg" duration={2} />
            
            {/* Product Title */}
            <div className="space-y-3">
              <SkeletonBox className="h-8 w-full rounded" duration={1.5} delay={0.2} />
              <SkeletonBox className="h-8 w-3/4 rounded" duration={1.8} delay={0.4} />
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-lg border p-6 space-y-4">
              <SkeletonBox className="h-6 w-48 rounded" duration={1.3} delay={0.1} />
              <div className="space-y-3">
                {Array.from({ length: 5 }, (_, i) => (
                  <SkeletonBox 
                    key={i} 
                    className={`h-4 rounded ${i === 4 ? 'w-2/3' : 'w-full'}`}
                    duration={1.2 + i * 0.1}
                    delay={0.1 * i}
                  />
                ))}
              </div>
            </div>

            {/* What's Included Card */}
            <div className="bg-white rounded-lg border p-6 space-y-4">
              <SkeletonBox className="h-6 w-40 rounded" duration={1.4} delay={0.2} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <SkeletonBox className="w-5 h-5 rounded" duration={1} delay={0.1 * i} />
                    <SkeletonBox className="h-4 w-32 rounded" duration={1.3} delay={0.2 * i} />
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials Card */}
            <div className="bg-white rounded-lg border p-6 space-y-6">
              <div className="flex items-center space-x-2">
                <SkeletonBox className="w-5 h-5 rounded" duration={1.2} />
                <SkeletonBox className="h-6 w-32 rounded" duration={1.5} delay={0.1} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 2 }, (_, i) => (
                  <div key={i} className="p-4 border rounded-lg space-y-3">
                    <div className="flex space-x-1">
                      {Array.from({ length: 5 }, (_, j) => (
                        <SkeletonBox key={j} className="w-4 h-4 rounded" duration={0.8} delay={0.1 * j} />
                      ))}
                    </div>
                    <SkeletonBox className="h-16 w-full rounded" duration={1.6} delay={0.3 * i} />
                    <div className="flex items-center space-x-3">
                      <SkeletonBox className="w-10 h-10 rounded-full" duration={1.2} delay={0.2} />
                      <div className="space-y-2">
                        <SkeletonBox className="h-4 w-20 rounded" duration={1} delay={0.3} />
                        <SkeletonBox className="h-3 w-24 rounded" duration={1.1} delay={0.4} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
            {/* Product Details Card */}
            <div className="bg-white rounded-lg border p-6 space-y-4">
              <SkeletonBox className="h-6 w-32 rounded" duration={1.3} />
              
              {/* Price */}
              <div className="flex justify-between items-center">
                <SkeletonBox className="h-4 w-12 rounded" duration={1} />
                <SkeletonBox className="h-8 w-20 rounded" duration={1.5} delay={0.2} />
              </div>
              
              {/* Buy Button */}
              <SkeletonBox className="h-12 w-full rounded" duration={2} delay={0.3} />
              
              {/* Instant Download */}
              <div className="flex items-center justify-center space-x-2">
                <SkeletonBox className="w-4 h-4 rounded" duration={1.2} />
                <SkeletonBox className="h-4 w-24 rounded" duration={1.4} delay={0.1} />
              </div>
            </div>

            {/* Files Card */}
            <div className="bg-white rounded-lg border p-6 space-y-4">
              <SkeletonBox className="h-6 w-28 rounded" duration={1.2} />
              <div className="space-y-3">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <SkeletonBox className="w-5 h-5 rounded" duration={1} delay={0.1 * i} />
                    <div className="flex-1 space-y-2">
                      <SkeletonBox className="h-4 w-full rounded" duration={1.3} delay={0.2 * i} />
                      <SkeletonBox className="h-3 w-16 rounded" duration={1.1} delay={0.3 * i} />
                    </div>
                    <SkeletonBox className="w-4 h-4 rounded" duration={1} delay={0.4 * i} />
                  </div>
                ))}
              </div>
            </div>

            {/* Creator Profile Card */}
            <div className="bg-white rounded-lg border p-6 space-y-4">
              <SkeletonBox className="h-6 w-28 rounded" duration={1.4} />
              <div className="flex items-start space-x-3">
                <SkeletonBox className="w-12 h-12 rounded-full" duration={1.8} />
                <div className="flex-1 space-y-2">
                  <SkeletonBox className="h-4 w-24 rounded" duration={1.2} delay={0.1} />
                  <SkeletonBox className="h-3 w-32 rounded" duration={1.3} delay={0.2} />
                  <div className="flex space-x-4 mt-3">
                    <SkeletonBox className="h-3 w-16 rounded" duration={1} delay={0.3} />
                    <SkeletonBox className="h-3 w-20 rounded" duration={1.1} delay={0.4} />
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Summary Card */}
            <div className="bg-white rounded-lg border p-6 text-center space-y-4">
              <SkeletonBox className="h-6 w-16 rounded" duration={1.3} />
              <SkeletonBox className="h-10 w-12 rounded mx-auto" duration={1.6} delay={0.1} />
              <div className="flex justify-center space-x-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <SkeletonBox key={i} className="w-4 h-4 rounded" duration={1} delay={0.1 * i} />
                ))}
              </div>
              <SkeletonBox className="h-4 w-20 rounded mx-auto" duration={1.2} delay={0.3} />
            </div>
          </div>
        </div>

      </div>
      
      {/* Loading message with animated dots */}
      <div className="fixed bottom-8 right-8 bg-white rounded-lg shadow-lg border p-4 flex items-center space-x-3 z-20">
        <div className="flex space-x-1">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-blue-500 rounded-full"
              style={{
                animation: `pulse-fast 1s ease-in-out infinite`,
                animationDelay: `${0.2 * i}s`
              }}
            />
          ))}
        </div>
        <span className="text-sm text-gray-600 font-medium">Loading amazing content...</span>
      </div>
    </div>
  )
}

export const ProductHeaderSkeleton = () => {
  return (
    <div className="flex items-center space-x-3">
      <SkeletonBox className="w-10 h-10 rounded-full" duration={1.5} />
      <div className="space-y-1">
        <SkeletonBox className="h-4 w-24 rounded" duration={1.2} />
        <SkeletonBox className="h-3 w-16 rounded" duration={1.3} delay={0.1} />
      </div>
    </div>
  )
}

export const ReviewsSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <SkeletonBox className="w-8 h-8 rounded-full" duration={1.4} delay={0.1 * i} />
              <div className="space-y-1">
                <SkeletonBox className="h-4 w-20 rounded" duration={1.2} delay={0.2 * i} />
                <SkeletonBox className="h-3 w-16 rounded" duration={1.3} delay={0.3 * i} />
              </div>
            </div>
            <div className="flex space-x-1">
              {Array.from({ length: 5 }, (_, j) => (
                <SkeletonBox key={j} className="w-3 h-3 rounded" duration={1} delay={0.1 * j + 0.1 * i} />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <SkeletonBox className="h-4 w-full rounded" duration={1.5} delay={0.4 * i} />
            <SkeletonBox className="h-4 w-3/4 rounded" duration={1.6} delay={0.5 * i} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProductLandingSkeleton