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
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  MoreHorizontal,
  Edit,
  Trash2,
  Tag,
  MessageSquare,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Star,
  Activity,
  Calendar,
  Eye,
  RefreshCw
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

const LEAD_SOURCES = [
  { value: 'all', label: 'All Sources' },
  { value: 'manual_upload', label: 'Manual Upload' },
  { value: 'bio_page_signup', label: 'Bio Page Signup' },
  { value: 'product_purchase', label: 'Product Purchase' },
  { value: 'free_download', label: 'Free Download' },
  { value: 'api_import', label: 'API Import' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'referral', label: 'Referral' },
  { value: 'other', label: 'Other' }
]

const LEAD_STATUSES = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'unsubscribed', label: 'Unsubscribed' },
  { value: 'bounced', label: 'Bounced' },
  { value: 'blocked', label: 'Blocked' }
]

const LIFECYCLE_STAGES = [
  { value: 'all', label: 'All Stages' },
  { value: 'subscriber', label: 'Subscriber' },
  { value: 'lead', label: 'Lead' },
  { value: 'opportunity', label: 'Opportunity' },
  { value: 'customer', label: 'Customer' },
  { value: 'advocate', label: 'Advocate' }
]

const LEAD_SCORES = [
  { value: 'all', label: 'All Scores' },
  { value: 'high', label: 'High (70+)' },
  { value: 'medium', label: 'Medium (40-69)' },
  { value: 'low', label: 'Low (0-39)' }
]

const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'name', label: 'Name A-Z' },
  { value: 'email', label: 'Email A-Z' },
  { value: 'score', label: 'Lead Score (High to Low)' },
  { value: 'engagement', label: 'Engagement Score' },
  { value: 'lastActivity', label: 'Last Activity' },
  { value: 'totalSpent', label: 'Total Spent (High to Low)' }
]

