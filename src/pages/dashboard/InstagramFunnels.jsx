import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Switch } from '../../components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { 
  Plus, 
  Settings, 
  Play, 
  Pause, 
  Edit, 
  Trash2, 
  Copy,
  Target,
  MessageSquare,
  BarChart3,
  Users,
  Clock,
  Zap,
  Eye,
  TestTube,
  Link,
  Search,
  Filter,
  RefreshCw,
  MoreHorizontal,
  Calendar,
  TrendingUp,
  Activity,
  Instagram
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu'
import toast from 'react-hot-toast'

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005/api'

const TRIGGER_MODES = [
  { value: 'keywords', label: 'Keywords', description: 'Trigger on specific keywords' },
  { value: 'all_comments', label: 'All Comments', description: 'Trigger on every comment' },
  { value: 'emoji_only', label: 'Emojis Only', description: 'Trigger only on emoji comments' }
]

const MESSAGE_TYPES = [
  { value: 'text', label: 'Text Message' },
  { value: 'media', label: 'Image/Video' },
  { value: 'carousel', label: 'Carousel' }
]

export function InstagramFunnels() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [funnels, setFunnels] = useState([])
  const [products, setProducts] = useState([])
  const [segments, setSegments] = useState([])
  
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showTestDialog, setShowTestDialog] = useState(false)
  const [editingFunnel, setEditingFunnel] = useState(null)
  const [testingFunnel, setTestingFunnel] = useState(null)
  
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    page: 1,
    limit: 20
  })

  const [funnelForm, setFunnelForm] = useState({
    name: '',
    description: '',
    isActive: true,
    triggerSettings: {
      mode: 'keywords',
      keywords: [{ keyword: '', isExact: false }],
      emojis: [],
      excludeKeywords: [],
      caseSensitive: false
    },
    responseSettings: {
      messageType: 'text',
      messageContent: '',
      mediaUrl: '',
      usePersonalization: true,
      variables: {
        includeUsername: true,
        includePostLink: false,
        customVariables: []
      },
      callToAction: {
        enabled: true,
        text: 'Get it here',
        url: '',
        trackClicks: true
      }
    },
    advancedSettings: {
      responseDelay: 2,
      dailyLimit: 50,
      preventDuplicates: true,
      workingHours: {
        enabled: false,
        startTime: '09:00',
        endTime: '18:00',
        timezone: 'Asia/Kolkata',
        workingDays: []
      },
      abTesting: {
        enabled: false,
        variants: [
          { name: 'Variant A', messageContent: '', percentage: 50 },
          { name: 'Variant B', messageContent: '', percentage: 50 }
        ],
        testDuration: 7,
        winnerCriteria: 'click_rate'
      }
    },
    integration: {
      productId: 'none',
      affiliateCode: '',
      trackRevenue: true,
      leadCapture: {
        enabled: true,
        segmentId: 'none'
      }
    },
    targetPosts: []
  })

  const [testForm, setTestForm] = useState({
    username: 'testuser',
    comment: ''
  })

  useEffect(() => {
    fetchFunnels()
    fetchProducts()
    fetchSegments()
  }, [filters])

  const fetchFunnels = async () => {
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          params.append(key, value)
        }
      })

      const response = await fetch(`${API_BASE_URL}/instagram/funnels?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setFunnels(data.funnels || [])
      } else {
        throw new Error('Failed to fetch funnels')
      }
    } catch (error) {
      console.error('Error fetching funnels:', error)
      toast.error('Failed to load funnels')
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products?limit=100`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const fetchSegments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/segments?limit=100`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setSegments(data.segments || [])
      }
    } catch (error) {
      console.error('Error fetching segments:', error)
    }
  }

  const handleCreateFunnel = async () => {
    try {
      if (!funnelForm.name.trim()) {
        toast.error('Funnel name is required')
        return
      }

      if (!funnelForm.responseSettings.messageContent.trim()) {
        toast.error('Message content is required')
        return
      }

      const response = await fetch(`${API_BASE_URL}/instagram/funnels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(funnelForm)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create funnel')
      }

      toast.success('Funnel created successfully')
      setShowCreateDialog(false)
      resetForm()
      fetchFunnels()
    } catch (error) {
      console.error('Error creating funnel:', error)
      toast.error(error.message)
    }
  }

  const handleUpdateFunnel = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/instagram/funnels/${editingFunnel._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(funnelForm)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update funnel')
      }

      toast.success('Funnel updated successfully')
      setShowEditDialog(false)
      setEditingFunnel(null)
      resetForm()
      fetchFunnels()
    } catch (error) {
      console.error('Error updating funnel:', error)
      toast.error(error.message)
    }
  }

  const handleDeleteFunnel = async (funnelId) => {
    if (!window.confirm('Are you sure you want to delete this funnel?')) {
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/instagram/funnels/${funnelId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete funnel')
      }

      toast.success('Funnel deleted successfully')
      fetchFunnels()
    } catch (error) {
      console.error('Error deleting funnel:', error)
      toast.error('Failed to delete funnel')
    }
  }

  const handleToggleFunnel = async (funnelId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/instagram/funnels/${funnelId}/toggle`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to toggle funnel')
      }

      toast.success('Funnel status updated')
      fetchFunnels()
    } catch (error) {
      console.error('Error toggling funnel:', error)
      toast.error('Failed to update funnel status')
    }
  }

  const handleTestFunnel = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/instagram/funnels/${testingFunnel._id}/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(testForm)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to test funnel')
      }

      const result = await response.json()
      
      if (result.matches) {
        toast.success('Test successful! Comment matches triggers.')
        console.log('Generated message:', result.generatedMessage)
      } else {
        toast.error('Test failed: Comment does not match triggers')
      }
    } catch (error) {
      console.error('Error testing funnel:', error)
      toast.error(error.message)
    }
  }

  const resetForm = () => {
    setFunnelForm({
      name: '',
      description: '',
      isActive: true,
      triggerSettings: {
        mode: 'keywords',
        keywords: [{ keyword: '', isExact: false }],
        emojis: [],
        excludeKeywords: [],
        caseSensitive: false
      },
      responseSettings: {
        messageType: 'text',
        messageContent: '',
        mediaUrl: '',
        usePersonalization: true,
        variables: {
          includeUsername: true,
          includePostLink: false,
          customVariables: []
        },
        callToAction: {
          enabled: true,
          text: 'Get it here',
          url: '',
          trackClicks: true
        }
      },
      advancedSettings: {
        responseDelay: 2,
        dailyLimit: 50,
        preventDuplicates: true,
        workingHours: {
          enabled: false,
          startTime: '09:00',
          endTime: '18:00',
          timezone: 'Asia/Kolkata',
          workingDays: []
        },
        abTesting: {
          enabled: false,
          variants: [
            { name: 'Variant A', messageContent: '', percentage: 50 },
            { name: 'Variant B', messageContent: '', percentage: 50 }
          ],
          testDuration: 7,
          winnerCriteria: 'click_rate'
        }
      },
      integration: {
        productId: 'none',
        affiliateCode: '',
        trackRevenue: true,
        leadCapture: {
          enabled: true,
          segmentId: 'none'
        }
      },
      targetPosts: []
    })
  }

  const addKeyword = () => {
    setFunnelForm(prev => ({
      ...prev,
      triggerSettings: {
        ...prev.triggerSettings,
        keywords: [...prev.triggerSettings.keywords, { keyword: '', isExact: false }]
      }
    }))
  }

  const removeKeyword = (index) => {
    setFunnelForm(prev => ({
      ...prev,
      triggerSettings: {
        ...prev.triggerSettings,
        keywords: prev.triggerSettings.keywords.filter((_, i) => i !== index)
      }
    }))
  }

  const updateKeyword = (index, field, value) => {
    setFunnelForm(prev => ({
      ...prev,
      triggerSettings: {
        ...prev.triggerSettings,
        keywords: prev.triggerSettings.keywords.map((keyword, i) => 
          i === index ? { ...keyword, [field]: value } : keyword
        )
      }
    }))
  }

  const getStatusBadge = (funnel) => {
    if (!funnel.isActive) {
      return <Badge variant="secondary">Inactive</Badge>
    }
    return <Badge variant="default">Active</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading funnels...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Target className="h-8 w-8" />
            Instagram Funnels
          </h1>
          <p className="text-muted-foreground">
            Create automated comment-to-DM funnels for your Instagram posts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate('/dashboard/instagram/settings')}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Funnel
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search funnels..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                className="pl-10"
              />
            </div>
            
            <Select 
              value={filters.status} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, status: value, page: 1 }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={fetchFunnels}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Funnels List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Funnels ({funnels.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {funnels.length === 0 ? (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No funnels found</h3>
              <p className="text-muted-foreground mb-4">
                Create your first funnel to start automating Instagram comments
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Funnel
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Funnel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Triggers</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {funnels.map((funnel) => (
                  <TableRow key={funnel._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{funnel.name}</div>
                        {funnel.description && (
                          <div className="text-sm text-muted-foreground">{funnel.description}</div>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{funnel.targetPosts?.length || 0} posts</Badge>
                          {funnel.advancedSettings?.abTesting?.enabled && (
                            <Badge variant="secondary">A/B Test</Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(funnel)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium capitalize">{funnel.triggerSettings.mode}</div>
                        {funnel.triggerSettings.mode === 'keywords' && (
                          <div className="text-muted-foreground">
                            {funnel.triggerSettings.keywords?.length || 0} keywords
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div>{funnel.stats?.totalTriggers || 0} triggers</div>
                        <div>{funnel.stats?.totalResponses || 0} responses</div>
                        <div>{funnel.stats?.totalClicks || 0} clicks</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {new Date(funnel.lastActivity || funnel.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingFunnel(funnel)
                              setFunnelForm(funnel)
                              setShowEditDialog(true)
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setTestingFunnel(funnel)
                              setShowTestDialog(true)
                            }}
                          >
                            <TestTube className="h-4 w-4 mr-2" />
                            Test
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleFunnel(funnel._id)}>
                            {funnel.isActive ? (
                              <>
                                <Pause className="h-4 w-4 mr-2" />
                                Pause
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4 mr-2" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Analytics
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteFunnel(funnel._id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Funnel Dialog */}
      <Dialog open={showCreateDialog || showEditDialog} onOpenChange={(open) => {
        setShowCreateDialog(false)
        setShowEditDialog(false)
        if (!open) {
          setEditingFunnel(null)
          resetForm()
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingFunnel ? 'Edit Funnel' : 'Create New Funnel'}
            </DialogTitle>
            <DialogDescription>
              Set up automated responses for Instagram comments
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-rose-100 to-pink-100 dark:from-rose-900 dark:to-pink-900 p-1 rounded-lg shadow-md border border-rose-200 dark:border-rose-800">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="triggers">Triggers</TabsTrigger>
              <TabsTrigger value="response">Response</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Funnel Name *</Label>
                  <Input
                    id="name"
                    value={funnelForm.name}
                    onChange={(e) => setFunnelForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Course Promotion Funnel"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isActive">Status</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={funnelForm.isActive}
                      onCheckedChange={(checked) => setFunnelForm(prev => ({ ...prev, isActive: checked }))}
                    />
                    <Label htmlFor="isActive">{funnelForm.isActive ? 'Active' : 'Inactive'}</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={funnelForm.description}
                  onChange={(e) => setFunnelForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this funnel does..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product">Link to Product (Optional)</Label>
                  <Select
                    value={funnelForm.integration.productId}
                    onValueChange={(value) => setFunnelForm(prev => ({
                      ...prev,
                      integration: { ...prev.integration, productId: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No product</SelectItem>
                      {products.map(product => (
                        <SelectItem key={product._id} value={product._id}>
                          {product.title} - ₹{product.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="segment">Add leads to segment</Label>
                  <Select
                    value={funnelForm.integration.leadCapture.segmentId}
                    onValueChange={(value) => setFunnelForm(prev => ({
                      ...prev,
                      integration: {
                        ...prev.integration,
                        leadCapture: { ...prev.integration.leadCapture, segmentId: value }
                      }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a segment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No segment</SelectItem>
                      {segments.map(segment => (
                        <SelectItem key={segment._id} value={segment._id}>
                          {segment.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="triggers" className="space-y-4">
              <div className="space-y-2">
                <Label>Trigger Mode</Label>
                <Select
                  value={funnelForm.triggerSettings.mode}
                  onValueChange={(value) => setFunnelForm(prev => ({
                    ...prev,
                    triggerSettings: { ...prev.triggerSettings, mode: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRIGGER_MODES.map(mode => (
                      <SelectItem key={mode.value} value={mode.value}>
                        <div>
                          <div>{mode.label}</div>
                          <div className="text-xs text-muted-foreground">{mode.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {funnelForm.triggerSettings.mode === 'keywords' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Keywords</Label>
                    <Button size="sm" onClick={addKeyword}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Keyword
                    </Button>
                  </div>
                  
                  {funnelForm.triggerSettings.keywords.map((keyword, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={keyword.keyword}
                        onChange={(e) => updateKeyword(index, 'keyword', e.target.value)}
                        placeholder="Enter keyword"
                        className="flex-1"
                      />
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={keyword.isExact}
                          onCheckedChange={(checked) => updateKeyword(index, 'isExact', checked)}
                        />
                        <Label className="text-sm">Exact</Label>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeKeyword(index)}
                        disabled={funnelForm.triggerSettings.keywords.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {funnelForm.triggerSettings.mode === 'emoji_only' && (
                <div className="space-y-2">
                  <Label htmlFor="emojis">Trigger Emojis</Label>
                  <Input
                    id="emojis"
                    value={funnelForm.triggerSettings.emojis.join(' ')}
                    onChange={(e) => setFunnelForm(prev => ({
                      ...prev,
                      triggerSettings: {
                        ...prev.triggerSettings,
                        emojis: e.target.value.split(' ').filter(emoji => emoji.trim())
                      }
                    }))}
                    placeholder="🔥 💯 👍 (space separated)"
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="response" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="messageContent">Message Content *</Label>
                <Textarea
                  id="messageContent"
                  value={funnelForm.responseSettings.messageContent}
                  onChange={(e) => setFunnelForm(prev => ({
                    ...prev,
                    responseSettings: { ...prev.responseSettings, messageContent: e.target.value }
                  }))}
                  placeholder="Hi {{username}}! Thanks for your comment. Check out my course here..."
                  rows={6}
                />
                <p className="text-sm text-muted-foreground">
                  Use {`{username}`} for personalization. Keep it natural and engaging!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ctaText">Call-to-Action Text</Label>
                  <Input
                    id="ctaText"
                    value={funnelForm.responseSettings.callToAction.text}
                    onChange={(e) => setFunnelForm(prev => ({
                      ...prev,
                      responseSettings: {
                        ...prev.responseSettings,
                        callToAction: { ...prev.responseSettings.callToAction, text: e.target.value }
                      }
                    }))}
                    placeholder="Get it here"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ctaUrl">Call-to-Action URL</Label>
                  <Input
                    id="ctaUrl"
                    value={funnelForm.responseSettings.callToAction.url}
                    onChange={(e) => setFunnelForm(prev => ({
                      ...prev,
                      responseSettings: {
                        ...prev.responseSettings,
                        callToAction: { ...prev.responseSettings.callToAction, url: e.target.value }
                      }
                    }))}
                    placeholder="https://your-product-link.com"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="enableCTA"
                  checked={funnelForm.responseSettings.callToAction.enabled}
                  onCheckedChange={(checked) => setFunnelForm(prev => ({
                    ...prev,
                    responseSettings: {
                      ...prev.responseSettings,
                      callToAction: { ...prev.responseSettings.callToAction, enabled: checked }
                    }
                  }))}
                />
                <Label htmlFor="enableCTA">Include call-to-action link</Label>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="responseDelay">Response Delay (minutes)</Label>
                  <Input
                    id="responseDelay"
                    type="number"
                    min="1"
                    max="60"
                    value={funnelForm.advancedSettings.responseDelay}
                    onChange={(e) => setFunnelForm(prev => ({
                      ...prev,
                      advancedSettings: { ...prev.advancedSettings, responseDelay: parseInt(e.target.value) }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dailyLimit">Daily Limit</Label>
                  <Input
                    id="dailyLimit"
                    type="number"
                    min="1"
                    max="200"
                    value={funnelForm.advancedSettings.dailyLimit}
                    onChange={(e) => setFunnelForm(prev => ({
                      ...prev,
                      advancedSettings: { ...prev.advancedSettings, dailyLimit: parseInt(e.target.value) }
                    }))}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="preventDuplicates"
                  checked={funnelForm.advancedSettings.preventDuplicates}
                  onCheckedChange={(checked) => setFunnelForm(prev => ({
                    ...prev,
                    advancedSettings: { ...prev.advancedSettings, preventDuplicates: checked }
                  }))}
                />
                <Label htmlFor="preventDuplicates">Prevent duplicate responses to same user</Label>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateDialog(false)
                setShowEditDialog(false)
                setEditingFunnel(null)
                resetForm()
              }}
            >
              Cancel
            </Button>
            <Button onClick={editingFunnel ? handleUpdateFunnel : handleCreateFunnel}>
              {editingFunnel ? 'Update Funnel' : 'Create Funnel'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Test Funnel Dialog */}
      <Dialog open={showTestDialog} onOpenChange={setShowTestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Funnel</DialogTitle>
            <DialogDescription>
              Test how your funnel responds to different comments
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="testUsername">Username</Label>
              <Input
                id="testUsername"
                value={testForm.username}
                onChange={(e) => setTestForm(prev => ({ ...prev, username: e.target.value }))}
                placeholder="testuser"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="testComment">Test Comment</Label>
              <Textarea
                id="testComment"
                value={testForm.comment}
                onChange={(e) => setTestForm(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Enter a test comment..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTestDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleTestFunnel}>
              <TestTube className="h-4 w-4 mr-2" />
              Test Funnel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}