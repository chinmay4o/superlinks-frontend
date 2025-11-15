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
  Upload, X, Plus, DollarSign, Tag, Settings, 
  ArrowLeft, ArrowRight, Edit3, Eye, Smartphone, Monitor,
  MessageCircle, HelpCircle, User,
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
import TestimonialsEditor from '../../components/product-creation/TestimonialsEditor'
import FAQEditor from '../../components/product-creation/FAQEditor'
import AboutMeEditor from '../../components/product-creation/AboutMeEditor'

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
      testimonials: false,
      faq: false,
      aboutMe: false
    },
    
    // Optional sections data
    testimonialsData: [],
    faqData: [],
    aboutMeData: {
      title: '',
      content: '',
      name: '',
      role: '',
      company: '',
      profileImage: ''
    },
    
    // Payment Page Details
    files: [],
    resourceLinks: [],
    pricingType: 'fixed', // 'fixed' | 'customer-decides'
    price: { amount: 100, currency: 'INR', minAmount: null },
    offerDiscount: false,
    discountPrice: null,
    limitQuantity: false,
    quantityLimit: null,
    
    // Advanced Settings
    theme: 'default',
    checkoutExperience: 'next-page',
    customerInfo: {
      collectName: true,
      nameRequired: true,
      emailVerification: true,
      collectPhoneNumber: false,
      phoneVerification: false,
      additionalQuestions: []
    },
    boostSales: {
      bumpOffer: false,
      bumpOfferData: {
        title: '',
        description: '',
        price: { amount: 50, currency: 'INR' },
        originalPrice: { amount: 100, currency: 'INR' },
        files: []
      },
      automatedEmail: false,
      automatedEmailData: {
        subject: '',
        content: '',
        triggerEvent: 'purchase'
      },
      discountCoupons: false,
      discountCouponsData: []
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
      const backendData = response.product
      
      // Transform backend data structure to match frontend expectations
      const frontendData = {
        ...backendData,
        // Transform optional sections back to frontend format
        testimonialsData: backendData.optionalSections?.testimonialsData || [],
        faqData: backendData.optionalSections?.faqData || [],
        aboutMeData: backendData.optionalSections?.aboutMeData || {
          title: '',
          content: '',
          name: '',
          role: '',
          company: '',
          profileImage: ''
        },
        // Transform boost sales back to frontend format
        boostSales: {
          bumpOffer: backendData.bumpOffer?.enabled || false,
          bumpOfferData: {
            title: backendData.bumpOffer?.title || '',
            description: backendData.bumpOffer?.description || '',
            price: { 
              amount: backendData.bumpOffer?.price || 50, 
              currency: backendData.price?.currency || 'INR' 
            },
            originalPrice: { 
              amount: backendData.bumpOffer?.originalPrice || 100, 
              currency: backendData.price?.currency || 'INR' 
            },
            files: backendData.bumpOffer?.files || []
          },
          automatedEmail: backendData.emailAutomation?.enabled || false,
          automatedEmailData: {
            subject: backendData.emailAutomation?.subject || '',
            content: backendData.emailAutomation?.content || '',
            triggerEvent: backendData.emailAutomation?.triggerEvent || 'purchase'
          },
          discountCoupons: (backendData.enhancedCoupons && backendData.enhancedCoupons.length > 0) || false,
          discountCouponsData: backendData.enhancedCoupons || []
        },
        // Transform pricing back to frontend format
        pricingType: backendData.pricing?.type === 'pay-what-you-want' ? 'customer-decides' : 'fixed',
        price: {
          ...backendData.price,
          minAmount: backendData.pricing?.minAmount || null
        },
        // Transform advanced fields back to frontend format
        customUrl: backendData.advanced?.customUrl || '',
        postPurchaseBehavior: backendData.advanced?.postPurchaseBehavior || 'download',
        customRedirectUrl: backendData.advanced?.customRedirectUrl || '',
        // Ensure tracking exists
        tracking: backendData.tracking || {
          metaPixel: '',
          googleAnalytics: ''
        }
      }
      
      setProductData(frontendData)
    } catch (error) {
      toast.error('Failed to load product data')
      console.error('Error loading product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (isDraft = false) => {
    try {
      setSaving(true)
      
      // Transform frontend data structure to match backend expectations
      const transformedData = {
        ...productData,
        // Set draft status
        isDraft: isDraft,
        // Transform optional sections
        optionalSections: {
          testimonialsData: productData.testimonialsData || [],
          faqData: productData.faqData || [],
          aboutMeData: productData.aboutMeData || {}
        },
        // Transform boost sales to backend format
        bumpOffer: {
          enabled: productData.boostSales?.bumpOffer || false,
          ...productData.boostSales?.bumpOfferData
        },
        emailAutomation: {
          enabled: productData.boostSales?.automatedEmail || false,
          ...productData.boostSales?.automatedEmailData
        },
        enhancedCoupons: productData.boostSales?.discountCouponsData || [],
        // Transform pricing type from frontend to backend format
        pricing: {
          type: productData.pricingType === 'customer-decides' ? 'pay-what-you-want' : 'one-time',
          minAmount: productData.price?.minAmount || 0
        },
        // Transform tracking and advanced sections
        tracking: productData.tracking || {},
        advanced: {
          customUrl: productData.customUrl || '',
          postPurchaseBehavior: productData.postPurchaseBehavior || 'download',
          customRedirectUrl: productData.customRedirectUrl || ''
        }
      }
      
      // Remove frontend-specific fields that don't exist in backend
      delete transformedData.testimonialsData
      delete transformedData.faqData  
      delete transformedData.aboutMeData
      delete transformedData.boostSales
      delete transformedData.pricingType
      delete transformedData.customUrl
      delete transformedData.postPurchaseBehavior
      delete transformedData.customRedirectUrl
      
      if (isEditing) {
        await productService.updateProduct(id, transformedData)
        if (isDraft) {
          toast.success('Product saved as draft!')
        } else {
          toast.success('Product updated and published!')
        }
      } else {
        const response = await productService.createProduct(transformedData)
        if (isDraft) {
          toast.success('Product saved as draft!')
        } else {
          toast.success('Product created and published!')
        }
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
    <div className="min-h-screen bg-background product-creation-page">
      {/* Full Screen Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="px-6 flex h-16 items-center justify-between">
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
            {/* Buttons moved to left sidebar bottom */}
          </div>
        </div>
      </header>

      {/* Full Screen Main Content - 40/60 Split */}
      <div className="h-[calc(100vh-64px)] flex">
        {/* Left Panel - Form Content (40%) */}
        <div className="w-2/5 bg-background flex flex-col">
          <div className="flex-1 overflow-y-auto p-6">
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
          
          {/* Fixed Save Buttons at Bottom */}
          <div className="border-t bg-background p-6">
            <div className="flex items-center gap-3 justify-center">
              <Button 
                variant="outline" 
                disabled={saving} 
                onClick={() => handleSave(true)}
                className="h-11 w-[40%]"
              >
                {saving ? 'Saving...' : 'Save Draft'}
              </Button>
              <Button 
                onClick={() => handleSave(false)} 
                disabled={saving}
                className="h-11 w-[40%]"
              >
                {saving ? 'Saving...' : 'Publish Product'}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel - Live Preview (60%) */}
        <div className="w-3/5 border-l bg-gray-50">
          <div className="h-full flex flex-col">
            {/* Preview Header */}
            <div className="p-6 border-b bg-background">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Preview</h2>
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
            </div>

            {/* Preview Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              <LivePreview 
                productData={productData} 
                previewMode={previewMode}
              />
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
                {(productData.title || '').length}/75
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
                {(productData.buttonText || '').length}/25
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
              className="col-span-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Testimonials Editor */}
      {productData.optionalSections.testimonials && (
        <Card>
          <CardHeader>
            <CardTitle>Manage Testimonials</CardTitle>
          </CardHeader>
          <CardContent>
            <TestimonialsEditor
              testimonials={productData.testimonialsData}
              onChange={(testimonials) => updateProductData('testimonialsData', testimonials)}
            />
          </CardContent>
        </Card>
      )}

      {/* FAQ Editor */}
      {productData.optionalSections.faq && (
        <Card>
          <CardHeader>
            <CardTitle>Manage FAQ</CardTitle>
          </CardHeader>
          <CardContent>
            <FAQEditor
              faqs={productData.faqData}
              onChange={(faqs) => updateProductData('faqData', faqs)}
            />
          </CardContent>
        </Card>
      )}

      {/* About Me Editor */}
      {productData.optionalSections.aboutMe && (
        <Card>
          <CardHeader>
            <CardTitle>About Me Section</CardTitle>
          </CardHeader>
          <CardContent>
            <AboutMeEditor
              aboutMeData={productData.aboutMeData}
              onChange={(aboutMeData) => updateProductData('aboutMeData', aboutMeData)}
            />
          </CardContent>
        </Card>
      )}
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