export default function LeadsTab() {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    source: 'all',
    lifecycle: 'all',
    country: 'all',
    leadScore: 'all',
    tags: '',
    sort: 'recent',
    page: 1,
    limit: 20
  })

  const [selectedLeads, setSelectedLeads] = useState([])
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [showLeadDetails, setShowLeadDetails] = useState(null)
  const [bulkAction, setBulkAction] = useState('')

  // Lead form state
  const [leadForm, setLeadForm] = useState({
    email: '',
    name: '',
    firstName: '',
    lastName: '',
    mobile: '',
    country: '',
    city: '',
    company: '',
    jobTitle: '',
    source: 'manual_upload',
    tags: []
  })

  // Get leads with filters
  const { data: leadsData, isLoading, refetch } = useQuery(
    ['leads', filters],
    async () => {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          params.append(key, value)
        }
      })

      const response = await fetch(`${API_BASE_URL}/leads?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch leads')
      }

      return response.json()
    },
    {
      keepPreviousData: true
    }
  )

  // Get filter options
  const { data: filterOptions } = useQuery('lead-filter-options', async () => {
    const response = await fetch(`${API_BASE_URL}/leads/filters/options`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    return response.json()
  })

  // Create lead mutation
  const createLeadMutation = useMutation(
    async (leadData) => {
      const response = await fetch(`${API_BASE_URL}/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(leadData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create lead')
      }

      return response.json()
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('leads')
        setShowCreateDialog(false)
        setLeadForm({
          email: '',
          name: '',
          firstName: '',
          lastName: '',
          mobile: '',
          country: '',
          city: '',
          company: '',
          jobTitle: '',
          source: 'manual_upload',
          tags: []
        })
        toast.success('Lead created successfully')
      },
      onError: (error) => {
        toast.error(error.message)
      }
    }
  )

  // Bulk action mutation
  const bulkActionMutation = useMutation(
    async ({ action, leadIds, data }) => {
      const response = await fetch(`${API_BASE_URL}/leads/bulk-action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ action, leadIds, data })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Bulk action failed')
      }

      return response.json()
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('leads')
        setSelectedLeads([])
        setBulkAction('')
        toast.success(data.message)
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
      page: 1 // Reset to first page when filtering
    }))
  }

  const handleSelectLead = (leadId, checked) => {
    if (checked) {
      setSelectedLeads(prev => [...prev, leadId])
    } else {
      setSelectedLeads(prev => prev.filter(id => id !== leadId))
    }
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedLeads(leadsData?.leads.map(lead => lead._id) || [])
    } else {
      setSelectedLeads([])
    }
  }

  const handleBulkAction = () => {
    if (!bulkAction || selectedLeads.length === 0) {
      toast.error('Please select an action and at least one lead')
      return
    }

    let data = {}
    
    // Get additional data based on action
    if (bulkAction === 'addTag') {
      const tag = window.prompt('Enter tag to add:')
      if (!tag) return
      data.tag = tag
    } else if (bulkAction === 'updateStatus') {
      const status = window.prompt('Enter new status (active, unsubscribed, bounced, blocked):')
      if (!status) return
      data.status = status
    }

    bulkActionMutation.mutate({
      action: bulkAction,
      leadIds: selectedLeads,
      data
    })
  }

  const handleCreateLead = () => {
    createLeadMutation.mutate(leadForm)
  }

  const getStatusBadge = (status) => {
    const variants = {
      active: 'default',
      unsubscribed: 'secondary',
      bounced: 'destructive',
      blocked: 'outline'
    }
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getLifecycleBadge = (stage) => {
    const colors = {
      subscriber: 'bg-blue-100 text-blue-800',
      lead: 'bg-yellow-100 text-yellow-800',
      opportunity: 'bg-orange-100 text-orange-800',
      customer: 'bg-green-100 text-green-800',
      advocate: 'bg-purple-100 text-purple-800'
    }
    return (
      <Badge className={colors[stage] || 'bg-gray-100 text-gray-800'}>
        {stage}
      </Badge>
    )
  }

  const getLeadScoreColor = (score) => {
    if (score >= 70) return 'text-green-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : 'N/A'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading leads...</p>
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
            Add Lead
          </Button>
          <Button variant="outline" onClick={() => setShowImportDialog(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
        
        {selectedLeads.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {selectedLeads.length} selected
            </span>
            <Select value={bulkAction} onValueChange={setBulkAction}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Bulk actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="addTag">Add Tag</SelectItem>
                <SelectItem value="removeTag">Remove Tag</SelectItem>
                <SelectItem value="updateStatus">Update Status</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleBulkAction} disabled={!bulkAction}>
              Apply
            </Button>
          </div>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {LEAD_STATUSES.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.source} onValueChange={(value) => handleFilterChange('source', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                {LEAD_SOURCES.map(source => (
                  <SelectItem key={source.value} value={source.value}>
                    {source.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.lifecycle} onValueChange={(value) => handleFilterChange('lifecycle', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Lifecycle" />
              </SelectTrigger>
              <SelectContent>
                {LIFECYCLE_STAGES.map(stage => (
                  <SelectItem key={stage.value} value={stage.value}>
                    {stage.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.leadScore} onValueChange={(value) => handleFilterChange('leadScore', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Lead Score" />
              </SelectTrigger>
              <SelectContent>
                {LEAD_SCORES.map(score => (
                  <SelectItem key={score.value} value={score.value}>
                    {score.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.sort} onValueChange={(value) => handleFilterChange('sort', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      {leadsData?.stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Leads</p>
                  <p className="text-2xl font-bold">{leadsData.stats.totalLeads}</p>
                </div>
                <User className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Leads</p>
                  <p className="text-2xl font-bold">{leadsData.stats.activeLeads}</p>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Lead Score</p>
                  <p className="text-2xl font-bold">{Math.round(leadsData.stats.averageLeadScore)}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">₹{leadsData.stats.totalRevenue?.toLocaleString() || 0}</p>
                </div>
                <Activity className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Leads ({leadsData?.pagination?.total || 0})</span>
            <Button variant="ghost" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {leadsData?.leads?.length === 0 ? (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No leads found</h3>
              <p className="text-muted-foreground mb-4">
                Start building your audience by adding leads or importing from CSV
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Lead
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedLeads.length === leadsData?.leads?.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Lead</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Lifecycle</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leadsData?.leads?.map((lead) => (
                    <TableRow key={lead._id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedLeads.includes(lead._id)}
                          onCheckedChange={(checked) => handleSelectLead(lead._id, checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-primary-foreground text-sm font-medium">
                              {lead.fullName?.charAt(0) || lead.name?.charAt(0) || lead.email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{lead.fullName || lead.name || 'Unnamed'}</div>
                            <div className="text-sm text-muted-foreground">{lead.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {lead.mobile && (
                            <div className="flex items-center text-sm">
                              <Phone className="h-3 w-3 mr-1" />
                              {lead.mobile}
                            </div>
                          )}
                          {lead.company && (
                            <div className="flex items-center text-sm">
                              <Building className="h-3 w-3 mr-1" />
                              {lead.company}
                            </div>
                          )}
                          {lead.country && (
                            <div className="flex items-center text-sm">
                              <MapPin className="h-3 w-3 mr-1" />
                              {lead.country}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(lead.status)}
                      </TableCell>
                      <TableCell>
                        {getLifecycleBadge(lead.lifecycle?.stage)}
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${getLeadScoreColor(lead.leadScore)}`}>
                          {lead.leadScore}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{lead.source}</Badge>
                      </TableCell>
                      <TableCell>
                        {formatDate(lead.engagement?.lastActivity)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setShowLeadDetails(lead)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Add Note
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Tag className="h-4 w-4 mr-2" />
                              Add Tag
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
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
              {leadsData?.pagination?.pages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {((leadsData.pagination.page - 1) * leadsData.pagination.limit) + 1} to{' '}
                    {Math.min(leadsData.pagination.page * leadsData.pagination.limit, leadsData.pagination.total)} of{' '}
                    {leadsData.pagination.total} leads
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={leadsData.pagination.page === 1}
                      onClick={() => handleFilterChange('page', filters.page - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={leadsData.pagination.page === leadsData.pagination.pages}
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

      {/* Create Lead Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
            <DialogDescription>
              Create a new lead in your database
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={leadForm.email}
                onChange={(e) => setLeadForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={leadForm.name}
                onChange={(e) => setLeadForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={leadForm.firstName}
                onChange={(e) => setLeadForm(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="John"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={leadForm.lastName}
                onChange={(e) => setLeadForm(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile</Label>
              <Input
                id="mobile"
                value={leadForm.mobile}
                onChange={(e) => setLeadForm(prev => ({ ...prev, mobile: e.target.value }))}
                placeholder="+1234567890"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={leadForm.company}
                onChange={(e) => setLeadForm(prev => ({ ...prev, company: e.target.value }))}
                placeholder="Acme Inc"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                value={leadForm.jobTitle}
                onChange={(e) => setLeadForm(prev => ({ ...prev, jobTitle: e.target.value }))}
                placeholder="Marketing Manager"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Select value={leadForm.source} onValueChange={(value) => setLeadForm(prev => ({ ...prev, source: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_SOURCES.filter(s => s.value !== 'all').map(source => (
                    <SelectItem key={source.value} value={source.value}>
                      {source.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={leadForm.country}
                onChange={(e) => setLeadForm(prev => ({ ...prev, country: e.target.value }))}
                placeholder="United States"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={leadForm.city}
                onChange={(e) => setLeadForm(prev => ({ ...prev, city: e.target.value }))}
                placeholder="New York"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateLead} disabled={createLeadMutation.isLoading}>
              {createLeadMutation.isLoading ? 'Creating...' : 'Create Lead'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Leads from CSV</DialogTitle>
            <DialogDescription>
              Upload a CSV file to bulk import leads. The file should include columns: email, name, mobile, company, etc.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Drag and drop your CSV file here, or click to browse
              </p>
              <Input type="file" accept=".csv" className="mt-2" />
            </div>

            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">CSV Format Requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>email (required)</li>
                <li>name or firstName/lastName</li>
                <li>mobile, company, country, city (optional)</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              Cancel
            </Button>
            <Button>
              Import Leads
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}