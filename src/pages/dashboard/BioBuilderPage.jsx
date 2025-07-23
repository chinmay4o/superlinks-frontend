import React, { useState, useEffect } from 'react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Label } from '../../components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Switch } from '../../components/ui/switch'
import { 
  Plus, 
  Link as LinkIcon, 
  Eye, 
  Settings, 
  Palette, 
  BarChart3,
  ExternalLink,
  Copy,
  Edit,
  Trash2,
  GripVertical,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Facebook,
  Globe,
  Mail,
  Save,
  Share
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext'
import { dashboardColors } from '../../lib/dashboardColors'

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005/api'

const SOCIAL_ICONS = {
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
  facebook: Facebook,
  website: Globe,
  email: Mail
}

const LINK_ICONS = [
  'link', 'instagram', 'twitter', 'youtube', 'linkedin', 'facebook', 
  'website', 'email', 'shopping-cart', 'book', 'music', 'video',
  'camera', 'heart', 'star', 'gift'
]

const THEMES = [
  { value: 'default', label: 'Default' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'gradient', label: 'Gradient' },
  { value: 'dark', label: 'Dark' },
  { value: 'neon', label: 'Neon' }
]

const BUTTON_STYLES = [
  { value: 'rounded', label: 'Rounded' },
  { value: 'square', label: 'Square' },
  { value: 'pill', label: 'Pill' }
]

const FONT_FAMILIES = [
  { value: 'inter', label: 'Inter' },
  { value: 'poppins', label: 'Poppins' },
  { value: 'roboto', label: 'Roboto' },
  { value: 'montserrat', label: 'Montserrat' },
  { value: 'playfair', label: 'Playfair Display' }
]

export function BioBuilderPage() {
  const { user } = useAuth()
  const [bio, setBio] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('links')
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    title: '',
    description: '',
    avatar: '',
    location: ''
  })
  
  const [customizationForm, setCustomizationForm] = useState({
    theme: 'default',
    primaryColor: '#000000',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    fontFamily: 'inter',
    buttonStyle: 'rounded',
    avatarShape: 'circle'
  })
  
  const [socialForm, setSocialForm] = useState({
    instagram: '',
    twitter: '',
    youtube: '',
    linkedin: '',
    facebook: '',
    website: '',
    email: ''
  })
  
  const [settingsForm, setSettingsForm] = useState({
    showBranding: true,
    collectEmails: false,
    emailTitle: 'Stay updated!',
    emailDescription: 'Subscribe to get my latest updates',
    isPasswordProtected: false,
    password: ''
  })
  
  const [newLink, setNewLink] = useState({
    title: '',
    url: '',
    description: '',
    icon: 'link'
  })
  
  const [editingLink, setEditingLink] = useState(null)
  const [draggedLink, setDraggedLink] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)

  useEffect(() => {
    fetchBio()
  }, [])

  const fetchBio = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/bio`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setBio(data.bio)
        updateForms(data.bio)
      } else {
        console.error('Failed to fetch bio:', data.message)
        toast.error('Failed to load bio')
      }
    } catch (error) {
      console.error('Error fetching bio:', error)
      toast.error('Failed to load bio')
    } finally {
      setLoading(false)
    }
  }

  const updateForms = (bioData) => {
    setProfileForm({
      title: '',
      description: '',
      avatar: '',
      location: '',
      ...bioData.profile
    })
    setCustomizationForm({
      theme: 'default',
      primaryColor: '#000000',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      fontFamily: 'inter',
      buttonStyle: 'rounded',
      avatarShape: 'circle',
      ...bioData.customization
    })
    setSocialForm({
      instagram: '',
      twitter: '',
      youtube: '',
      linkedin: '',
      facebook: '',
      website: '',
      email: '',
      ...bioData.socialLinks
    })
    setSettingsForm({
      showBranding: true,
      collectEmails: false,
      emailTitle: 'Stay updated!',
      emailDescription: 'Subscribe to get my latest updates',
      isPasswordProtected: false,
      password: '',
      ...bioData.settings
    })
  }

  const updateProfile = async () => {
    try {
      setSaving(true)
      const response = await fetch(`${API_BASE_URL}/bio/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(profileForm)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setBio(data.bio)
        toast.success('Profile updated successfully')
      } else {
        toast.error(data.message || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const updateCustomization = async () => {
    try {
      setSaving(true)
      const response = await fetch(`${API_BASE_URL}/bio/customization`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(customizationForm)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setBio(data.bio)
        toast.success('Customization updated successfully')
      } else {
        toast.error(data.message || 'Failed to update customization')
      }
    } catch (error) {
      console.error('Error updating customization:', error)
      toast.error('Failed to update customization')
    } finally {
      setSaving(false)
    }
  }

  const updateSocialLinks = async () => {
    try {
      setSaving(true)
      const response = await fetch(`${API_BASE_URL}/bio/social`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(socialForm)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setBio(data.bio)
        toast.success('Social links updated successfully')
      } else {
        toast.error(data.message || 'Failed to update social links')
      }
    } catch (error) {
      console.error('Error updating social links:', error)
      toast.error('Failed to update social links')
    } finally {
      setSaving(false)
    }
  }

  const updateSettings = async () => {
    try {
      setSaving(true)
      const response = await fetch(`${API_BASE_URL}/bio/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(settingsForm)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setBio(data.bio)
        toast.success('Settings updated successfully')
      } else {
        toast.error(data.message || 'Failed to update settings')
      }
    } catch (error) {
      console.error('Error updating settings:', error)
      toast.error('Failed to update settings')
    } finally {
      setSaving(false)
    }
  }

  const addLink = async () => {
    if (!newLink.title.trim() || !newLink.url.trim()) {
      toast.error('Title and URL are required')
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/bio/links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newLink)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setBio(data.bio)
        setNewLink({ title: '', url: '', description: '', icon: 'link' })
        toast.success('Link added successfully')
      } else {
        toast.error(data.message || 'Failed to add link')
      }
    } catch (error) {
      console.error('Error adding link:', error)
      toast.error('Failed to add link')
    }
  }

  const updateLink = async (linkId, updates) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bio/links/${linkId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updates)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setBio(data.bio)
        setEditingLink(null)
        toast.success('Link updated successfully')
      } else {
        toast.error(data.message || 'Failed to update link')
      }
    } catch (error) {
      console.error('Error updating link:', error)
      toast.error('Failed to update link')
    }
  }

  const deleteLink = async (linkId) => {
    if (!window.confirm('Are you sure you want to delete this link?')) {
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/bio/links/${linkId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setBio(data.bio)
        toast.success('Link deleted successfully')
      } else {
        toast.error(data.message || 'Failed to delete link')
      }
    } catch (error) {
      console.error('Error deleting link:', error)
      toast.error('Failed to delete link')
    }
  }

  const copyBioLink = () => {
    const bioUrl = `${window.location.origin}/bio/${user?.username}`
    navigator.clipboard.writeText(bioUrl)
    toast.success('Bio link copied to clipboard')
  }

  const previewBio = () => {
    window.open(`/bio/${user?.username}`, '_blank')
  }

  const handleDragStart = (e, link, index) => {
    setDraggedLink({ link, index })
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', e.target.outerHTML)
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault()
    setDragOverIndex(null)

    if (!draggedLink || draggedLink.index === dropIndex) {
      setDraggedLink(null)
      return
    }

    const newLinks = [...bio.links]
    const draggedItem = newLinks[draggedLink.index]
    
    // Remove the dragged item
    newLinks.splice(draggedLink.index, 1)
    
    // Insert it at the new position
    newLinks.splice(dropIndex, 0, draggedItem)

    // Update the order property for each link
    const linkOrders = newLinks.map((link, index) => ({
      id: link.id,
      order: index
    }))

    try {
      const response = await fetch(`${API_BASE_URL}/bio/links/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ linkOrders })
      })

      const data = await response.json()

      if (response.ok) {
        setBio(data.bio)
        toast.success('Links reordered successfully')
      } else {
        toast.error(data.message || 'Failed to reorder links')
      }
    } catch (error) {
      console.error('Error reordering links:', error)
      toast.error('Failed to reorder links')
    }

    setDraggedLink(null)
  }

  const handleDragEnd = () => {
    setDraggedLink(null)
    setDragOverIndex(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading bio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Link in Bio</h1>
          <p className="text-muted-foreground">
            Create and customize your link-in-bio page
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={copyBioLink} className="hover:bg-purple-50 hover:border-purple-300">
            <Copy className="h-4 w-4 mr-2" />
            Copy Link
          </Button>
          <Button variant="outline" onClick={previewBio} className="hover:bg-blue-50 hover:border-blue-300">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          {user?.username && (
            <Button onClick={() => window.open(`/bio/${user.username}`, '_blank')} className={`bg-gradient-to-r ${dashboardColors.primaryButton.gradient} text-white border-0 ${dashboardColors.primaryButton.shadow}`}>
              <ExternalLink className="h-4 w-4 mr-2" />
              View Live
            </Button>
          )}
        </div>
      </div>

      {/* Bio URL Display */}
      {user?.username && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Your bio URL:</span>
              <code className="bg-muted px-2 py-1 rounded text-sm">
                {window.location.origin}/bio/{user.username}
              </code>
              <Button variant="ghost" size="sm" onClick={copyBioLink} className="hover:bg-purple-50">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 p-1 rounded-lg shadow-md border border-purple-200 dark:border-purple-800">
          <TabsTrigger value="links">
            <LinkIcon className="h-4 w-4 mr-2" />
            Links
          </TabsTrigger>
          <TabsTrigger value="customize">
            <Palette className="h-4 w-4 mr-2" />
            Customize
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Links Tab */}
        <TabsContent value="links" className="space-y-6">
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Display Name</Label>
                  <Input
                    id="title"
                    value={profileForm.title || ''}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Your display name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profileForm.location || ''}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Your location"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Bio Description</Label>
                <Textarea
                  id="description"
                  value={profileForm.description || ''}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Tell people about yourself..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input
                  id="avatar"
                  value={profileForm.avatar || ''}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, avatar: e.target.value }))}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              <Button onClick={updateProfile} disabled={saving} className={`bg-gradient-to-r ${dashboardColors.primaryButton.gradient} text-white border-0 ${dashboardColors.primaryButton.shadow}`}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Profile'}
              </Button>
            </CardContent>
          </Card>

          {/* Add New Link */}
          <Card>
            <CardHeader>
              <CardTitle>Add New Link</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="link-title">Link Title</Label>
                  <Input
                    id="link-title"
                    value={newLink.title}
                    onChange={(e) => setNewLink(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter link title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="link-url">URL</Label>
                  <Input
                    id="link-url"
                    value={newLink.url}
                    onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="link-description">Description (optional)</Label>
                  <Input
                    id="link-description"
                    value={newLink.description}
                    onChange={(e) => setNewLink(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="link-icon">Icon</Label>
                  <Select value={newLink.icon} onValueChange={(value) => setNewLink(prev => ({ ...prev, icon: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LINK_ICONS.map(icon => (
                        <SelectItem key={icon} value={icon}>
                          {icon}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={addLink} className={`bg-gradient-to-r ${dashboardColors.primaryButton.gradient} text-white border-0 ${dashboardColors.primaryButton.shadow}`}>
                <Plus className="h-4 w-4 mr-2" />
                Add Link
              </Button>
            </CardContent>
          </Card>

          {/* Links List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Links ({bio?.links?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {bio?.links?.length === 0 ? (
                <div className="text-center py-8">
                  <LinkIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No links added yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bio?.links?.map((link, index) => (
                    <div 
                      key={link.id} 
                      className={`flex items-center gap-4 p-4 border rounded-lg transition-colors ${
                        dragOverIndex === index ? 'border-primary bg-primary/5' : ''
                      } ${draggedLink?.index === index ? 'opacity-50' : ''}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, link, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragEnd={handleDragEnd}
                    >
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{link.title}</h4>
                          <Badge variant={link.isActive ? "default" : "secondary"}>
                            {link.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{link.url}</p>
                        {link.description && (
                          <p className="text-xs text-muted-foreground">{link.description}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {link.analytics?.clicks || 0} clicks
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingLink(link)}
                          className="hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteLink(link.id)}
                          className="hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(SOCIAL_ICONS).map(([platform, Icon]) => (
                  <div key={platform} className="space-y-2">
                    <Label htmlFor={platform} className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </Label>
                    <Input
                      id={platform}
                      value={socialForm[platform] || ''}
                      onChange={(e) => setSocialForm(prev => ({ ...prev, [platform]: e.target.value }))}
                      placeholder={`Your ${platform} URL`}
                    />
                  </div>
                ))}
              </div>
              <Button onClick={updateSocialLinks} disabled={saving} className={`bg-gradient-to-r ${dashboardColors.primaryButton.gradient} text-white border-0 ${dashboardColors.primaryButton.shadow}`}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Social Links'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customize Tab */}
        <TabsContent value="customize" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme & Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select value={customizationForm.theme} onValueChange={(value) => setCustomizationForm(prev => ({ ...prev, theme: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {THEMES.map(theme => (
                        <SelectItem key={theme.value} value={theme.value}>
                          {theme.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Font Family</Label>
                  <Select value={customizationForm.fontFamily} onValueChange={(value) => setCustomizationForm(prev => ({ ...prev, fontFamily: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FONT_FAMILIES.map(font => (
                        <SelectItem key={font.value} value={font.value}>
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Button Style</Label>
                  <Select value={customizationForm.buttonStyle} onValueChange={(value) => setCustomizationForm(prev => ({ ...prev, buttonStyle: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BUTTON_STYLES.map(style => (
                        <SelectItem key={style.value} value={style.value}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Avatar Shape</Label>
                  <Select value={customizationForm.avatarShape} onValueChange={(value) => setCustomizationForm(prev => ({ ...prev, avatarShape: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="circle">Circle</SelectItem>
                      <SelectItem value="square">Square</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary-color"
                      type="color"
                      value={customizationForm.primaryColor || '#000000'}
                      onChange={(e) => setCustomizationForm(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="h-10 w-20"
                    />
                    <Input
                      value={customizationForm.primaryColor || '#000000'}
                      onChange={(e) => {
                        const value = e.target.value
                        if (/^#[0-9A-Fa-f]{6}$/.test(value) || value === '') {
                          setCustomizationForm(prev => ({ ...prev, primaryColor: value }))
                        }
                      }}
                      placeholder="#000000"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bg-color">Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="bg-color"
                      type="color"
                      value={customizationForm.backgroundColor || '#ffffff'}
                      onChange={(e) => setCustomizationForm(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="h-10 w-20"
                    />
                    <Input
                      value={customizationForm.backgroundColor || '#ffffff'}
                      onChange={(e) => {
                        const value = e.target.value
                        if (/^#[0-9A-Fa-f]{6}$/.test(value) || value === '') {
                          setCustomizationForm(prev => ({ ...prev, backgroundColor: value }))
                        }
                      }}
                      placeholder="#ffffff"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="text-color">Text Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="text-color"
                      type="color"
                      value={customizationForm.textColor || '#000000'}
                      onChange={(e) => setCustomizationForm(prev => ({ ...prev, textColor: e.target.value }))}
                      className="h-10 w-20"
                    />
                    <Input
                      value={customizationForm.textColor || '#000000'}
                      onChange={(e) => {
                        const value = e.target.value
                        if (/^#[0-9A-Fa-f]{6}$/.test(value) || value === '') {
                          setCustomizationForm(prev => ({ ...prev, textColor: value }))
                        }
                      }}
                      placeholder="#000000"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              
              <Button onClick={updateCustomization} disabled={saving} className={`bg-gradient-to-r ${dashboardColors.primaryButton.gradient} text-white border-0 ${dashboardColors.primaryButton.shadow}`}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Customization'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Superlinks Branding</Label>
                  <p className="text-sm text-muted-foreground">Display "Powered by Superlinks" at the bottom</p>
                </div>
                <Switch
                  checked={settingsForm.showBranding}
                  onCheckedChange={(checked) => setSettingsForm(prev => ({ ...prev, showBranding: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Collect Email Addresses</Label>
                  <p className="text-sm text-muted-foreground">Show email signup form on your bio page</p>
                </div>
                <Switch
                  checked={settingsForm.collectEmails}
                  onCheckedChange={(checked) => setSettingsForm(prev => ({ ...prev, collectEmails: checked }))}
                />
              </div>
              
              {settingsForm.collectEmails && (
                <div className="space-y-4 pl-4 border-l-2 border-muted">
                  <div className="space-y-2">
                    <Label htmlFor="email-title">Email Signup Title</Label>
                    <Input
                      id="email-title"
                      value={settingsForm.emailTitle}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, emailTitle: e.target.value }))}
                      placeholder="Stay updated!"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-description">Email Signup Description</Label>
                    <Input
                      id="email-description"
                      value={settingsForm.emailDescription}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, emailDescription: e.target.value }))}
                      placeholder="Subscribe to get my latest updates"
                    />
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Password Protection</Label>
                  <p className="text-sm text-muted-foreground">Require a password to view your bio page</p>
                </div>
                <Switch
                  checked={settingsForm.isPasswordProtected}
                  onCheckedChange={(checked) => setSettingsForm(prev => ({ ...prev, isPasswordProtected: checked }))}
                />
              </div>
              
              {settingsForm.isPasswordProtected && (
                <div className="space-y-2 pl-4 border-l-2 border-muted">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={settingsForm.password}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter password"
                  />
                </div>
              )}
              
              <Button onClick={updateSettings} disabled={saving} className={`bg-gradient-to-r ${dashboardColors.primaryButton.gradient} text-white border-0 ${dashboardColors.primaryButton.shadow}`}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className={`border-0 bg-gradient-to-br ${dashboardColors.views.gradient}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${dashboardColors.views.subtext}`}>Total Views</p>
                    <p className={`text-2xl font-bold ${dashboardColors.views.text}`}>{bio?.analytics?.totalViews || 0}</p>
                  </div>
                  <div className={`h-8 w-8 rounded-full ${dashboardColors.views.icon} flex items-center justify-center`}>
                    <Eye className="h-4 w-4 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className={`border-0 bg-gradient-to-br ${dashboardColors.success.gradient}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${dashboardColors.success.text}`}>Total Clicks</p>
                    <p className={`text-2xl font-bold ${dashboardColors.success.text}`}>{bio?.analytics?.totalClicks || 0}</p>
                  </div>
                  <div className={`h-8 w-8 rounded-full ${dashboardColors.earnings.icon} flex items-center justify-center`}>
                    <LinkIcon className="h-4 w-4 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className={`border-0 bg-gradient-to-br ${dashboardColors.products.gradient}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${dashboardColors.products.subtext}`}>Active Links</p>
                    <p className={`text-2xl font-bold ${dashboardColors.products.text}`}>{bio?.links?.filter(l => l.isActive).length || 0}</p>
                  </div>
                  <div className={`h-8 w-8 rounded-full ${dashboardColors.products.icon} flex items-center justify-center`}>
                    <Settings className="h-4 w-4 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className={`border-0 bg-gradient-to-br ${dashboardColors.warning.gradient}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${dashboardColors.warning.text}`}>Click Rate</p>
                    <p className={`text-2xl font-bold ${dashboardColors.warning.text}`}>
                      {bio?.analytics?.totalViews > 0 
                        ? ((bio.analytics.totalClicks / bio.analytics.totalViews) * 100).toFixed(1)
                        : 0}%
                    </p>
                  </div>
                  <div className={`h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center`}>
                    <BarChart3 className="h-4 w-4 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Link Performance</CardTitle>
            </CardHeader>
            <CardContent>
              {bio?.links?.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No links to analyze</p>
              ) : (
                <div className="space-y-4">
                  {bio?.links?.map((link) => (
                    <div key={link.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{link.title}</h4>
                        <p className="text-sm text-muted-foreground">{link.url}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{link.analytics?.clicks || 0} clicks</p>
                        {link.analytics?.lastClicked && (
                          <p className="text-xs text-muted-foreground">
                            Last: {new Date(link.analytics.lastClicked).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}