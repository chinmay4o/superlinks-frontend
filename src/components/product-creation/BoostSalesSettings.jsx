import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Switch } from '../ui/switch'
import { Badge } from '../ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Plus, X, Gift, Mail, Percent, Upload } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'

const CURRENCIES = [
  { value: 'INR', label: '₹ INR', symbol: '₹' },
  { value: 'USD', label: '$ USD', symbol: '$' },
  { value: 'EUR', label: '€ EUR', symbol: '€' },
  { value: 'GBP', label: '£ GBP', symbol: '£' }
]

export function BoostSalesSettings({ productData, updateProductData }) {
  const [bumpOfferModal, setBumpOfferModal] = useState(false)
  const [emailModal, setEmailModal] = useState(false)
  const [couponModal, setCouponModal] = useState(false)
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'percentage',
    value: '',
    expiryDate: '',
    usageLimit: '',
    description: ''
  })

  const handleBumpOfferSave = () => {
    updateProductData('boostSales.bumpOffer', true)
    setBumpOfferModal(false)
  }

  const addCoupon = () => {
    if (!newCoupon.code || !newCoupon.value) return
    
    const coupon = {
      id: Date.now(),
      ...newCoupon,
      createdDate: new Date().toISOString()
    }
    
    const currentCoupons = productData.boostSales.discountCouponsData || []
    updateProductData('boostSales.discountCouponsData', [...currentCoupons, coupon])
    updateProductData('boostSales.discountCoupons', true)
    
    setNewCoupon({
      code: '',
      type: 'percentage',
      value: '',
      expiryDate: '',
      usageLimit: '',
      description: ''
    })
    setCouponModal(false)
  }

  const removeCoupon = (couponId) => {
    const currentCoupons = productData.boostSales.discountCouponsData || []
    updateProductData('boostSales.discountCouponsData', currentCoupons.filter(c => c.id !== couponId))
  }

  return (
    <div className="space-y-6">
      {/* Bump Offer */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Gift className="h-4 w-4 text-purple-500" />
              <div>
                <div className="font-medium">Bump Offer</div>
                <div className="text-sm text-muted-foreground">
                  Offer add-on product during checkout
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {productData.boostSales.bumpOffer && (
                <Badge variant="default" className="text-xs">Active</Badge>
              )}
              <Dialog open={bumpOfferModal} onOpenChange={setBumpOfferModal}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    {productData.boostSales.bumpOffer ? 'Edit' : 'Setup'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Setup Bump Offer</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bumpTitle">Offer Title *</Label>
                      <Input
                        id="bumpTitle"
                        value={productData.boostSales.bumpOfferData.title}
                        onChange={(e) => updateProductData('boostSales.bumpOfferData.title', e.target.value)}
                        placeholder="Bonus Course: Advanced Tips & Tricks"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bumpDescription">Description *</Label>
                      <Textarea
                        id="bumpDescription"
                        value={productData.boostSales.bumpOfferData.description}
                        onChange={(e) => updateProductData('boostSales.bumpOfferData.description', e.target.value)}
                        placeholder="Get my exclusive bonus content that normally sells for ₹100..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Offer Price *</Label>
                        <div className="flex gap-2">
                          <div className="flex items-center bg-muted rounded-md px-3">
                            <span className="text-sm font-medium">
                              {CURRENCIES.find(c => c.value === productData.boostSales.bumpOfferData.price.currency)?.symbol || '₹'}
                            </span>
                          </div>
                          <Input
                            type="number"
                            value={productData.boostSales.bumpOfferData.price.amount}
                            onChange={(e) => updateProductData('boostSales.bumpOfferData.price.amount', Number(e.target.value))}
                            placeholder="50"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Regular Price (Optional)</Label>
                        <div className="flex gap-2">
                          <div className="flex items-center bg-muted rounded-md px-3">
                            <span className="text-sm font-medium">
                              {CURRENCIES.find(c => c.value === productData.boostSales.bumpOfferData.originalPrice.currency)?.symbol || '₹'}
                            </span>
                          </div>
                          <Input
                            type="number"
                            value={productData.boostSales.bumpOfferData.originalPrice.amount}
                            onChange={(e) => updateProductData('boostSales.bumpOfferData.originalPrice.amount', Number(e.target.value))}
                            placeholder="100"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setBumpOfferModal(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleBumpOfferSave}>
                        Save Bump Offer
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Switch
                checked={productData.boostSales.bumpOffer}
                onCheckedChange={(checked) => updateProductData('boostSales.bumpOffer', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Automation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-blue-500" />
              <div>
                <div className="font-medium">Automated Email</div>
                <div className="text-sm text-muted-foreground">
                  Send automated emails to customers
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {productData.boostSales.automatedEmail && (
                <Badge variant="default" className="text-xs">Active</Badge>
              )}
              <Button variant="outline" size="sm">
                {productData.boostSales.automatedEmail ? 'Edit' : 'Setup'}
              </Button>
              <Switch
                checked={productData.boostSales.automatedEmail}
                onCheckedChange={(checked) => updateProductData('boostSales.automatedEmail', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Discount Coupons */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Percent className="h-4 w-4 text-green-500" />
                <div>
                  <div className="font-medium">Discount Coupons</div>
                  <div className="text-sm text-muted-foreground">
                    Create coupon codes for discounts
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {productData.boostSales.discountCoupons && (
                  <Badge variant="default" className="text-xs">
                    {productData.boostSales.discountCouponsData?.length || 0} Active
                  </Badge>
                )}
                <Dialog open={couponModal} onOpenChange={setCouponModal}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Coupon
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Discount Coupon</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="couponCode">Coupon Code *</Label>
                          <Input
                            id="couponCode"
                            value={newCoupon.code}
                            onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                            placeholder="SAVE20"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="discountType">Discount Type</Label>
                          <Select value={newCoupon.type} onValueChange={(value) => setNewCoupon({...newCoupon, type: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="percentage">Percentage</SelectItem>
                              <SelectItem value="fixed">Fixed Amount</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="discountValue">
                            {newCoupon.type === 'percentage' ? 'Percentage (%)' : 'Amount'} *
                          </Label>
                          <Input
                            id="discountValue"
                            type="number"
                            value={newCoupon.value}
                            onChange={(e) => setNewCoupon({...newCoupon, value: e.target.value})}
                            placeholder={newCoupon.type === 'percentage' ? '20' : '100'}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="usageLimit">Usage Limit</Label>
                          <Input
                            id="usageLimit"
                            type="number"
                            value={newCoupon.usageLimit}
                            onChange={(e) => setNewCoupon({...newCoupon, usageLimit: e.target.value})}
                            placeholder="100"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                        <Input
                          id="expiryDate"
                          type="date"
                          value={newCoupon.expiryDate}
                          onChange={(e) => setNewCoupon({...newCoupon, expiryDate: e.target.value})}
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setCouponModal(false)}>
                          Cancel
                        </Button>
                        <Button onClick={addCoupon}>
                          Create Coupon
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Switch
                  checked={productData.boostSales.discountCoupons}
                  onCheckedChange={(checked) => updateProductData('boostSales.discountCoupons', checked)}
                />
              </div>
            </div>

            {/* Coupons List */}
            {productData.boostSales.discountCouponsData?.length > 0 && (
              <div className="space-y-2">
                {productData.boostSales.discountCouponsData.map((coupon) => (
                  <div key={coupon.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-mono font-medium">{coupon.code}</div>
                      <div className="text-sm text-muted-foreground">
                        {coupon.type === 'percentage' ? `${coupon.value}% off` : `₹${coupon.value} off`}
                        {coupon.usageLimit && ` • ${coupon.usageLimit} uses`}
                        {coupon.expiryDate && ` • Expires ${new Date(coupon.expiryDate).toLocaleDateString()}`}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCoupon(coupon.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BoostSalesSettings