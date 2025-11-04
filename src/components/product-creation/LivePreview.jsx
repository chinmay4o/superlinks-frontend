import React from 'react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Star, ShoppingCart, Check, Heart, Share, Download, Users, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '../ui/card'

export function LivePreview({ productData, previewMode }) {
  const formatPrice = (amount, currency = 'INR') => {
    const symbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£' }
    return `${symbols[currency] || '₹'}${amount}`
  }

  // Device Frame Component
  const DeviceFrame = ({ children, mode }) => {
    if (mode === 'mobile') {
      return (
        <div className="mx-auto" style={{ width: '280px' }}>
          {/* iPhone Frame */}
          <div className="bg-black rounded-[30px] p-2 shadow-2xl">
            <div className="bg-white rounded-[26px] overflow-hidden h-[600px] relative">
              {/* iPhone Notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-10"></div>
              
              {/* Status Bar */}
              <div className="absolute top-2 left-4 right-4 flex justify-between items-center text-black text-xs font-medium z-20">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-black rounded-full"></div>
                    <div className="w-1 h-1 bg-black rounded-full"></div>
                    <div className="w-1 h-1 bg-black rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  </div>
                  <svg className="w-6 h-3 ml-1" viewBox="0 0 24 12">
                    <rect x="1" y="3" width="20" height="6" rx="2" fill="none" stroke="black" strokeWidth="1"/>
                    <rect x="22" y="4.5" width="1" height="3" rx="0.5" fill="black"/>
                    <rect x="2" y="4" width="16" height="4" rx="1" fill="black"/>
                  </svg>
                </div>
              </div>

              {/* Content */}
              <div className="pt-8 h-full overflow-y-auto">
                {children}
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Desktop Frame
    return (
      <div className="w-full">
        {/* MacBook Frame */}
        <div className="bg-gray-800 rounded-t-xl p-4 shadow-2xl">
          <div className="bg-white rounded-lg overflow-hidden" style={{ height: '500px' }}>
            {/* Browser Bar */}
            <div className="bg-gray-100 px-4 py-3 border-b flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 bg-white rounded-md px-3 py-1 text-sm text-gray-600 border">
                🔒 superlinks.ai/{productData.customUrl || 'your-product-url'}
              </div>
            </div>

            {/* Content */}
            <div className="h-full overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Product Landing Page Preview
  const ProductLandingPage = () => (
    <div className="bg-white min-h-full">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-semibold">SuperLinks</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className={`${previewMode === 'mobile' ? 'px-4' : 'max-w-6xl mx-auto px-8'} py-6`}>
        <div className={`grid ${previewMode === 'mobile' ? 'grid-cols-1 gap-6' : 'grid-cols-1 lg:grid-cols-2 gap-12'} items-start`}>
          
          {/* Left Column - Product Media */}
          <div className="space-y-4">
            {/* Main Product Image */}
            <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl overflow-hidden border-2 border-gray-100">
              {productData.coverImage?.preview ? (
                <img 
                  src={productData.coverImage.preview} 
                  alt="Product cover" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="h-full flex items-center justify-center text-center">
                  <div>
                    <div className="w-20 h-20 bg-purple-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                      <Download className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="text-lg font-semibold text-gray-700">
                      {productData.title || 'Your Product Title'}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Product Preview</div>
                  </div>
                </div>
              )}
            </div>

            {/* Product Gallery Thumbnails */}
            {previewMode === 'desktop' && (
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="aspect-square bg-gray-100 rounded-lg border-2 border-transparent hover:border-purple-200 cursor-pointer transition-colors">
                    <div className="w-full h-full bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg flex items-center justify-center">
                      <div className="text-xs text-gray-400">#{i + 1}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-6">
            {/* Creator Info */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">You</span>
              </div>
              <div>
                <div className="font-semibold text-gray-900">Your Profile</div>
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  4.9 • 1,234 sales
                </div>
              </div>
            </div>

            {/* Product Title */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-2">
                {productData.title || 'Your Product Title Here'}
              </h1>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  Digital Product
                </Badge>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Users className="h-3 w-3" />
                  <span>2.1k customers</span>
                </div>
              </div>
            </div>

            {/* Rating & Social Proof */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-2 text-sm font-medium">4.9 (324 reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(productData.price.amount, productData.price.currency)}
                </span>
                {productData.offerDiscount && productData.discountPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(productData.discountPrice, productData.price.currency)}
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600">One-time payment • Instant access</div>
            </div>

            {/* Purchase Button */}
            <div className="space-y-3">
              <Button className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" disabled>
                <ShoppingCart className="h-5 w-5 mr-2" />
                {productData.buttonText || 'Get it now'}
              </Button>
              <div className="text-xs text-center text-gray-500">
                🔒 Secure payment • 💯 30-day money back guarantee
              </div>
            </div>

            {/* What You'll Get */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">What you'll get:</h3>
              <div className="space-y-2">
                {[
                  'Instant download access',
                  'Lifetime updates included',
                  'Email support from creator',
                  'Commercial license included'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-12 space-y-6">
          <h2 className="text-xl font-bold text-gray-900">About this product</h2>
          <div className="prose prose-gray max-w-none">
            {productData.description ? (
              <div dangerouslySetInnerHTML={{ __html: productData.description }} />
            ) : (
              <div className="space-y-4 text-gray-600">
                <p>
                  Describe your product to let customers know what to expect. Include highlights like the purpose, key activities, or notable features. Make it engaging and informative to generate interest and excitement.
                </p>
                <p>
                  This is where you can provide more detailed information about your digital product, its benefits, and what makes it valuable to your customers.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section Preview */}
        {previewMode === 'desktop' && (
          <div className="mt-12 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Customer Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 2 }, (_, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                      <div>
                        <div className="font-medium text-sm">Customer {i + 1}</div>
                        <div className="flex">
                          {Array.from({ length: 5 }, (_, j) => (
                            <Star key={j} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    "Amazing quality and exactly what I was looking for. Highly recommend this digital product!"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <DeviceFrame mode={previewMode}>
      <ProductLandingPage />
    </DeviceFrame>
  )
}

export default LivePreview