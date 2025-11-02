import React from 'react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Star, ShoppingCart, Check } from 'lucide-react'
import { Card, CardContent } from '../ui/card'

export function LivePreview({ productData, previewMode }) {
  const formatPrice = (amount, currency = 'INR') => {
    const symbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£' }
    return `${symbols[currency] || '₹'}${amount}`
  }

  const containerClass = previewMode === 'mobile' 
    ? 'w-full max-w-sm mx-auto' 
    : 'w-full'

  return (
    <div className={`${containerClass} bg-background rounded-lg border overflow-hidden`}>
      {/* Preview URL Bar */}
      <div className="bg-muted/50 px-3 py-2 border-b">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
          </div>
          <div className="flex-1 bg-background rounded px-2 py-1 text-xs text-muted-foreground">
            superprofile.bio/{productData.customUrl || 'your-product-url'}
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
            <span className="text-xs">👤</span>
          </div>
          <span>Your Profile</span>
        </div>

        {/* Cover Image */}
        <div className="aspect-video bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center overflow-hidden">
          {productData.coverImage?.preview ? (
            <img 
              src={productData.coverImage.preview} 
              alt="Product cover" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center text-white/90">
              <div className="text-lg font-bold mb-1">
                {productData.title || 'Your Product Title Here'}
              </div>
              <div className="text-sm opacity-75">Product Preview</div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-3">
          <h1 className="font-bold text-lg leading-tight">
            {productData.title || 'Your Product Title Here'}
          </h1>

          <div className="text-sm text-muted-foreground">
            <strong>ABOUT THIS PRODUCT</strong>
          </div>

          <div className="text-sm leading-relaxed">
            {productData.description ? (
              <div dangerouslySetInnerHTML={{ __html: productData.description }} />
            ) : (
              <p>Describe your product to let customers know what to expect. Include highlights like the purpose, key activities, or notable features. Make it engaging and informative to generate interest and excitement.</p>
            )}
          </div>

          {/* Features */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500" />
              <span>Unlocks Digital Products</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500" />
              <span>{formatPrice(productData.price.amount, productData.price.currency)}</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-2">
            <Button className="w-full" disabled>
              {productData.buttonText || 'Get it now'} →
            </Button>
          </div>

          {/* Network Section */}
          <div className="pt-4 border-t">
            <div className="text-xs text-muted-foreground mb-2">
              <strong>INVITE YOUR NETWORK</strong>
            </div>
            <Button variant="outline" size="sm" className="w-full text-xs" disabled>
              Be back soon for the scoop! →
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Preview Adjustments */}
      {previewMode === 'mobile' && (
        <div className="bg-muted/30 px-3 py-2 text-xs text-center text-muted-foreground border-t">
          Mobile Preview
        </div>
      )}
    </div>
  )
}

export default LivePreview