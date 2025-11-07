import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Switch } from '../ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Edit, Info, Link, BarChart3, TrendingUp } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'

export function AdvancedFeatures({ productData, updateProductData }) {
  const [urlModal, setUrlModal] = useState(false)
  const [postPurchaseModal, setPostPurchaseModal] = useState(false)
  const [metaPixelModal, setMetaPixelModal] = useState(false)
  const [analyticsModal, setAnalyticsModal] = useState(false)

  return (
    <div className="space-y-6">
      {/* Page URL */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link className="h-4 w-4 text-blue-500" />
              <div>
                <div className="font-medium">Page URL</div>
                <div className="text-sm text-muted-foreground">
                  Customize your product page URL slug
                </div>
              </div>
            </div>
            <Dialog open={urlModal} onOpenChange={setUrlModal}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Customize Page URL</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customUrl">Custom URL Slug</Label>
                    <div className="flex items-center">
                      <span className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-l border">
                        superlinks.ai/
                      </span>
                      <Input
                        id="customUrl"
                        value={productData.customUrl}
                        onChange={(e) => updateProductData('customUrl', e.target.value)}
                        placeholder="my-awesome-product"
                        className="rounded-l-none"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Use lowercase letters, numbers, and hyphens only
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setUrlModal(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setUrlModal(false)}>
                      Save URL
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Post Purchase Behaviour */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <div>
                <div className="font-medium">Post Purchase Behavior</div>
                <div className="text-sm text-muted-foreground">
                  What happens after a successful purchase
                </div>
              </div>
            </div>
            <Dialog open={postPurchaseModal} onOpenChange={setPostPurchaseModal}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Setup
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Post Purchase Behavior</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="postPurchase">Redirect After Purchase</Label>
                    <Select 
                      value={productData.postPurchaseBehavior} 
                      onValueChange={(value) => updateProductData('postPurchaseBehavior', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="download">Show Download Page</SelectItem>
                        <SelectItem value="thank-you">Thank You Page</SelectItem>
                        <SelectItem value="custom-url">Redirect to Custom URL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {productData.postPurchaseBehavior === 'custom-url' && (
                    <div className="space-y-2">
                      <Label htmlFor="redirectUrl">Custom Redirect URL</Label>
                      <Input
                        id="redirectUrl"
                        value={productData.customRedirectUrl || ''}
                        onChange={(e) => updateProductData('customRedirectUrl', e.target.value)}
                        placeholder="https://yoursite.com/thank-you"
                      />
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setPostPurchaseModal(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setPostPurchaseModal(false)}>
                      Save Settings
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Tracking Section */}
      <div className="space-y-4">
        <h4 className="font-medium">Analytics & Tracking</h4>
        
        {/* Meta Pixel */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="font-medium">Meta Pixel</div>
                  <div className="text-sm text-muted-foreground">
                    Track conversions for Facebook & Instagram ads
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {productData.tracking?.metaPixel && (
                  <Badge variant="default" className="text-xs">Active</Badge>
                )}
                <Dialog open={metaPixelModal} onOpenChange={setMetaPixelModal}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      {productData.tracking?.metaPixel ? 'Edit' : 'Setup'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Meta Pixel Setup</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="metaPixel">Meta Pixel ID</Label>
                        <Input
                          id="metaPixel"
                          value={productData.tracking?.metaPixel || ''}
                          onChange={(e) => updateProductData('tracking.metaPixel', e.target.value)}
                          placeholder="1234567890123456"
                        />
                        <p className="text-xs text-muted-foreground">
                          Find your Pixel ID in Meta Events Manager
                        </p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded text-sm">
                        <p className="font-medium mb-1">How to find your Meta Pixel ID:</p>
                        <ol className="list-decimal list-inside space-y-1 text-xs">
                          <li>Go to Meta Events Manager</li>
                          <li>Select your pixel from the left menu</li>
                          <li>Copy the Pixel ID (16-digit number)</li>
                        </ol>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setMetaPixelModal(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => setMetaPixelModal(false)}>
                          Save Pixel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Switch
                  checked={Boolean(productData.tracking?.metaPixel)}
                  onCheckedChange={(checked) => {
                    if (!checked) {
                      updateProductData('tracking.metaPixel', '')
                    }
                  }}
                  disabled={!productData.tracking?.metaPixel}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Google Analytics */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-4 w-4 text-orange-500" />
                <div>
                  <div className="font-medium">Google Analytics</div>
                  <div className="text-sm text-muted-foreground">
                    Track page views and conversions in Google Analytics
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {productData.tracking?.googleAnalytics && (
                  <Badge variant="default" className="text-xs">Active</Badge>
                )}
                <Dialog open={analyticsModal} onOpenChange={setAnalyticsModal}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      {productData.tracking?.googleAnalytics ? 'Edit' : 'Setup'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Google Analytics Setup</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="googleAnalytics">Google Analytics Measurement ID</Label>
                        <Input
                          id="googleAnalytics"
                          value={productData.tracking?.googleAnalytics || ''}
                          onChange={(e) => updateProductData('tracking.googleAnalytics', e.target.value)}
                          placeholder="G-XXXXXXXXXX"
                        />
                        <p className="text-xs text-muted-foreground">
                          Find your Measurement ID in Google Analytics Admin > Data Streams
                        </p>
                      </div>
                      <div className="bg-orange-50 p-3 rounded text-sm">
                        <p className="font-medium mb-1">How to find your Measurement ID:</p>
                        <ol className="list-decimal list-inside space-y-1 text-xs">
                          <li>Go to Google Analytics 4 property</li>
                          <li>Click Admin > Data Streams</li>
                          <li>Select your web stream</li>
                          <li>Copy the Measurement ID (starts with G-)</li>
                        </ol>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setAnalyticsModal(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => setAnalyticsModal(false)}>
                          Save Analytics
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Switch
                  checked={Boolean(productData.tracking?.googleAnalytics)}
                  onCheckedChange={(checked) => {
                    if (!checked) {
                      updateProductData('tracking.googleAnalytics', '')
                    }
                  }}
                  disabled={!productData.tracking?.googleAnalytics}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdvancedFeatures