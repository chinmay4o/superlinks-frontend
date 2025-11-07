import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Checkbox } from '../ui/checkbox'
import { ChevronDown, ChevronUp, Info } from 'lucide-react'
import { Badge } from '../ui/badge'
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible'
import { useState } from 'react'

const CURRENCIES = [
  { value: 'INR', label: '₹ INR', symbol: '₹' },
  { value: 'USD', label: '$ USD', symbol: '$' },
  { value: 'EUR', label: '€ EUR', symbol: '€' },
  { value: 'GBP', label: '£ GBP', symbol: '£' }
]

export function PricingOptions({ productData, updateProductData }) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  const selectedCurrency = CURRENCIES.find(c => c.value === productData.price.currency) || CURRENCIES[0]

  return (
    <div className="space-y-6">
      {/* Pricing Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card 
          className={`cursor-pointer transition-all ${
            productData.pricingType === 'fixed' 
              ? 'ring-2 ring-primary bg-primary/5' 
              : 'hover:shadow-md'
          }`}
          onClick={() => updateProductData('pricingType', 'fixed')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full border-2 ${
                productData.pricingType === 'fixed' 
                  ? 'bg-primary border-primary' 
                  : 'border-muted-foreground'
              }`}>
                {productData.pricingType === 'fixed' && (
                  <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                )}
              </div>
              <div>
                <h3 className="font-medium">Fixed Price</h3>
                <p className="text-sm text-muted-foreground">Charge a one-time fixed pay</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all ${
            productData.pricingType === 'customer-decides' 
              ? 'ring-2 ring-primary bg-primary/5' 
              : 'hover:shadow-md'
          }`}
          onClick={() => updateProductData('pricingType', 'customer-decides')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full border-2 ${
                productData.pricingType === 'customer-decides' 
                  ? 'bg-primary border-primary' 
                  : 'border-muted-foreground'
              }`}>
                {productData.pricingType === 'customer-decides' && (
                  <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                )}
              </div>
              <div>
                <h3 className="font-medium">Customers decide price</h3>
                <p className="text-sm text-muted-foreground">Let customers pay any price</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Price Input */}
      {productData.pricingType === 'fixed' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price *</Label>
            <div className="flex gap-2">
              <div className="flex items-center bg-muted rounded-md px-3">
                <span className="text-sm font-medium">{selectedCurrency.symbol}</span>
              </div>
              <Input
                id="price"
                type="number"
                value={productData.price.amount}
                onChange={(e) => updateProductData('price.amount', Number(e.target.value))}
                placeholder="100"
                className="flex-1"
              />
              <Select 
                value={productData.price.currency} 
                onValueChange={(value) => updateProductData('price.currency', value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Discount Offer */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="discount"
              checked={productData.offerDiscount}
              onCheckedChange={(checked) => updateProductData('offerDiscount', checked)}
            />
            <Label htmlFor="discount" className="flex items-center gap-2">
              Offer discounted price
              <Info className="h-4 w-4 text-muted-foreground" />
            </Label>
          </div>

          {productData.offerDiscount && (
            <div className="space-y-2 ml-6">
              <Label htmlFor="discountPrice">Discounted Price</Label>
              <div className="flex gap-2">
                <div className="flex items-center bg-muted rounded-md px-3">
                  <span className="text-sm font-medium">{selectedCurrency.symbol}</span>
                </div>
                <Input
                  id="discountPrice"
                  type="number"
                  value={productData.discountPrice || ''}
                  onChange={(e) => updateProductData('discountPrice', Number(e.target.value))}
                  placeholder="80"
                  className="flex-1"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Customer Decides Price Settings */}
      {productData.pricingType === 'customer-decides' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="minPrice">Minimum Price (Optional)</Label>
            <div className="flex gap-2">
              <div className="flex items-center bg-muted rounded-md px-3">
                <span className="text-sm font-medium">{selectedCurrency.symbol}</span>
              </div>
              <Input
                id="minPrice"
                type="number"
                value={productData.price?.minAmount || ''}
                onChange={(e) => updateProductData('price.minAmount', Number(e.target.value))}
                placeholder="0"
                className="flex-1"
                min="0"
              />
              <Select 
                value={productData.price.currency} 
                onValueChange={(value) => updateProductData('price.currency', value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-muted-foreground">
              Set a minimum amount customers must pay. Leave empty for no minimum.
            </p>
          </div>
        </div>
      )}

      {/* Advanced Settings */}
      <div>
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 p-0 h-auto text-primary"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          Advanced Settings
          {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        {showAdvanced && (
          <div className="space-y-6 mt-4">
          {/* Limit Quantity */}
          <div className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium">Limit Quantity</h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Limit total number of purchases?</p>
                  <p className="text-sm text-muted-foreground">
                    Set a maximum limit on total stock available
                  </p>
                </div>
                <Switch
                  checked={productData.limitQuantity}
                  onCheckedChange={(checked) => updateProductData('limitQuantity', checked)}
                />
              </div>
            </div>

            {productData.limitQuantity && (
              <div className="space-y-2 ml-4">
                <Label htmlFor="quantityLimit">Quantity Limit</Label>
                <Input
                  id="quantityLimit"
                  type="number"
                  value={productData.quantityLimit || ''}
                  onChange={(e) => updateProductData('quantityLimit', Number(e.target.value))}
                  placeholder="100"
                  className="w-32"
                />
              </div>
            )}
          </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PricingOptions