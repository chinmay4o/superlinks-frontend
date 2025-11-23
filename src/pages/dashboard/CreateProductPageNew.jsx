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
  Link as LinkIcon, Palette, CreditCard, Shield, BarChart3, Sparkles
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
    category: '',
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
    themeStyle: 'default',
    customization: {
      primaryColor: '#6366f1',
      backgroundColor: '#ffffff',
      textColor: '#000000'
    },
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
      emailData: {
        subject: '',
        template: '',
        delayMinutes: 0
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
        const key = pathArray[i]
        // Create nested object if it doesn't exist
        if (!current[key] || typeof current[key] !== 'object') {
          current[key] = {}
        }
        current = current[key]
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
        // Handle theme mapping - support both old 'theme' and new 'themeStyle' format
        themeStyle: backendData.themeStyle || backendData.theme || backendData.advanced?.themeStyle || 'default',
        // Ensure customization exists
        customization: backendData.customization || {
          primaryColor: '#6366f1',
          backgroundColor: '#ffffff',
          textColor: '#000000'
        },
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
      
      // Validate required fields if not a draft
      if (!isDraft) {
        const requiredFields = {
          title: productData.title?.trim(),
          description: productData.description?.trim(),
          category: productData.category
        }
        
        const missingFields = Object.entries(requiredFields)
          .filter(([key, value]) => !value)
          .map(([key]) => key)
        
        if (missingFields.length > 0) {
          toast.error(`Please fill in required fields: ${missingFields.join(', ')}`)
          setSaving(false)
          return
        }

        // Validate category is in allowed enum values
        const allowedCategories = ['ebook', 'course', 'template', 'art', 'toolkit', 'audio', 'software', 'other']
        if (!allowedCategories.includes(productData.category)) {
          toast.error('Please select a valid category')
          setSaving(false)
          return
        }

        // Validate price is a valid number
        if (productData.price?.amount !== undefined && (isNaN(productData.price.amount) || productData.price.amount < 0)) {
          toast.error('Price must be a valid positive number')
          setSaving(false)
          return
        }

        // Validate bump offer if enabled
        if (productData.boostSales?.bumpOffer) {
          const bumpOfferData = productData.boostSales.bumpOfferData
          if (!bumpOfferData?.title?.trim() || !bumpOfferData?.description?.trim()) {
            toast.error('Bump offer requires title and description when enabled')
            setSaving(false)
            return
          }
          if (isNaN(bumpOfferData?.price?.amount) || bumpOfferData?.price?.amount < 0) {
            toast.error('Bump offer price must be a valid positive number')
            setSaving(false)
            return
          }
        }

        // Validate email automation if enabled
        if (productData.boostSales?.automatedEmail) {
          const emailData = productData.boostSales.emailData
          if (!emailData?.subject?.trim() || !emailData?.template?.trim()) {
            toast.error('Email automation requires subject and content when enabled')
            setSaving(false)
            return
          }
        }
      }
      
      // Ensure files have proper structure with all required fields
      // Upload cover image if it's a new file
      let validCoverImage = null
      if (productData.coverImage) {
        if (productData.coverImage.file && !productData.coverImage.key) {
          // Upload new image to AWS
          try {
            const uploadService = await import('../../services/uploadService')
            const uploadResult = await uploadService.default.uploadFile(productData.coverImage.file, 'images')
            validCoverImage = {
              url: uploadResult.fileUrl,
              key: uploadResult.fileKey,
              alt: productData.title || '',
              name: productData.coverImage.name,
              size: productData.coverImage.size
            }
          } catch (uploadError) {
            console.error('Failed to upload cover image:', uploadError)
            toast.error('Failed to upload cover image')
            setSaving(false)
            return
          }
        } else if (productData.coverImage.key && productData.coverImage.url) {
          // Existing uploaded image
          validCoverImage = productData.coverImage
        }
      }
      
      const validFiles = (productData.files || []).filter(file => 
        file.key && file.url && file.name && file.size !== undefined && file.type
      )
      const validResourceLinks = (productData.resourceLinks || []).filter(link => link.url && link.title)
      
      // Helper function to strip HTML tags from text
      const stripHtmlTags = (html) => {
        if (!html) return ''
        // Create a temporary div element to parse HTML
        const tmp = document.createElement('div')
        tmp.innerHTML = html
        return tmp.textContent || tmp.innerText || ''
      }
      
      // Transform frontend data structure to match backend expectations
      const transformedData = {
        ...productData,
        // Clean the description to remove HTML tags
        description: stripHtmlTags(productData.description || ''),
        // Ensure proper file structure
        files: validFiles,
        images: {
          cover: validCoverImage ? {
            url: validCoverImage.url,
            key: validCoverImage.key,
            alt: validCoverImage.alt || productData.title || ''
          } : null,
          gallery: []
        },
        resourceLinks: validResourceLinks,
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
          title: productData.boostSales?.bumpOfferData?.title || '',
          description: productData.boostSales?.bumpOfferData?.description || '',
          price: parseFloat(productData.boostSales?.bumpOfferData?.price?.amount) || 0,
          originalPrice: parseFloat(productData.boostSales?.bumpOfferData?.originalPrice?.amount) || 0,
          files: productData.boostSales?.bumpOfferData?.files || []
        },
        emailAutomation: {
          enabled: productData.boostSales?.automatedEmail || false,
          subject: productData.boostSales?.emailData?.subject || '',
          content: productData.boostSales?.emailData?.template || '',
          delay: parseInt(productData.boostSales?.emailData?.delayMinutes) || 0
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
          customRedirectUrl: productData.customRedirectUrl || '',
          themeStyle: productData.themeStyle || 'default'
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
      delete transformedData.themeStyle // Now mapped to advanced.themeStyle
      delete transformedData.coverImage // Now mapped to images.cover
      
      // Clean up any undefined or empty values
      Object.keys(transformedData).forEach(key => {
        if (transformedData[key] === undefined || transformedData[key] === null) {
          delete transformedData[key]
        }
      })
      
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
          <div className="border-t bg-background p-3 relative overflow-hidden">
            {/* Subtle grid background */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.3) 1px, transparent 0)`,
                backgroundSize: '16px 16px'
              }}
            />
            
            <div className="flex items-center gap-3 justify-center relative z-10">
              <Button 
                variant="outline" 
                disabled={saving} 
                onClick={() => handleSave(true)}
                className="h-11 w-[40%] relative group overflow-hidden border-2 hover:border-primary/50 transition-all duration-300"
              >
                {/* Subtle glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <span className="relative z-10">{saving ? 'Saving...' : 'Save Draft'}</span>
              </Button>
              
              <Button 
                onClick={() => handleSave(false)} 
                disabled={saving}
                className="h-11 w-[40%] relative group overflow-hidden bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Premium shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full group-hover:duration-700" />
                
                <span className="relative z-10 font-medium flex items-center gap-2">
                  {saving ? 'Saving...' : 'Publish Product'}
                  {!saving && <Sparkles className="h-4 w-4 text-yellow-300 opacity-80 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-300" />}
                </span>
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
            <div className="flex-1 p-0 overflow-y-auto relative">
              {/* Grid background */}
              <div 
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.6) 1px, transparent 0)`,
                  backgroundSize: '16px 16px'
                }}
              />
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

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select 
              value={productData.category} 
              onValueChange={(value) => updateProductData('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ebook">Ebook</SelectItem>
                <SelectItem value="course">Video Course</SelectItem>
                <SelectItem value="template">Template</SelectItem>
                <SelectItem value="art">Digital Art</SelectItem>
                <SelectItem value="toolkit">PDF / Docs / Toolkit</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="software">Software</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
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
            selectedTheme={productData.themeStyle}
            onThemeChange={(themeStyle) => updateProductData('themeStyle', themeStyle)}
            productData={productData}
            updateProductData={updateProductData}
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