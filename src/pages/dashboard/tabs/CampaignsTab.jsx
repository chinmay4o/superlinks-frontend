import React, { useState, useEffect } from 'react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Checkbox } from '../../../components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { 
  Plus, 
  Send, 
  Mail, 
  MessageSquare, 
  Phone, 
  Eye, 
  Edit, 
  Trash2, 
  Play,
  Pause,
  Square,
  Copy,
  MoreHorizontal,
  Clock,
  Users,
  TrendingUp,
  Target,
  Zap,
  Calendar,
  RefreshCw,
  Filter,
  Search,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings,
  FileText,
  Split
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu'
import toast from 'react-hot-toast'
import { useQuery, useMutation, useQueryClient } from 'react-query'

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005/api'

const CAMPAIGN_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
  { value: 'sms', label: 'SMS', icon: Phone }
]

const CAMPAIGN_STATUSES = [
  { value: 'all', label: 'All Statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'sending', label: 'Sending' },
  { value: 'sent', label: 'Sent' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' }
]

const SEND_OPTIONS = [
  { value: 'now', label: 'Send Now' },
  { value: 'scheduled', label: 'Schedule for Later' },
  { value: 'auto', label: 'Add to Automation' }
]

export default function CampaignsTab() {
  const queryClient = useQueryClient()
  const [activeView, setActiveView] = useState('list')
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    status: 'all',
    page: 1,
    limit: 20
  })

  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showCampaignBuilder, setShowCampaignBuilder] = useState(false)
  const [selectedCampaigns, setSelectedCampaigns] = useState([])
  const [editingCampaign, setEditingCampaign] = useState(null)

  // Campaign form state
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    type: 'email',
    subject: '',
    content: '',
    segmentIds: [],
    sendOption: 'now',
    scheduledDate: '',
    isAbTest: false,
    abTestSettings: {
      variants: [
        { name: 'Variant A', subject: '', content: '', percentage: 50 },
        { name: 'Variant B', subject: '', content: '', percentage: 50 }
      ],
      winnerCriteria: 'open_rate',
      testDuration: 24
    },
    whatsappSettings: {
      templateName: '',
      mediaType: 'none',
      mediaUrl: '',
      buttons: []
    }
  })

  // Get campaigns with filters
  const { data: campaignsData, isLoading, refetch } = useQuery(
    ['campaigns', filters],
    async () => {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          params.append(key, value)
        }
      })

      const response = await fetch(`${API_BASE_URL}/communications/campaigns?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch campaigns')
      }

      return response.json()
    },
    {
      keepPreviousData: true
    }
  )

  // Get segments for campaign creation
  const { data: segments } = useQuery('segments-for-campaigns', async () => {
    const response = await fetch(`${API_BASE_URL}/segments?limit=100`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    return response.json()
  })

  // Get templates for campaign creation
  const { data: templates } = useQuery('campaign-templates', async () => {
    const response = await fetch(`${API_BASE_URL}/communications/templates`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    return response.json()
  })

  // Create campaign mutation
  const createCampaignMutation = useMutation(
    async (campaignData) => {
      const response = await fetch(`${API_BASE_URL}/communications/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(campaignData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create campaign')
      }

      return response.json()
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('campaigns')
        setShowCreateDialog(false)
        setShowCampaignBuilder(false)
        resetForm()
        toast.success('Campaign created successfully')
      },
      onError: (error) => {
        toast.error(error.message)
      }
    }
  )

  // Send campaign mutation
  const sendCampaignMutation = useMutation(
    async (campaignId) => {
      const response = await fetch(`${API_BASE_URL}/communications/campaigns/${campaignId}/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to send campaign')
      }

      return response.json()
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('campaigns')
        toast.success('Campaign sent successfully')
      },
      onError: (error) => {
        toast.error(error.message)
      }
    }
  )

  // Pause campaign mutation
  const pauseCampaignMutation = useMutation(
    async (campaignId) => {
      const response = await fetch(`${API_BASE_URL}/communications/campaigns/${campaignId}/pause`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to pause campaign')
      }

      return response.json()
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('campaigns')
        toast.success('Campaign paused successfully')
      },
      onError: (error) => {
        toast.error(error.message)
      }
    }
  )

  // Delete campaign mutation
  const deleteCampaignMutation = useMutation(
    async (campaignId) => {
      const response = await fetch(`${API_BASE_URL}/communications/campaigns/${campaignId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to delete campaign')
      }

      return response.json()
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('campaigns')
        toast.success('Campaign deleted successfully')
      },
      onError: (error) => {
        toast.error(error.message)
      }
    }
  )

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }))
  }

  const resetForm = () => {
    setCampaignForm({
      name: '',
      type: 'email',
      subject: '',
      content: '',
      segmentIds: [],
      sendOption: 'now',
      scheduledDate: '',
      isAbTest: false,
      abTestSettings: {
        variants: [
          { name: 'Variant A', subject: '', content: '', percentage: 50 },
          { name: 'Variant B', subject: '', content: '', percentage: 50 }
        ],
        winnerCriteria: 'open_rate',
        testDuration: 24
      },
      whatsappSettings: {
        templateName: '',
        mediaType: 'none',
        mediaUrl: '',
        buttons: []
      }
    })
    setEditingCampaign(null)
  }

  const handleCreateCampaign = () => {
    if (!campaignForm.name.trim()) {
      toast.error('Campaign name is required')
      return
    }

    if (campaignForm.segmentIds.length === 0) {
      toast.error('Please select at least one audience segment')
      return
    }

    if (campaignForm.type === 'email' && !campaignForm.subject.trim()) {
      toast.error('Email subject is required')
      return
    }

    if (!campaignForm.content.trim()) {
      toast.error('Campaign content is required')
      return
    }

    createCampaignMutation.mutate(campaignForm)
  }

  const getStatusBadge = (status) => {
    const variants = {
      draft: { variant: 'secondary', icon: FileText },
      scheduled: { variant: 'outline', icon: Clock },
      sending: { variant: 'default', icon: Send },
      sent: { variant: 'default', icon: CheckCircle },
      paused: { variant: 'destructive', icon: Pause },
      completed: { variant: 'default', icon: CheckCircle }
    }

    const config = variants[status] || { variant: 'secondary', icon: AlertCircle }
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    )
  }

  const getTypeIcon = (type) => {
    const icons = {
      email: Mail,
      whatsapp: MessageSquare,
      sms: Phone
    }
    const Icon = icons[type] || Mail
    return <Icon className="h-4 w-4" />
  }

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : 'N/A'
  }

  const calculateProgress = (campaign) => {
    if (!campaign.stats) return 0
    const total = campaign.stats.totalRecipients || 0
    const sent = campaign.stats.sentCount || 0
    return total > 0 ? Math.round((sent / total) * 100) : 0
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading campaigns...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
          <Button variant="outline" onClick={() => setShowCampaignBuilder(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Campaign Builder
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Use Template
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={activeView === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveView('list')}
          >
            List View
          </Button>
          <Button
            variant={activeView === 'board' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveView('board')}
          >
            Board View
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Campaign Type" />
              </SelectTrigger>
              <SelectContent>
                {CAMPAIGN_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      {type.icon && <type.icon className="h-4 w-4" />}
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {CAMPAIGN_STATUSES.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Content */}
      {activeView === 'list' ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Campaigns ({campaignsData?.pagination?.total || 0})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {campaignsData?.campaigns?.length === 0 ? (
              <div className="text-center py-12">
                <Send className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No campaigns found</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first campaign to start engaging with your audience
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Campaign
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox />
                      </TableHead>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Audience</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Scheduled</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaignsData?.campaigns?.map((campaign) => (
                      <TableRow key={campaign._id}>
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div>
                              <div className="font-medium">{campaign.name}</div>
                              {campaign.subject && (
                                <div className="text-sm text-muted-foreground">{campaign.subject}</div>
                              )}
                              {campaign.isAbTest && (
                                <Badge variant="outline" className="mt-1">
                                  <Split className="h-3 w-3 mr-1" />
                                  A/B Test
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(campaign.type)}
                            <span className="capitalize">{campaign.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(campaign.status)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{campaign.stats?.totalRecipients || 0} recipients</div>
                            <div className="text-muted-foreground">
                              {campaign.segmentNames?.join(', ') || 'No segments'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {campaign.stats && (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Eye className="h-3 w-3" />
                                {campaign.stats.openRate || 0}% opened
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Target className="h-3 w-3" />
                                {campaign.stats.clickRate || 0}% clicked
                              </div>
                              {campaign.status === 'sending' && (
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                                    style={{ width: `${calculateProgress(campaign)}%` }}
                                  ></div>
                                </div>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {campaign.scheduledDate ? (
                              <>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDate(campaign.scheduledDate)}
                                </div>
                                <div className="text-muted-foreground">
                                  {new Date(campaign.scheduledDate).toLocaleTimeString()}
                                </div>
                              </>
                            ) : (
                              <span className="text-muted-foreground">Not scheduled</span>
                            )}
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
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {campaign.status === 'draft' && (
                                <DropdownMenuItem 
                                  onClick={() => sendCampaignMutation.mutate(campaign._id)}
                                >
                                  <Play className="h-4 w-4 mr-2" />
                                  Send Now
                                </DropdownMenuItem>
                              )}
                              {campaign.status === 'sending' && (
                                <DropdownMenuItem 
                                  onClick={() => pauseCampaignMutation.mutate(campaign._id)}
                                >
                                  <Pause className="h-4 w-4 mr-2" />
                                  Pause
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => deleteCampaignMutation.mutate(campaign._id)}
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

                {/* Pagination */}
                {campaignsData?.pagination?.pages > 1 && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Showing {((campaignsData.pagination.page - 1) * campaignsData.pagination.limit) + 1} to{' '}
                      {Math.min(campaignsData.pagination.page * campaignsData.pagination.limit, campaignsData.pagination.total)} of{' '}
                      {campaignsData.pagination.total} campaigns
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={campaignsData.pagination.page === 1}
                        onClick={() => handleFilterChange('page', filters.page - 1)}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={campaignsData.pagination.page === campaignsData.pagination.pages}
                        onClick={() => handleFilterChange('page', filters.page + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        // Board View - Kanban style
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {CAMPAIGN_STATUSES.filter(s => s.value !== 'all').map(status => (
            <Card key={status.value}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  {status.label}
                  <Badge variant="secondary">
                    {campaignsData?.campaigns?.filter(c => c.status === status.value).length || 0}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {campaignsData?.campaigns
                  ?.filter(campaign => campaign.status === status.value)
                  ?.map(campaign => (
                    <Card key={campaign._id} className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-sm truncate">{campaign.name}</div>
                          {getTypeIcon(campaign.type)}
                        </div>
                        {campaign.subject && (
                          <div className="text-xs text-muted-foreground truncate">{campaign.subject}</div>
                        )}
                        <div className="flex items-center justify-between text-xs">
                          <span>{campaign.stats?.totalRecipients || 0} recipients</span>
                          {campaign.stats && (
                            <span>{campaign.stats.openRate || 0}% open</span>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Campaign Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
            <DialogDescription>
              Choose your campaign type and get started
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name *</Label>
              <Input
                id="name"
                value={campaignForm.name}
                onChange={(e) => setCampaignForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Weekly Newsletter"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Campaign Type</Label>
              <Select 
                value={campaignForm.type} 
                onValueChange={(value) => setCampaignForm(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CAMPAIGN_TYPES.filter(t => t.value !== 'all').map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        {type.icon && <type.icon className="h-4 w-4" />}
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="segments">Target Audience *</Label>
              <Select 
                value={campaignForm.segmentIds[0] || ''} 
                onValueChange={(value) => setCampaignForm(prev => ({ 
                  ...prev, 
                  segmentIds: value ? [value] : [] 
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select audience segment" />
                </SelectTrigger>
                <SelectContent>
                  {segments?.segments?.map(segment => (
                    <SelectItem key={segment._id} value={segment._id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: segment.color }}
                        />
                        {segment.name} ({segment.stats?.totalLeads || 0} leads)
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="abTest" 
                checked={campaignForm.isAbTest}
                onCheckedChange={(checked) => setCampaignForm(prev => ({ ...prev, isAbTest: checked }))}
              />
              <Label htmlFor="abTest" className="text-sm">
                Enable A/B Testing
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setShowCreateDialog(false)
              setShowCampaignBuilder(true)
            }}>
              Continue to Builder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Campaign Builder Dialog */}
      <Dialog open={showCampaignBuilder} onOpenChange={setShowCampaignBuilder}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Campaign Builder</DialogTitle>
            <DialogDescription>
              Design and configure your {campaignForm.type} campaign
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900 dark:to-orange-900 p-1 rounded-lg shadow-md border border-amber-200 dark:border-amber-800">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="audience">Audience</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              {campaignForm.type === 'email' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Email Subject *</Label>
                    <Input
                      id="subject"
                      value={campaignForm.subject}
                      onChange={(e) => setCampaignForm(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Your weekly update is here!"
                    />
                  </div>

                  {campaignForm.isAbTest && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Variant A Subject</Label>
                        <Input
                          value={campaignForm.abTestSettings.variants[0]?.subject || ''}
                          onChange={(e) => setCampaignForm(prev => ({
                            ...prev,
                            abTestSettings: {
                              ...prev.abTestSettings,
                              variants: prev.abTestSettings.variants.map((v, i) => 
                                i === 0 ? { ...v, subject: e.target.value } : v
                              )
                            }
                          }))}
                          placeholder="Subject variant A"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Variant B Subject</Label>
                        <Input
                          value={campaignForm.abTestSettings.variants[1]?.subject || ''}
                          onChange={(e) => setCampaignForm(prev => ({
                            ...prev,
                            abTestSettings: {
                              ...prev.abTestSettings,
                              variants: prev.abTestSettings.variants.map((v, i) => 
                                i === 1 ? { ...v, subject: e.target.value } : v
                              )
                            }
                          }))}
                          placeholder="Subject variant B"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="content">Message Content *</Label>
                <Textarea
                  id="content"
                  value={campaignForm.content}
                  onChange={(e) => setCampaignForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your message here..."
                  rows={10}
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-1" />
                  Use Template
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="audience" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Selected Segments</Label>
                  <div className="mt-2 space-y-2">
                    {segments?.segments
                      ?.filter(segment => campaignForm.segmentIds.includes(segment._id))
                      ?.map(segment => (
                        <div key={segment._id} className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: segment.color }}
                            />
                            <span>{segment.name}</span>
                            <Badge variant="outline">{segment.stats?.totalLeads || 0} leads</Badge>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setCampaignForm(prev => ({
                              ...prev,
                              segmentIds: prev.segmentIds.filter(id => id !== segment._id)
                            }))}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <Label>Add More Segments</Label>
                  <Select 
                    value="" 
                    onValueChange={(value) => {
                      if (!campaignForm.segmentIds.includes(value)) {
                        setCampaignForm(prev => ({ 
                          ...prev, 
                          segmentIds: [...prev.segmentIds, value] 
                        }))
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select additional segments" />
                    </SelectTrigger>
                    <SelectContent>
                      {segments?.segments
                        ?.filter(segment => !campaignForm.segmentIds.includes(segment._id))
                        ?.map(segment => (
                          <SelectItem key={segment._id} value={segment._id}>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: segment.color }}
                              />
                              {segment.name} ({segment.stats?.totalLeads || 0} leads)
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-muted/50 p-4 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">Total Audience</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {segments?.segments
                      ?.filter(segment => campaignForm.segmentIds.includes(segment._id))
                      ?.reduce((total, segment) => total + (segment.stats?.totalLeads || 0), 0) || 0} recipients
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Send Options</Label>
                  <Select 
                    value={campaignForm.sendOption} 
                    onValueChange={(value) => setCampaignForm(prev => ({ ...prev, sendOption: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SEND_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {campaignForm.sendOption === 'scheduled' && (
                  <div className="space-y-2">
                    <Label htmlFor="scheduledDate">Schedule Date & Time</Label>
                    <Input
                      id="scheduledDate"
                      type="datetime-local"
                      value={campaignForm.scheduledDate}
                      onChange={(e) => setCampaignForm(prev => ({ ...prev, scheduledDate: e.target.value }))}
                    />
                  </div>
                )}

                {campaignForm.isAbTest && (
                  <div className="space-y-4">
                    <h4 className="font-medium">A/B Test Settings</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Winner Criteria</Label>
                        <Select 
                          value={campaignForm.abTestSettings.winnerCriteria} 
                          onValueChange={(value) => setCampaignForm(prev => ({
                            ...prev,
                            abTestSettings: { ...prev.abTestSettings, winnerCriteria: value }
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open_rate">Open Rate</SelectItem>
                            <SelectItem value="click_rate">Click Rate</SelectItem>
                            <SelectItem value="conversion_rate">Conversion Rate</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Test Duration (hours)</Label>
                        <Input
                          type="number"
                          value={campaignForm.abTestSettings.testDuration}
                          onChange={(e) => setCampaignForm(prev => ({
                            ...prev,
                            abTestSettings: { ...prev.abTestSettings, testDuration: parseInt(e.target.value) }
                          }))}
                          min="1"
                          max="168"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="review" className="space-y-4">
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Campaign Summary</h4>
                  <div className="bg-muted/50 p-4 rounded space-y-2">
                    <div className="flex justify-between">
                      <span>Name:</span>
                      <span className="font-medium">{campaignForm.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="font-medium capitalize">{campaignForm.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Recipients:</span>
                      <span className="font-medium">
                        {segments?.segments
                          ?.filter(segment => campaignForm.segmentIds.includes(segment._id))
                          ?.reduce((total, segment) => total + (segment.stats?.totalLeads || 0), 0) || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Send Option:</span>
                      <span className="font-medium">{SEND_OPTIONS.find(o => o.value === campaignForm.sendOption)?.label}</span>
                    </div>
                    {campaignForm.isAbTest && (
                      <div className="flex justify-between">
                        <span>A/B Test:</span>
                        <Badge>Enabled</Badge>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Content Preview</h4>
                  <div className="border rounded p-4 bg-white">
                    {campaignForm.type === 'email' && campaignForm.subject && (
                      <div className="font-medium mb-2 pb-2 border-b">
                        Subject: {campaignForm.subject}
                      </div>
                    )}
                    <div className="whitespace-pre-wrap text-sm">
                      {campaignForm.content || 'No content added yet...'}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCampaignBuilder(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCampaign} disabled={createCampaignMutation.isLoading}>
              {createCampaignMutation.isLoading ? 'Creating...' : 
               campaignForm.sendOption === 'now' ? 'Create & Send' : 'Create Campaign'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}