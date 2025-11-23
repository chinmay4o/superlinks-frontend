import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Textarea } from '../../ui/textarea'
import { Switch } from '../../ui/switch'
import { Separator } from '../../ui/separator'
import { 
  Settings, Globe, Eye, EyeOff, Link, 
  Copy, Share2, BarChart3, Shield, 
  Bell, Palette, Zap
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function BioSettingsTab({
  bio,
  user,
  onUpdateSettings,
  loading
}) {
  const [customDomain, setCustomDomain] = useState(bio?.settings?.customDomain || '')
  const [isPublished, setIsPublished] = useState(bio?.settings?.isPublished || false)
  const [seoSettings, setSeoSettings] = useState({
    metaTitle: bio?.settings?.seoTitle || '',
    metaDescription: bio?.settings?.seoDescription || '',
    keywords: bio?.settings?.seoKeywords || ''
  })

  const handleSettingUpdate = (field, value) => {
    onUpdateSettings({
      [field]: value
    })
  }

  const handleSeoUpdate = (field, value) => {
    const newSeoSettings = { ...seoSettings, [field]: value }
    setSeoSettings(newSeoSettings)
    onUpdateSettings({
      [`seo${field.charAt(0).toUpperCase() + field.slice(1)}`]: value
    })
  }

  const handlePublishToggle = () => {
    const newPublishState = !isPublished
    setIsPublished(newPublishState)
    handleSettingUpdate('isPublished', newPublishState)

    if (newPublishState) {
      toast.success('Bio is now live!')
    } else {
      toast.success('Bio is now private')
    }
  }

  const copyBioUrl = () => {
    const url = `https://superlinks.ai/${user?.username}`
    navigator.clipboard.writeText(url)
    toast.success('Bio URL copied to clipboard!')
  }

  const shareOnSocial = (platform) => {
    const bioUrl = `https://superlinks.ai/${user?.username}`
    const shareText = `Check out my link in bio page!`
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(bioUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(bioUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(bioUrl)}`
    }
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="space-y-4">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Publish Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Visibility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="flex items-center gap-2">
                {isPublished ? (
                  <Eye className="h-4 w-4 text-green-600" />
                ) : (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                )}
                <span className="font-medium">
                  {isPublished ? 'Published' : 'Private'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {isPublished 
                  ? 'Your bio is live and visible to everyone'
                  : 'Your bio is private and only visible to you'
                }
              </p>
            </div>
            <Switch
              checked={isPublished}
              onCheckedChange={handlePublishToggle}
            />
          </div>

          {isPublished && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <Globe className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  superlinks.ai/{user?.username}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyBioUrl}
                  className="ml-auto"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => shareOnSocial('twitter')}
                >
                  Share on Twitter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => shareOnSocial('facebook')}
                >
                  Share on Facebook
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Custom Domain */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Link className="h-5 w-5" />
            Custom Domain
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="custom-domain">Your Domain</Label>
            <Input
              id="custom-domain"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              placeholder="yourdomain.com"
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              Connect your own domain to make your bio page truly yours
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => {
              if (customDomain) {
                handleSettingUpdate('customDomain', customDomain)
                toast.success('Domain settings updated!')
              }
            }}
          >
            Update Domain
          </Button>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Pro tip:</strong> Custom domains require DNS configuration. 
              Check our documentation for setup instructions.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* SEO Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            SEO Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="meta-title">Page Title</Label>
            <Input
              id="meta-title"
              value={seoSettings.metaTitle}
              onChange={(e) => handleSeoUpdate('metaTitle', e.target.value)}
              placeholder={`${user?.name || 'Your Name'} - Link in Bio`}
              maxLength="60"
            />
            <p className="text-xs text-gray-500 mt-1">
              {seoSettings.metaTitle.length}/60 characters
            </p>
          </div>
          
          <div>
            <Label htmlFor="meta-description">Meta Description</Label>
            <Textarea
              id="meta-description"
              value={seoSettings.metaDescription}
              onChange={(e) => handleSeoUpdate('metaDescription', e.target.value)}
              placeholder="Discover all my content, links, and ways to connect with me in one place."
              maxLength="160"
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              {seoSettings.metaDescription.length}/160 characters
            </p>
          </div>
          
          <div>
            <Label htmlFor="keywords">Keywords</Label>
            <Input
              id="keywords"
              value={seoSettings.keywords}
              onChange={(e) => handleSeoUpdate('keywords', e.target.value)}
              placeholder="creator, content, links, social media"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate keywords with commas
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Password Protection</Label>
              <p className="text-sm text-gray-600">Require a password to view your bio</p>
            </div>
            <Switch
              checked={bio?.passwordProtected || false}
              onCheckedChange={(checked) => handleSettingUpdate('passwordProtected', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Hide from Search Engines</Label>
              <p className="text-sm text-gray-600">Prevent indexing by search engines</p>
            </div>
            <Switch
              checked={bio?.noIndex || false}
              onCheckedChange={(checked) => handleSettingUpdate('noIndex', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Analytics Tracking</Label>
              <p className="text-sm text-gray-600">Track visitor analytics and engagement</p>
            </div>
            <Switch
              checked={bio?.analyticsEnabled !== false}
              onCheckedChange={(checked) => handleSettingUpdate('analyticsEnabled', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-sm text-gray-600">Get notified of bio interactions</p>
            </div>
            <Switch
              checked={bio?.emailNotifications !== false}
              onCheckedChange={(checked) => handleSettingUpdate('emailNotifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Weekly Reports</Label>
              <p className="text-sm text-gray-600">Receive weekly analytics summaries</p>
            </div>
            <Switch
              checked={bio?.weeklyReports || false}
              onCheckedChange={(checked) => handleSettingUpdate('weeklyReports', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Advanced Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Advanced
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Custom CSS</Label>
            <Textarea
              value={bio?.customCss || ''}
              onChange={(e) => handleSettingUpdate('customCss', e.target.value)}
              placeholder="/* Add your custom CSS here */"
              rows={4}
              className="font-mono text-sm"
            />
            <p className="text-sm text-gray-600 mt-1">
              Add custom CSS to further customize your bio page
            </p>
          </div>
          
          <div>
            <Label>Custom HTML Head</Label>
            <Textarea
              value={bio?.customHead || ''}
              onChange={(e) => handleSettingUpdate('customHead', e.target.value)}
              placeholder="<!-- Add custom HTML for <head> section -->"
              rows={3}
              className="font-mono text-sm"
            />
            <p className="text-sm text-gray-600 mt-1">
              Add custom HTML to the page head (analytics, fonts, etc.)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-lg text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border border-red-200 rounded-lg bg-red-50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-red-800">Reset Bio</h4>
                <p className="text-sm text-red-600">Clear all content and reset to default</p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (window.confirm('Are you sure? This will delete all your bio content.')) {
                    toast.error('Feature coming soon - contact support for bio reset')
                  }
                }}
              >
                Reset
              </Button>
            </div>
          </div>
          
          <div className="p-4 border border-red-200 rounded-lg bg-red-50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-red-800">Delete Bio</h4>
                <p className="text-sm text-red-600">Permanently delete your bio page</p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (window.confirm('Are you sure? This action cannot be undone.')) {
                    toast.error('Feature coming soon - contact support for bio deletion')
                  }
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}