import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Checkbox } from '../../components/ui/checkbox'
import { Badge } from '../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Separator } from '../../components/ui/separator'
import { Switch } from '../../components/ui/switch'
import { 
  Upload, X, Plus, DollarSign, Tag, Image, FileText, Settings, 
  ArrowLeft, ArrowRight, Edit3, Eye, Smartphone, Monitor,
  Images, MessageCircle, HelpCircle, User, Package,
  Link as LinkIcon, Palette, CreditCard, Shield, BarChart3
} from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import productService from '../../services/productService'
import RichTextEditor from '../../components/editor/RichTextEditorSimple'
import { dashboardColors } from '../../lib/dashboardColors'

// Import sub-components
import CoverImageUpload from '../../components/product-creation/CoverImageUpload'
import OptionalSectionCard from '../../components/product-creation/OptionalSectionCard'
import FileUploadArea from '../../components/product-creation/FileUploadArea'
import PricingOptions from '../../components/product-creation/PricingOptions'
import ThemeSelector from '../../components/product-creation/ThemeSelector'
import CheckoutExperienceSettings from '../../components/product-creation/CheckoutExperienceSettings'
import BoostSalesSettings from '../../components/product-creation/BoostSalesSettings'
import PoliciesSettings from '../../components/product-creation/PoliciesSettings'
import AdvancedFeatures from '../../components/product-creation/AdvancedFeatures'
import LivePreview from '../../components/product-creation/LivePreview'

const PRODUCT_CATEGORIES = [
  { value: 'ebook', label: 'Ebook' },
  { value: 'course', label: 'Video Course' },
  { value: 'template', label: 'Notion Template' },
  { value: 'art', label: 'Digital Art / Presets' },
  { value: 'toolkit', label: 'PDF / Docs / Toolkit' },
  { value: 'audio', label: 'Audio' },
  { value: 'software', label: 'Software' },
  { value: 'other', label: 'Other' }
]

const THEMES = [
  { value: 'default', label: 'Default', preview: '/theme-default.png' },
  { value: 'dawn', label: 'Dawn', preview: '/theme-dawn.png' },
  { value: 'dusk', label: 'Dusk', preview: '/theme-dusk.png' }
]

