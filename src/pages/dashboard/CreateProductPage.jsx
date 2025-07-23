import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Checkbox } from '../../components/ui/checkbox'
import { Badge } from '../../components/ui/badge'
import { Upload, X, Plus, DollarSign, Tag, Image, FileText, Settings, ArrowLeft, ArrowRight, Edit3 } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import productService from '../../services/productService'
import RichTextEditor from '../../components/editor/RichTextEditorSimple'
import { dashboardColors } from '../../lib/dashboardColors'

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

const PRICING_TYPES = [
  { value: 'one-time', label: 'One-time Payment' },
  { value: 'pay-what-you-want', label: 'Pay What You Want' },
  { value: 'subscription', label: 'Subscription' }
]

const CURRENCIES = [
  { value: 'INR', label: '₹ INR' },
  { value: 'USD', label: '$ USD' },
  { value: 'EUR', label: '€ EUR' },
  { value: 'GBP', label: '£ GBP' }
]

export function CreateProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)
  const [activeTab, setActiveTab] = useState('basic')
  const [loading, setLoading] = useState(isEditing)
  const [productData, setProductData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: '',
    price: { amount: '', currency: 'INR' },
    pricing: { type: 'one-time', minimumPrice: '', suggestedPrice: '' },
    tags: [],
    features: [''],
    requirements: [''],
    inventory: { type: 'unlimited', quantity: '' },
    settings: {
      enableReviews: true,
      enableComments: true,
      showSalesCount: true,
      enableDownloadLimit: false,
      downloadLimit: 3
    },
    content: null, // Rich content from editor
    contentMetadata: {
      hasRichContent: false,
      wordCount: 0,
      readTime: 0
    }
  })
  
  const [coverImage, setCoverImage] = useState(null)
  const [productFiles, setProductFiles] = useState([]) // New files to upload
  const [existingFiles, setExistingFiles] = useState([]) // Existing files from database
  const [filesToRemove, setFilesToRemove] = useState([]) // Files marked for removal
  const [newTag, setNewTag] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Load existing product data for editing
  useEffect(() => {
    if (isEditing && id) {
      fetchProductData()
    }
  }, [isEditing, id])
  
  const fetchProductData = async () => {
    try {
      setLoading(true)
      const response = await productService.getProduct(id)
      const product = response.product
      
      // Populate form with existing data
      setProductData({
        title: product.title || '',
        description: product.description || '',
        shortDescription: product.shortDescription || '',
        category: product.category || '',
        price: {
          amount: product.price?.amount !== undefined ? product.price.amount : '',
          currency: product.price?.currency || 'INR'
        },
        pricing: {
          type: product.pricing?.type || 'one-time',
          minimumPrice: product.pricing?.minimumPrice || '',
          suggestedPrice: product.pricing?.suggestedPrice || ''
        },
        tags: product.tags || [],
        features: product.features?.length > 0 ? product.features : [''],
        requirements: product.requirements?.length > 0 ? product.requirements : [''],
        inventory: {
          type: product.inventory?.type || 'unlimited',
          quantity: product.inventory?.quantity || ''
        },
        settings: {
          enableReviews: product.settings?.enableReviews !== false,
          enableComments: product.settings?.enableComments !== false,
          showSalesCount: product.settings?.showSalesCount !== false,
          enableDownloadLimit: product.settings?.enableDownloadLimit || false,
          downloadLimit: product.settings?.downloadLimit || 3
        },
        content: product.content || null,
        contentMetadata: {
          hasRichContent: product.contentMetadata?.hasRichContent || false,
          wordCount: product.contentMetadata?.wordCount || 0,
          readTime: product.contentMetadata?.readTime || 0
        }
      })
      
      // Load existing files
      if (product.files && Array.isArray(product.files)) {
        setExistingFiles(product.files)
      }
      
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Failed to load product data')
      navigate('/dashboard/products')
    } finally {
      setLoading(false)
    }
  }

  const { getRootProps: getCoverProps, getInputProps: getCoverInputProps } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setCoverImage(acceptedFiles[0])
      }
    }
  })

  const { getRootProps: getFilesProps, getInputProps: getFilesInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setProductFiles(prev => [...prev, ...acceptedFiles])
    }
  })

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setProductData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setProductData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const addTag = () => {
    if (newTag.trim() && !productData.tags.includes(newTag.trim())) {
      setProductData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove) => {
    setProductData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const addFeature = () => {
    setProductData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }))
  }

  const updateFeature = (index, value) => {
    setProductData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }))
  }

  const removeFeature = (index) => {
    setProductData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const addRequirement = () => {
    setProductData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }))
  }

  const updateRequirement = (index, value) => {
    setProductData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => i === index ? value : req)
    }))
  }

  const removeRequirement = (index) => {
    setProductData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }))
  }

  const removeFile = (index) => {
    setProductFiles(prev => prev.filter((_, i) => i !== index))
  }
  
  const removeExistingFile = (fileId) => {
    // Mark file for removal
    setFilesToRemove(prev => [...prev, fileId])
    // Remove from existing files display
    setExistingFiles(prev => prev.filter(file => file._id !== fileId))
  }

  // Helper function to get short description validation state
  const getShortDescriptionValidation = () => {
    const length = productData.shortDescription.length
    if (length > 300) {
      return {
        isError: true,
        isWarning: false,
        message: `Description is ${length - 300} characters too long`,
        colorClass: 'text-red-500 font-medium',
        borderClass: 'border-red-500 focus:border-red-500 focus:ring-red-500'
      }
    } else if (length > 250) {
      return {
        isError: false,
        isWarning: true,
        message: 'Approaching character limit',
        colorClass: 'text-yellow-500',
        borderClass: 'border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500'
      }
    } else {
      return {
        isError: false,
        isWarning: false,
        message: '',
        colorClass: 'text-muted-foreground',
        borderClass: ''
      }
    }
  }

  // Helper function to check if form has validation errors
  const hasValidationErrors = () => {
    return productData.shortDescription.length > 300
  }

  const handleSubmit = async (isDraft = true) => {
    setIsSubmitting(true)
    try {
      // Validate required fields
      if (!productData.title.trim()) {
        toast.error('Product title is required')
        return
      }
      if (!productData.description.trim()) {
        toast.error('Product description is required')
        return
      }
      if (!productData.category) {
        toast.error('Product category is required')
        return
      }
      if (productData.shortDescription.length > 300) {
        toast.error('Short description cannot exceed 300 characters')
        return
      }
      if (!isDraft && (productData.price.amount === '' || parseFloat(productData.price.amount) < 0)) {
        toast.error('Price must be 0 or greater for published products')
        return
      }
      
      // Prepare product data
      const submissionData = {
        ...productData,
        features: productData.features.filter(f => f.trim()),
        requirements: productData.requirements.filter(r => r.trim()),
        isDraft,
        // Ensure price amount is properly formatted
        price: {
          ...productData.price,
          amount: productData.price.amount === '' ? 0 : parseFloat(productData.price.amount)
        }
      }

      let response
      if (isEditing) {
        // Update existing product
        if (coverImage || productFiles.length > 0 || filesToRemove.length > 0) {
          response = await productService.updateProductWithFiles(
            id,
            submissionData,
            coverImage,
            productFiles,
            existingFiles,
            filesToRemove
          )
        } else {
          response = await productService.updateProduct(id, submissionData)
        }
      } else {
        // Create new product
        if (coverImage || productFiles.length > 0) {
          response = await productService.createProductWithFiles(
            submissionData,
            coverImage,
            productFiles
          )
        } else {
          response = await productService.createProduct(submissionData)
        }
      }
      
      toast.success(response.message || (isDraft ? 'Product saved as draft!' : 'Product published successfully!'))
      navigate('/dashboard/products')
      
    } catch (error) {
      console.error('Error saving product:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save product'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const getNextButton = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab)
    const nextTab = tabs[currentIndex + 1]
    
    if (nextTab) {
      return (
        <Button onClick={() => setActiveTab(nextTab.id)} className={`bg-gradient-to-r ${dashboardColors.primaryButton.gradient} text-white border-0 ${dashboardColors.primaryButton.shadow}`}>
          Next Step
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      )
    }
    return null
  }
  
  const getPrevButton = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab)
    const prevTab = tabs[currentIndex - 1]
    
    if (prevTab) {
      return (
        <Button variant="outline" onClick={() => setActiveTab(prevTab.id)} className="hover:bg-purple-50 hover:border-purple-300">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous Step
        </Button>
      )
    }
    return null
  }
  
  const canPublish = () => {
    // Only allow publishing after content/media has been created or we're on the last steps
    return activeTab === 'content' || activeTab === 'media' || activeTab === 'details' || activeTab === 'settings' || isEditing
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: FileText },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'content', label: 'Content', icon: Edit3 },
    { id: 'media', label: 'Media & Files', icon: Image },
    { id: 'details', label: 'Details', icon: Tag },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          {isEditing ? 'Edit Product' : 'Create Product'}
        </h1>
        <p className="text-muted-foreground">
          {isEditing 
            ? 'Update your digital product details'
            : 'Create a new digital product to sell on your storefront'
          }
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 overflow-x-auto bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900 dark:to-gray-900 p-2 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg transform scale-105'
                  : 'bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:text-purple-600 shadow-sm'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      <Card className="border-0 bg-gradient-to-br from-white to-slate-50 dark:from-gray-900 dark:to-slate-900 shadow-lg">
        <CardContent className="p-6">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="title">Product Title *</Label>
                <Input
                  id="title"
                  value={productData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter product title"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={productData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                {(() => {
                  const validation = getShortDescriptionValidation()
                  return (
                    <>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="shortDescription">Short Description</Label>
                        <span className={`text-sm ${validation.colorClass}`}>
                          {productData.shortDescription.length}/300
                        </span>
                      </div>
                      <Textarea
                        id="shortDescription"
                        value={productData.shortDescription}
                        onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                        placeholder="Brief description (max 300 characters)"
                        rows={2}
                        maxLength={400}
                        className={`mt-1 ${validation.borderClass}`}
                      />
                      {validation.message && (
                        <p className={`text-sm mt-1 ${validation.isError ? 'text-red-500' : 'text-yellow-500'}`}>
                          {validation.message}
                        </p>
                      )}
                    </>
                  )
                })()}
              </div>

              <div>
                <Label htmlFor="description">Full Description *</Label>
                <Textarea
                  id="description"
                  value={productData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detailed product description"
                  rows={6}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {/* Pricing Tab */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div>
                <Label>Pricing Type</Label>
                <Select 
                  value={productData.pricing.type} 
                  onValueChange={(value) => handleInputChange('pricing.type', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRICING_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Currency</Label>
                  <Select 
                    value={productData.price.currency} 
                    onValueChange={(value) => handleInputChange('price.currency', value)}
                  >
                    <SelectTrigger className="mt-1">
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

                <div>
                  <Label>
                    {productData.pricing.type === 'pay-what-you-want' ? 'Suggested Price' : 'Price *'}
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={productData.price.amount}
                    onChange={(e) => handleInputChange('price.amount', e.target.value)}
                    placeholder="0.00 (Use 0 for free products)"
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Set to 0 for free products to build your email list
                  </p>
                </div>
              </div>

              {productData.pricing.type === 'pay-what-you-want' && (
                <div>
                  <Label>Minimum Price</Label>
                  <Input
                    type="number"
                    value={productData.pricing.minimumPrice}
                    onChange={(e) => handleInputChange('pricing.minimumPrice', e.target.value)}
                    placeholder="0.00"
                    className="mt-1"
                  />
                </div>
              )}

              <div>
                <Label>Inventory</Label>
                <div className="space-y-4 mt-2">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="unlimited"
                        checked={productData.inventory.type === 'unlimited'}
                        onCheckedChange={(checked) => 
                          handleInputChange('inventory.type', checked ? 'unlimited' : 'limited')
                        }
                      />
                      <Label htmlFor="unlimited">Unlimited stock</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="limited"
                        checked={productData.inventory.type === 'limited'}
                        onCheckedChange={(checked) => 
                          handleInputChange('inventory.type', checked ? 'limited' : 'unlimited')
                        }
                      />
                      <Label htmlFor="limited">Limited stock</Label>
                    </div>
                  </div>
                  
                  {productData.inventory.type === 'limited' && (
                    <Input
                      type="number"
                      value={productData.inventory.quantity}
                      onChange={(e) => handleInputChange('inventory.quantity', e.target.value)}
                      placeholder="Enter quantity"
                      className="max-w-xs"
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Media & Files Tab */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <div>
                <Label>Cover Image</Label>
                <div {...getCoverProps()} className="mt-2 border-2 border-dashed border-purple-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all duration-200">
                  <input {...getCoverInputProps()} />
                  {coverImage ? (
                    <div className="space-y-2">
                      <img 
                        src={URL.createObjectURL(coverImage)} 
                        alt="Cover preview" 
                        className="mx-auto max-h-48 rounded-lg"
                      />
                      <p className="text-sm text-muted-foreground">{coverImage.name}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation()
                          setCoverImage(null)
                        }}
                        className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="mx-auto h-12 w-12 text-purple-400" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload or drag and drop your cover image
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label>Product Files</Label>
                <div {...getFilesProps()} className="mt-2 border-2 border-dashed border-blue-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200">
                  <input {...getFilesInputProps()} />
                  <Upload className="mx-auto h-8 w-8 text-blue-400 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop your product files
                  </p>
                </div>

                {/* Existing Files */}
                {isEditing && existingFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <Label>Current Files</Label>
                    {existingFiles.map((file) => (
                      <div key={file._id || file.id} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown size'}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExistingFile(file._id || file.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* New Files to Upload */}
                {productFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <Label>New Files to Upload</Label>
                    {productFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Label className="text-lg font-medium">Rich Content</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Create engaging content that buyers will access after purchase
                    </p>
                  </div>
                  {productData.contentMetadata.hasRichContent && (
                    <div className="text-sm text-muted-foreground">
                      {productData.contentMetadata.wordCount} words • {productData.contentMetadata.readTime} min read
                    </div>
                  )}
                </div>
                
                <div className="border rounded-lg p-4 min-h-[400px]">
                  <RichTextEditor
                    content={productData.content}
                    onChange={(content) => {
                      // Calculate word count and read time
                      const textContent = content.replace(/<[^>]*>/g, '').trim()
                      const wordCount = textContent ? textContent.split(/\s+/).length : 0
                      const readTime = Math.max(1, Math.ceil(wordCount / 200))
                      
                      setProductData(prev => ({
                        ...prev,
                        content,
                        contentMetadata: {
                          hasRichContent: textContent.length > 0,
                          wordCount,
                          readTime
                        }
                      }))
                    }}
                    placeholder="Start creating your product content..."
                  />
                </div>
                
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Content Delivery</h4>
                  <p className="text-sm text-blue-700">
                    Instead of file downloads, buyers will access this rich content page after purchase. 
                    You can include text, images, videos, and file download links within your content.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div>
                <Label>Tags</Label>
                <div className="space-y-2 mt-1">
                  <div className="flex space-x-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button onClick={addTag} variant="outline" className="hover:bg-purple-50 hover:border-purple-300">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {productData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {productData.tags.map((tag, index) => (
                        <Badge key={index} className="cursor-pointer bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 border-purple-300 shadow-sm hover:from-purple-200 hover:to-blue-200">
                          {tag}
                          <X 
                            className="h-3 w-3 ml-1 hover:text-red-600" 
                            onClick={() => removeTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label>Features</Label>
                  <Button onClick={addFeature} variant="outline" size="sm" className="hover:bg-green-50 hover:border-green-300">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Feature
                  </Button>
                </div>
                <div className="space-y-2 mt-2">
                  {productData.features.map((feature, index) => (
                    <div key={index} className="flex space-x-2">
                      <Input
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        placeholder="Enter feature"
                      />
                      {productData.features.length > 1 && (
                        <Button
                          onClick={() => removeFeature(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label>Requirements</Label>
                  <Button onClick={addRequirement} variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-300">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Requirement
                  </Button>
                </div>
                <div className="space-y-2 mt-2">
                  {productData.requirements.map((requirement, index) => (
                    <div key={index} className="flex space-x-2">
                      <Input
                        value={requirement}
                        onChange={(e) => updateRequirement(index, e.target.value)}
                        placeholder="Enter requirement"
                      />
                      {productData.requirements.length > 1 && (
                        <Button
                          onClick={() => removeRequirement(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="enableReviews"
                    checked={productData.settings.enableReviews}
                    onCheckedChange={(checked) => 
                      setProductData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, enableReviews: checked }
                      }))
                    }
                  />
                  <Label htmlFor="enableReviews">Enable customer reviews</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="enableComments"
                    checked={productData.settings.enableComments}
                    onCheckedChange={(checked) => 
                      setProductData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, enableComments: checked }
                      }))
                    }
                  />
                  <Label htmlFor="enableComments">Enable comments</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="showSalesCount"
                    checked={productData.settings.showSalesCount}
                    onCheckedChange={(checked) => 
                      setProductData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, showSalesCount: checked }
                      }))
                    }
                  />
                  <Label htmlFor="showSalesCount">Show sales count to customers</Label>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="enableDownloadLimit"
                      checked={productData.settings.enableDownloadLimit}
                      onCheckedChange={(checked) => 
                        setProductData(prev => ({
                          ...prev,
                          settings: { ...prev.settings, enableDownloadLimit: checked }
                        }))
                      }
                    />
                    <Label htmlFor="enableDownloadLimit">Limit downloads per purchase</Label>
                  </div>
                  
                  {productData.settings.enableDownloadLimit && (
                    <Input
                      type="number"
                      value={productData.settings.downloadLimit}
                      onChange={(e) => 
                        setProductData(prev => ({
                          ...prev,
                          settings: { ...prev.settings, downloadLimit: parseInt(e.target.value) }
                        }))
                      }
                      placeholder="Number of downloads"
                      className="max-w-xs ml-6"
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/dashboard/products')} className="hover:bg-gray-50">
                Cancel
              </Button>
              {getPrevButton()}
            </div>
            
            <div className="flex gap-2">
              {activeTab !== 'settings' && getNextButton()}
              
              {/* Save as Draft - always available */}
              <Button 
                variant="outline" 
                onClick={() => handleSubmit(true)}
                disabled={isSubmitting || hasValidationErrors()}
                className="hover:bg-orange-50 hover:border-orange-300"
              >
                Save as Draft
              </Button>
              
              {/* Publish button - only show after media upload or when editing */}
              {canPublish() && (
                <Button 
                  onClick={() => handleSubmit(false)}
                  disabled={isSubmitting || hasValidationErrors()}
                  title={hasValidationErrors() ? 'Please fix validation errors before publishing' : ''}
                  className={`bg-gradient-to-r ${dashboardColors.primaryButton.gradient} text-white border-0 ${dashboardColors.primaryButton.shadow}`}
                >
                  {isSubmitting 
                    ? (isEditing ? 'Updating...' : 'Publishing...') 
                    : (isEditing ? 'Update Product' : 'Publish Product')
                  }
                </Button>
              )}
              
              {/* Show validation error message when buttons are disabled */}
              {hasValidationErrors() && (
                <div className="text-sm text-red-500 font-medium">
                  Fix validation errors to save/publish
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}