import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Alert, AlertDescription } from '../../components/ui/alert'
import { Badge } from '../../components/ui/badge'
import { 
  CreditCard, 
  Building, 
  CheckCircle, 
  AlertCircle, 
  Save,
  Edit,
  Trash2
} from 'lucide-react'
import toast from 'react-hot-toast'

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005/api'

export function PaymentSettingsPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [bankAccount, setBankAccount] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    accountHolderName: '',
    accountNumber: '',
    routingNumber: '',
    ifscCode: '',
    bankName: '',
    accountType: '',
    country: 'IN', // Changed default to India
    currency: 'INR' // Changed default to INR
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchBankAccounts()
  }, [])

  const fetchBankAccounts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_BASE_URL}/payments/bank-accounts`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      const data = await response.json()
      
      if (response.ok) {
        if (data.bankAccounts.length > 0) {
          // Set the primary account or first account as the active one
          const primaryAccount = data.bankAccounts.find(acc => acc.isPrimary) || data.bankAccounts[0]
          setBankAccount(primaryAccount)
          setIsConnected(true)
        }
      } else {
        console.error('Failed to fetch bank accounts:', data.message)
      }
    } catch (error) {
      console.error('Error fetching bank accounts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.accountHolderName.trim()) {
      newErrors.accountHolderName = 'Account holder name is required'
    }
    
    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required'
    } else if (formData.accountNumber.length < 8) {
      newErrors.accountNumber = 'Account number must be at least 8 digits'
    }
    
    if (!formData.bankName.trim()) {
      newErrors.bankName = 'Bank name is required'
    }
    
    if (!formData.accountType) {
      newErrors.accountType = 'Account type is required'
    }
    
    // Country-specific validation
    if (formData.country === 'US') {
      if (!formData.routingNumber.trim()) {
        newErrors.routingNumber = 'Routing number is required for US accounts'
      } else if (formData.routingNumber.length !== 9) {
        newErrors.routingNumber = 'Routing number must be 9 digits'
      }
    } else if (formData.country === 'IN') {
      if (!formData.ifscCode.trim()) {
        newErrors.ifscCode = 'IFSC code is required for Indian accounts'
      } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)) {
        newErrors.ifscCode = 'IFSC code must be in format: ABCD0123456'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the validation errors')
      return
    }

    setIsSubmitting(true)
    
    try {
      const url = bankAccount 
        ? `${API_BASE_URL}/payments/bank-accounts/${bankAccount._id}`
        : `${API_BASE_URL}/payments/bank-accounts`
      
      const method = bankAccount ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setBankAccount(data.bankAccount)
        setIsConnected(true)
        setShowForm(false)
        
        toast.success(bankAccount 
          ? 'Bank account updated successfully!' 
          : 'Bank account connected successfully!'
        )
      } else {
        toast.error(data.message || 'Failed to save bank account')
      }
      
    } catch (error) {
      console.error('Error saving bank account:', error)
      toast.error('Failed to save bank account')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDisconnect = async () => {
    if (window.confirm('Are you sure you want to disconnect your bank account?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/payments/bank-accounts/${bankAccount._id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        
        const data = await response.json()
        
        if (response.ok) {
          setBankAccount(null)
          setIsConnected(false)
          setFormData({
            accountHolderName: '',
            accountNumber: '',
            routingNumber: '',
            ifscCode: '',
            bankName: '',
            accountType: '',
            country: 'IN', // Changed default to India
            currency: 'INR' // Changed default to INR
          })
          toast.success('Bank account disconnected successfully')
        } else {
          toast.error(data.message || 'Failed to disconnect bank account')
        }
      } catch (error) {
        console.error('Error disconnecting bank account:', error)
        toast.error('Failed to disconnect bank account')
      }
    }
  }

  const handleEdit = () => {
    setFormData({
      accountHolderName: bankAccount.accountHolderName,
      accountNumber: '', // Reset account number for security
      routingNumber: '', // Reset routing number for security
      ifscCode: '', // Reset IFSC code for security
      bankName: bankAccount.bankName,
      accountType: bankAccount.accountType,
      country: bankAccount.country,
      currency: bankAccount.currency
    })
    setShowForm(true)
  }


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading payment settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Payment Settings</h1>
        <p className="text-muted-foreground">
          Configure your payment methods and bank account details to receive payments
        </p>
      </div>

      {/* Bank Account Status */}
      {isConnected && bankAccount && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Connected Bank Account
            </CardTitle>
            <CardDescription>Your bank account is connected and ready to receive payments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Account Holder</Label>
                <p className="text-sm text-muted-foreground">{bankAccount.accountHolderName}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Bank Name</Label>
                <p className="text-sm text-muted-foreground">{bankAccount.bankName}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Account Number</Label>
                <p className="text-sm text-muted-foreground">{bankAccount.accountNumberMasked}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Account Type</Label>
                <p className="text-sm text-muted-foreground capitalize">{bankAccount.accountType}</p>
              </div>
              {bankAccount.country === 'IN' && bankAccount.ifscCode && (
                <div>
                  <Label className="text-sm font-medium">IFSC Code</Label>
                  <p className="text-sm text-muted-foreground">{bankAccount.ifscCode}</p>
                </div>
              )}
              {bankAccount.country === 'US' && bankAccount.routingNumber && (
                <div>
                  <Label className="text-sm font-medium">Routing Number</Label>
                  <p className="text-sm text-muted-foreground">{bankAccount.routingNumber}</p>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </Badge>
              <span className="text-xs text-muted-foreground">
                Connected on {new Date(bankAccount.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" onClick={handleDisconnect}>
                <Trash2 className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connect Bank Account Form */}
      {(!isConnected || showForm) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              {isConnected ? 'Update Bank Account' : 'Connect Bank Account'}
            </CardTitle>
            <CardDescription>
              {isConnected 
                ? 'Update your bank account information' 
                : 'Connect your bank account to receive payments from your sales'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isConnected && (
              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Your bank account information is encrypted and secure. We use industry-standard security measures to protect your data.
                </AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accountHolderName">Account Holder Name *</Label>
                  <Input
                    id="accountHolderName"
                    value={formData.accountHolderName}
                    onChange={(e) => setFormData(prev => ({ ...prev, accountHolderName: e.target.value }))}
                    placeholder="John Doe"
                    className={errors.accountHolderName ? 'border-red-500' : ''}
                  />
                  {errors.accountHolderName && (
                    <p className="text-sm text-red-500">{errors.accountHolderName}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name *</Label>
                  <Input
                    id="bankName"
                    value={formData.bankName}
                    onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                    placeholder="Chase Bank"
                    className={errors.bankName ? 'border-red-500' : ''}
                  />
                  {errors.bankName && (
                    <p className="text-sm text-red-500">{errors.bankName}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number *</Label>
                  <Input
                    id="accountNumber"
                    type="password"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                    placeholder="Enter account number"
                    className={errors.accountNumber ? 'border-red-500' : ''}
                  />
                  {errors.accountNumber && (
                    <p className="text-sm text-red-500">{errors.accountNumber}</p>
                  )}
                </div>
                
                {formData.country === 'US' && (
                  <div className="space-y-2">
                    <Label htmlFor="routingNumber">Routing Number *</Label>
                    <Input
                      id="routingNumber"
                      value={formData.routingNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, routingNumber: e.target.value }))}
                      placeholder="123456789"
                      maxLength={9}
                      className={errors.routingNumber ? 'border-red-500' : ''}
                    />
                    {errors.routingNumber && (
                      <p className="text-sm text-red-500">{errors.routingNumber}</p>
                    )}
                  </div>
                )}
                
                {formData.country === 'IN' && (
                  <div className="space-y-2">
                    <Label htmlFor="ifscCode">IFSC Code *</Label>
                    <Input
                      id="ifscCode"
                      value={formData.ifscCode}
                      onChange={(e) => setFormData(prev => ({ ...prev, ifscCode: e.target.value.toUpperCase() }))}
                      placeholder="ABCD0123456"
                      maxLength={11}
                      className={errors.ifscCode ? 'border-red-500' : ''}
                    />
                    {errors.ifscCode && (
                      <p className="text-sm text-red-500">{errors.ifscCode}</p>
                    )}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accountType">Account Type *</Label>
                  <Select value={formData.accountType} onValueChange={(value) => setFormData(prev => ({ ...prev, accountType: value }))}>
                    <SelectTrigger className={errors.accountType ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.country === 'US' && (
                        <>
                          <SelectItem value="checking">Checking</SelectItem>
                          <SelectItem value="savings">Savings</SelectItem>
                        </>
                      )}
                      {formData.country === 'IN' && (
                        <>
                          <SelectItem value="savings">Savings</SelectItem>
                          <SelectItem value="current">Current</SelectItem>
                          <SelectItem value="salary">Salary</SelectItem>
                        </>
                      )}
                      {formData.country !== 'US' && formData.country !== 'IN' && (
                        <>
                          <SelectItem value="checking">Checking</SelectItem>
                          <SelectItem value="savings">Savings</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  {errors.accountType && (
                    <p className="text-sm text-red-500">{errors.accountType}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select value={formData.country} onValueChange={(value) => {
                    // Auto-update currency and reset account type when country changes
                    let newCurrency = value === 'IN' ? 'INR' : value === 'US' ? 'USD' : value === 'CA' ? 'CAD' : 'GBP'
                    setFormData(prev => ({ 
                      ...prev, 
                      country: value,
                      currency: newCurrency,
                      accountType: '' // Reset account type when country changes
                    }))
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IN">India</SelectItem>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="GB">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="CAD">CAD (C$)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Save className="h-4 w-4 mr-2 animate-spin" />
                      {isConnected ? 'Updating...' : 'Connecting...'}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {isConnected ? 'Update Account' : 'Connect Account'}
                    </>
                  )}
                </Button>
                
                {showForm && (
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Payment Methods Coming Soon */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Methods
          </CardTitle>
          <CardDescription>Additional payment methods and integrations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">Additional payment methods coming soon</p>
            <p className="text-sm text-muted-foreground">
              We're working on integrating more payment processors like Stripe, PayPal, and others.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}