export function CreateProductPageNew() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)
  const [activeTab, setActiveTab] = useState('page-details')
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState('desktop') // 'desktop' | 'mobile'

  // Product data state
  const [productData, setProductData] = useState({
    // Page Details
    title: '',
    description: '',
    coverImage: null,
    buttonText: 'Get it now',
    
    // Optional sections
    optionalSections: {
      gallery: false,
      testimonials: false,
      faq: false,
      aboutMe: false,
      showcaseProducts: false
    },
    
    // Payment Page Details
    files: [],
    resourceLinks: [],
    pricingType: 'fixed', // 'fixed' | 'customer-decides'
    price: { amount: 100, currency: 'INR' },
    offerDiscount: false,
    discountPrice: null,
    limitQuantity: false,
    quantityLimit: null,
    
    // Advanced Settings
    theme: 'default',
    checkoutExperience: 'next-page',
    customerInfo: {
      emailVerification: true,
      phoneNumber: false,
      phoneVerification: false,
      additionalQuestions: []
    },
    boostSales: {
      bumpOffer: false,
      automatedEmail: false,
      discountCoupons: false
    },
    policies: {
      termsConditions: '',
      refundPolicy: '',
      privacyPolicy: ''
    },
    customUrl: '',
    postPurchaseBehavior: 'download',
    tracking: {
      metaPixel: '',
      googleAnalytics: ''
    }
  })

  // Handle form data updates
  const updateProductData = (path, value) => {
    setProductData(prev => {
      const newData = { ...prev }
      const pathArray = path.split('.')
      let current = newData
      
      for (let i = 0; i < pathArray.length - 1; i++) {
        current = current[pathArray[i]]
      }
      
      current[pathArray[pathArray.length - 1]] = value
      return newData
    })
  }

  // Load existing product data if editing
  useEffect(() => {
    if (isEditing) {
      loadProductData()
    }
  }, [id, isEditing])

  const loadProductData = async () => {
    try {
      setLoading(true)
      const response = await productService.getProduct(id)
      // Map response data to our new structure
      setProductData(prev => ({
        ...prev,
        ...response.product
      }))
    } catch (error) {
      toast.error('Failed to load product data')
      console.error('Error loading product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      
      if (isEditing) {
        await productService.updateProduct(id, productData)
        toast.success('Product updated successfully!')
      } else {
        const response = await productService.createProduct(productData)
        toast.success('Product created successfully!')
        navigate(`/dashboard/products/${response.product._id}/edit`)
      }
    } catch (error) {
      toast.error('Failed to save product')
      console.error('Error saving product:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard/products')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <h1 className="font-semibold text-lg">
              {isEditing ? productData.title || 'Edit Product' : 'Create New Product'}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" disabled={saving}>
              Save Draft
            </Button>
            <Button onClick={handleSave} disabled={saving} size="sm">
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Left Panel - Form Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="page-details" className="flex items-center gap-2">
                  <Edit3 className="h-4 w-4" />
                  Page Details
                </TabsTrigger>
                <TabsTrigger value="payment-details" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Payment Page Details
                </TabsTrigger>
                <TabsTrigger value="advanced-settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Advanced Settings
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="page-details" className="space-y-6">
                  <PageDetailsTab 
                    productData={productData} 
                    updateProductData={updateProductData}
                  />
                </TabsContent>

                <TabsContent value="payment-details" className="space-y-6">
                  <PaymentDetailsTab 
                    productData={productData} 
                    updateProductData={updateProductData}
                  />
                </TabsContent>

                <TabsContent value="advanced-settings" className="space-y-6">
                  <AdvancedSettingsTab 
                    productData={productData} 
                    updateProductData={updateProductData}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Right Panel - Live Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Preview</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={previewMode === 'desktop' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPreviewMode('desktop')}
                      >
                        <Monitor className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={previewMode === 'mobile' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPreviewMode('mobile')}
                      >
                        <Smartphone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <LivePreview 
                    productData={productData} 
                    previewMode={previewMode}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Page Details Tab Component
function PageDetailsTab({ productData, updateProductData }) {
  return (
    <div className="space-y-8">
      {/* Product Information */}
      <Card>
        <CardHeader>
          <CardTitle>Tell us about your Product</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Product Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Product Title *</Label>
            <div className="relative">
              <Input
                id="title"
                value={productData.title}
                onChange={(e) => updateProductData('title', e.target.value)}
                placeholder="Your Product Title Here"
                maxLength={75}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                {productData.title.length}/75
              </span>
            </div>
          </div>

          {/* Cover Image/Video */}
          <div className="space-y-2">
            <Label>Cover Image/Video *</Label>
            <CoverImageUpload 
              image={productData.coverImage}
              onImageChange={(image) => updateProductData('coverImage', image)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description *</Label>
            <RichTextEditor
              value={productData.description}
              onChange={(value) => updateProductData('description', value)}
              placeholder="Describe your product to let customers know what to expect. Include highlights like the purpose, key activities, or notable features. Make it engaging and informative to generate interest and excitement."
            />
          </div>

          {/* Button Text */}
          <div className="space-y-2">
            <Label htmlFor="buttonText">Button Text *</Label>
            <div className="relative">
              <Input
                id="buttonText"
                value={productData.buttonText}
                onChange={(e) => updateProductData('buttonText', e.target.value)}
                placeholder="Get it now"
                maxLength={25}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                {productData.buttonText.length}/25
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optional Sections */}
      <Card>
        <CardHeader>
          <CardTitle>Optional Sections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <OptionalSectionCard
              icon={Images}
              title="Gallery"
              enabled={productData.optionalSections.gallery}
              onToggle={(enabled) => updateProductData('optionalSections.gallery', enabled)}
            />
            <OptionalSectionCard
              icon={MessageCircle}
              title="Testimonials"
              enabled={productData.optionalSections.testimonials}
              onToggle={(enabled) => updateProductData('optionalSections.testimonials', enabled)}
            />
            <OptionalSectionCard
              icon={HelpCircle}
              title="FAQ"
              enabled={productData.optionalSections.faq}
              onToggle={(enabled) => updateProductData('optionalSections.faq', enabled)}
            />
            <OptionalSectionCard
              icon={User}
              title="About Me"
              enabled={productData.optionalSections.aboutMe}
              onToggle={(enabled) => updateProductData('optionalSections.aboutMe', enabled)}
            />
            <OptionalSectionCard
              icon={Package}
              title="Showcase Products"
              enabled={productData.optionalSections.showcaseProducts}
              onToggle={(enabled) => updateProductData('optionalSections.showcaseProducts', enabled)}
              className="col-span-2"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Payment Details Tab Component  
function PaymentDetailsTab({ productData, updateProductData }) {
  return (
    <div className="space-y-8">
      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload your digital files</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUploadArea 
            files={productData.files}
            onFilesChange={(files) => updateProductData('files', files)}
            resourceLinks={productData.resourceLinks}
            onResourceLinksChange={(links) => updateProductData('resourceLinks', links)}
          />
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <PricingOptions 
            productData={productData}
            updateProductData={updateProductData}
          />
        </CardContent>
      </Card>
    </div>
  )
}

// Advanced Settings Tab Component
function AdvancedSettingsTab({ productData, updateProductData }) {
  return (
    <div className="space-y-8">
      {/* Theme and Styling */}
      <Card>
        <CardHeader>
          <CardTitle>Theme and Styling</CardTitle>
        </CardHeader>
        <CardContent>
          <ThemeSelector 
            selectedTheme={productData.theme}
            onThemeChange={(theme) => updateProductData('theme', theme)}
          />
        </CardContent>
      </Card>

      {/* Checkout Experience */}
      <Card>
        <CardHeader>
          <CardTitle>Checkout Experience</CardTitle>
        </CardHeader>
        <CardContent>
          <CheckoutExperienceSettings 
            productData={productData}
            updateProductData={updateProductData}
          />
        </CardContent>
      </Card>

      {/* Boost Sales */}
      <Card>
        <CardHeader>
          <CardTitle>Boost Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <BoostSalesSettings 
            productData={productData}
            updateProductData={updateProductData}
          />
        </CardContent>
      </Card>

      {/* Terms and Policies */}
      <Card>
        <CardHeader>
          <CardTitle>Terms and Policies</CardTitle>
        </CardHeader>
        <CardContent>
          <PoliciesSettings 
            productData={productData}
            updateProductData={updateProductData}
          />
        </CardContent>
      </Card>

      {/* Advanced Features */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Features</CardTitle>
        </CardHeader>
        <CardContent>
          <AdvancedFeatures 
            productData={productData}
            updateProductData={updateProductData}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateProductPageNew