import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Badge } from '../../components/ui/badge'
import { Separator } from '../../components/ui/separator'
import { ShoppingCart, CreditCard, Shield, ArrowLeft, Percent } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { SimpleThemeToggle } from '../../components/ui/theme-toggle'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5005/api'

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export function CheckoutPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    mobile: '',
    country: 'India',
    businessGstId: '',
    discountCode: ''
  })
  
  const [tipPercentage, setTipPercentage] = useState(0)
  const [customTip, setCustomTip] = useState('')
  const [discountApplied, setDiscountApplied] = useState(null)
  
  useEffect(() => {
    fetchProduct()
    loadRazorpayScript()
  }, [productId])
  
  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/products/${productId}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Product not found')
      }
      
      setProduct(data.product)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  const applyDiscount = async () => {
    if (!formData.discountCode.trim()) {
      toast.error('Please enter a discount code')
      return
    }
    
    try {
      // Validate discount code (you would implement this API endpoint)
      const discountValid = product.validateDiscountCode?.(formData.discountCode)
      if (discountValid) {
        setDiscountApplied(discountValid)
        toast.success('Discount applied successfully!')
      } else {
        toast.error('Invalid discount code')
      }
    } catch (error) {
      toast.error('Failed to apply discount code')
    }
  }
  
  const calculateTotal = () => {
    let subtotal = product?.price?.amount || 0
    let discount = 0
    
    if (discountApplied) {
      if (discountApplied.type === 'percentage') {
        discount = subtotal * (discountApplied.value / 100)
      } else {
        discount = discountApplied.value
      }
    }
    
    const finalAmount = subtotal - discount
    
    let tip = 0
    if (tipPercentage > 0) {
      tip = finalAmount * (tipPercentage / 100)
    } else if (customTip) {
      tip = parseFloat(customTip) || 0
    }
    
    return {
      subtotal,
      discount,
      tip,
      total: finalAmount + tip
    }
  }
  
  const handlePayment = async () => {
    // Validate form
    if (!formData.email || !formData.fullName || !formData.mobile) {
      toast.error('Please fill in all required fields (Name, Email, and Contact Number)')
      return
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return
    }
    
    // Validate mobile format (basic validation for 10 digits)
    const mobileRegex = /^[0-9]{10}$/
    if (!mobileRegex.test(formData.mobile.replace(/\D/g, '').slice(-10))) {
      toast.error('Please enter a valid 10-digit mobile number')
      return
    }
    
    setProcessing(true)
    
    try {
      const totalAmount = calculateTotal().total
      
      // Handle free products differently
      if (totalAmount === 0) {
        // For free products, create purchase directly without payment
        const freeOrderResponse = await fetch(`${API_BASE_URL}/payments/free-purchase`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            productId,
            buyerInfo: {
              name: formData.fullName,
              email: formData.email,
              mobile: formData.mobile,
              country: formData.country,
              businessGstId: formData.businessGstId
            },
            discountCode: formData.discountCode || undefined
          })
        })
        
        const freeOrderData = await freeOrderResponse.json()
        
        if (!freeOrderResponse.ok) {
          throw new Error(freeOrderData.message || 'Failed to create free purchase')
        }
        
        // Redirect to thank you page for free product
        navigate(`/thank-you/${freeOrderData.purchaseId}`, {
          state: {
            purchaseId: freeOrderData.purchaseId,
            product: product,
            amount: 0,
            isFree: true
          }
        })
        
        return
      }
      
      // Create order for paid products
      const orderResponse = await fetch(`${API_BASE_URL}/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId,
          buyerInfo: {
            name: formData.fullName,
            email: formData.email,
            mobile: formData.mobile,
            country: formData.country,
            businessGstId: formData.businessGstId
          },
          discountCode: formData.discountCode || undefined,
          tip: calculateTotal().tip
        })
      })
      
      const orderData = await orderResponse.json()
      
      if (!orderResponse.ok) {
        throw new Error(orderData.message || 'Failed to create order')
      }
      
      // Configure Razorpay options
      const options = {
        key: orderData.key,
        amount: Math.round(calculateTotal().total * 100),
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: 'Superlinks',
        description: product.title,
        image: product.images?.cover?.url,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.mobile
        },
        theme: {
          color: '#3B82F6'
        },
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await fetch(`${API_BASE_URL}/payments/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                purchaseId: orderData.purchaseId
              })
            })
            
            const verifyData = await verifyResponse.json()
            
            if (verifyResponse.ok) {
              // Redirect to thank you page
              navigate(`/thank-you/${orderData.purchaseId}`, {
                state: {
                  purchaseId: orderData.purchaseId,
                  product: product,
                  amount: calculateTotal().total
                }
              })
            } else {
              throw new Error(verifyData.message || 'Payment verification failed')
            }
          } catch (error) {
            console.error('Payment verification error:', error)
            toast.error('Payment verification failed. Please contact support.')
          }
        },
        modal: {
          ondismiss: function() {
            setProcessing(false)
            toast.error('Payment cancelled')
          }
        }
      }
      
      const rzp = new window.Razorpay(options)
      rzp.open()
      
    } catch (error) {
      console.error('Payment error:', error)
      toast.error(error.message || 'Payment failed')
      setProcessing(false)
    }
  }
  
  const formatCurrency = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading checkout...</p>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => navigate('/')} variant="outline">
            Go Home
          </Button>
        </div>
      </div>
    )
  }
  
  if (!product) {
    return null
  }
  
  const totals = calculateTotal()
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold">
                Superlinks
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <SimpleThemeToggle />
              <Button variant="outline" onClick={() => navigate(-1)}>
                Continue shopping
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Summary */}
          <div className="space-y-6">
            {/* Product Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex-shrink-0 overflow-hidden">
                    {product.images?.cover?.url ? (
                      <img
                        src={product.images.cover.url}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white font-bold">
                        {product.title.charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{product.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">by {product.creator?.name}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Qty: 1</span>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">Configure</Button>
                        <Button variant="ghost" size="sm">Remove</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatCurrency(product.price.amount, product.price.currency)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Order Summary */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(totals.subtotal, product.price.currency)}</span>
                  </div>
                  
                  {discountApplied && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({discountApplied.code})</span>
                      <span>-{formatCurrency(totals.discount, product.price.currency)}</span>
                    </div>
                  )}
                  
                  {totals.tip > 0 && (
                    <div className="flex justify-between">
                      <span>Tip</span>
                      <span>{formatCurrency(totals.tip, product.price.currency)}</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(totals.total, product.price.currency)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Checkout Form */}
          <div className="space-y-6">
            {/* Test Purchase Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">ℹ</span>
                </div>
                <div>
                  <p className="text-sm text-blue-800">
                    This will be a test purchase as you are the creator of at least one of the products. 
                    Your payment method will not be charged.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="Australia">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="businessGstId">Business GST ID (optional)</Label>
                  <Input
                    id="businessGstId"
                    value={formData.businessGstId}
                    onChange={(e) => handleInputChange('businessGstId', e.target.value)}
                    placeholder="Business GST ID (optional)"
                  />
                </div>
                
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Full Name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="mobile">Mobile *</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    placeholder="Contact Number"
                    required
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Discount Code */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Label>Discount Code</Label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.discountCode}
                      onChange={(e) => handleInputChange('discountCode', e.target.value)}
                      placeholder="Enter discount code"
                    />
                    <Button variant="outline" onClick={applyDiscount}>
                      Apply
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Add a Tip */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="h-5 w-5" />
                  Add a tip
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 10, 20].map((percentage) => (
                      <Button
                        key={percentage}
                        variant={tipPercentage === percentage ? "default" : "outline"}
                        onClick={() => {
                          setTipPercentage(percentage)
                          setCustomTip('')
                        }}
                        className="h-12"
                      >
                        {percentage}%
                      </Button>
                    ))}
                    <Button
                      variant={customTip ? "default" : "outline"}
                      onClick={() => {
                        setTipPercentage(0)
                        setCustomTip('1')
                      }}
                      className="h-12"
                    >
                      Other
                    </Button>
                  </div>
                  
                  {customTip !== '' && (
                    <Input
                      type="number"
                      value={customTip}
                      onChange={(e) => setCustomTip(e.target.value)}
                      placeholder="Enter custom tip amount"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Payment Button */}
            <Button 
              onClick={handlePayment}
              disabled={processing || !formData.email || !formData.fullName || !formData.mobile}
              className="w-full h-12 text-lg font-semibold"
              size="lg"
            >
              {processing ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {totals.total === 0 ? 'Processing...' : 'Processing Payment...'}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {totals.total === 0 ? (
                    <>
                      <ShoppingCart className="h-5 w-5" />
                      Get Free Product
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5" />
                      Pay {formatCurrency(totals.total, product.price.currency)}
                    </>
                  )}
                </div>
              )}
            </Button>
            
            {/* Security Notice */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Secured by Razorpay</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}