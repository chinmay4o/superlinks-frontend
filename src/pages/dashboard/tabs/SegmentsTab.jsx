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
  Target, 
  Users, 
  Eye, 
  Edit, 
  Trash2, 
  RefreshCw,
  Play,
  Search,
  Filter,
  Settings,
  Copy,
  MoreHorizontal,
  Layers,
  Zap,
  TrendingUp,
  Clock,
  Database
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

const SEGMENT_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'dynamic', label: 'Dynamic' },
  { value: 'static', label: 'Static' }
]

export default function SegmentsTab() {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    page: 1,
    limit: 20
  })

  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showSegmentBuilder, setShowSegmentBuilder] = useState(false)
  const [editingSegment, setEditingSegment] = useState(null)
  const [previewResults, setPreviewResults] = useState(null)
  const [selectedSegments, setSelectedSegments] = useState([])

  // Segment form state
  const [segmentForm, setSegmentForm] = useState({
    name: '',
    description: '',
    type: 'dynamic',
    color: '#3b82f6',
    conditions: {
      operator: 'AND',
      rules: []
    },
    staticLeads: []
  })

  // Segment builder state
  const [builderRules, setBuilderRules] = useState([{
    field: '',
    operator: '',
    value: '',
    secondValue: ''
  }])

  // Get segments with filters
  const { data: segmentsData, isLoading, refetch } = useQuery(
    ['segments', filters],
    async () => {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          params.append(key, value)
        }
      })

      const response = await fetch(`${API_BASE_URL}/segments?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch segments')
      }

      return response.json()
    },
    {
      keepPreviousData: true
    }
  )

  // Get field options for segment builder
  const { data: fieldOptions } = useQuery('segment-field-options', async () => {
    const response = await fetch(`${API_BASE_URL}/segments/field-options`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    return response.json()
  })

  // Create segment mutation
  const createSegmentMutation = useMutation(
    async (segmentData) => {
      const response = await fetch(`${API_BASE_URL}/segments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(segmentData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create segment')
      }

      return response.json()
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('segments')
        setShowCreateDialog(false)
        setShowSegmentBuilder(false)
        resetForm()
        toast.success('Segment created successfully')
      },
      onError: (error) => {
        toast.error(error.message)
      }
    }
  )

  // Preview segment mutation
  const previewSegmentMutation = useMutation(
    async (conditions) => {
      const response = await fetch(`${API_BASE_URL}/segments/temp/preview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ conditions })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to preview segment')
      }

      return response.json()
    },
    {
      onSuccess: (data) => {
        setPreviewResults(data.preview)
      },
      onError: (error) => {
        toast.error(error.message)
      }
    }
  )

  // Delete segment mutation
  const deleteSegmentMutation = useMutation(
    async (segmentId) => {
      const response = await fetch(`${API_BASE_URL}/segments/${segmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to delete segment')
      }

      return response.json()
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('segments')
        toast.success('Segment deleted successfully')
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
    setSegmentForm({
      name: '',
      description: '',
      type: 'dynamic',
      color: '#3b82f6',
      conditions: {
        operator: 'AND',
        rules: []
      },
      staticLeads: []
    })
    setBuilderRules([{
      field: '',
      operator: '',
      value: '',
      secondValue: ''
    }])
    setPreviewResults(null)
    setEditingSegment(null)
  }

  const handleAddRule = () => {
    setBuilderRules(prev => [
      ...prev,
      { field: '', operator: '', value: '', secondValue: '' }
    ])
  }

  const handleRemoveRule = (index) => {
    if (builderRules.length > 1) {
      setBuilderRules(prev => prev.filter((_, i) => i !== index))
    }
  }

  const handleRuleChange = (index, field, value) => {
    setBuilderRules(prev => 
      prev.map((rule, i) => 
        i === index ? { ...rule, [field]: value } : rule
      )
    )
  }

  const handlePreviewSegment = () => {
    const conditions = {
      operator: segmentForm.conditions.operator,
      rules: builderRules.filter(rule => rule.field && rule.operator)
    }

    if (conditions.rules.length === 0) {
      toast.error('Please add at least one rule to preview')
      return
    }

    previewSegmentMutation.mutate(conditions)
  }

  const handleCreateSegment = () => {
    const conditions = {
      operator: segmentForm.conditions.operator,
      rules: builderRules.filter(rule => rule.field && rule.operator)
    }

    if (!segmentForm.name.trim()) {
      toast.error('Segment name is required')
      return
    }

    if (segmentForm.type === 'dynamic' && conditions.rules.length === 0) {
      toast.error('Dynamic segments require at least one rule')
      return
    }

    createSegmentMutation.mutate({
      ...segmentForm,
      conditions: segmentForm.type === 'dynamic' ? conditions : undefined
    })
  }

  const getOperatorOptions = (fieldType) => {
    if (!fieldOptions?.operators) return []

    return fieldOptions.operators.filter(op => 
      op.types.includes(fieldType)
    )
  }

  const getSegmentTypeIcon = (type) => {
    return type === 'dynamic' ? <Zap className="h-4 w-4" /> : <Database className="h-4 w-4" />
  }

  const getSegmentTypeBadge = (type) => {
    const variants = {
      dynamic: 'default',
      static: 'secondary'
    }
    return (
      <Badge variant={variants[type]} className="flex items-center gap-1">
        {getSegmentTypeIcon(type)}
        {type}
      </Badge>
    )
  }

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : 'N/A'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading segments...</p>
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
            Create Segment
          </Button>
          <Button variant="outline" onClick={() => setShowSegmentBuilder(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Segment Builder
          </Button>
          <Button variant="outline">
            <Copy className="h-4 w-4 mr-2" />
            Import from Template
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
                placeholder="Search segments..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {SEGMENT_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
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

      {/* Segments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {segmentsData?.segments?.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No segments found</h3>
            <p className="text-muted-foreground mb-4">
              Create your first audience segment to start targeting your campaigns
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Segment
            </Button>
          </div>
        ) : (
          segmentsData?.segments?.map((segment) => (
            <Card key={segment._id} className="relative hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: segment.color }}
                      />
                      <CardTitle className="text-lg">{segment.name}</CardTitle>
                    </div>
                    {segment.description && (
                      <p className="text-sm text-muted-foreground">{segment.description}</p>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Leads
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh Stats
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => deleteSegmentMutation.mutate(segment._id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  {getSegmentTypeBadge(segment.type)}
                  <div className="text-right">
                    <div className="text-2xl font-bold">{segment.stats?.totalLeads || 0}</div>
                    <div className="text-sm text-muted-foreground">leads</div>
                  </div>
                </div>

                {segment.stats && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Avg. Score</div>
                      <div className="font-medium">{Math.round(segment.stats.averageLeadScore || 0)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Revenue</div>
                      <div className="font-medium">₹{segment.stats.totalRevenue?.toLocaleString() || 0}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Created {formatDate(segment.createdAt)}
                  </div>
                  {segment.lastUsedAt && (
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Used {formatDate(segment.lastUsedAt)}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Play className="h-3 w-3 mr-1" />
                    Use in Campaign
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {segmentsData?.pagination?.pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((segmentsData.pagination.page - 1) * segmentsData.pagination.limit) + 1} to{' '}
            {Math.min(segmentsData.pagination.page * segmentsData.pagination.limit, segmentsData.pagination.total)} of{' '}
            {segmentsData.pagination.total} segments
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={segmentsData.pagination.page === 1}
              onClick={() => handleFilterChange('page', filters.page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={segmentsData.pagination.page === segmentsData.pagination.pages}
              onClick={() => handleFilterChange('page', filters.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Create Segment Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Segment</DialogTitle>
            <DialogDescription>
              Choose how you want to create your audience segment
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Segment Name *</Label>
              <Input
                id="name"
                value={segmentForm.name}
                onChange={(e) => setSegmentForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="High-value customers"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={segmentForm.description}
                onChange={(e) => setSegmentForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Customers who have spent more than ₹5000"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Segment Type</Label>
              <Select 
                value={segmentForm.type} 
                onValueChange={(value) => setSegmentForm(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dynamic">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      <div>
                        <div>Dynamic</div>
                        <div className="text-xs text-muted-foreground">Auto-updates based on rules</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="static">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      <div>
                        <div>Static</div>
                        <div className="text-xs text-muted-foreground">Fixed list of contacts</div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <div className="flex gap-2">
                <Input
                  id="color"
                  type="color"
                  value={segmentForm.color}
                  onChange={(e) => setSegmentForm(prev => ({ ...prev, color: e.target.value }))}
                  className="w-16 h-10"
                />
                <Input
                  value={segmentForm.color}
                  onChange={(e) => setSegmentForm(prev => ({ ...prev, color: e.target.value }))}
                  placeholder="#3b82f6"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            {segmentForm.type === 'dynamic' ? (
              <Button onClick={() => {
                setShowCreateDialog(false)
                setShowSegmentBuilder(true)
              }}>
                Continue to Builder
              </Button>
            ) : (
              <Button onClick={handleCreateSegment} disabled={createSegmentMutation.isLoading}>
                {createSegmentMutation.isLoading ? 'Creating...' : 'Create Segment'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Segment Builder Dialog */}
      <Dialog open={showSegmentBuilder} onOpenChange={setShowSegmentBuilder}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Segment Builder</DialogTitle>
            <DialogDescription>
              Create dynamic rules to automatically segment your audience
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Segment Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Segment Name</Label>
                <Input
                  value={segmentForm.name}
                  onChange={(e) => setSegmentForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="High-value customers"
                />
              </div>
              <div className="space-y-2">
                <Label>Match</Label>
                <Select 
                  value={segmentForm.conditions.operator} 
                  onValueChange={(value) => setSegmentForm(prev => ({ 
                    ...prev, 
                    conditions: { ...prev.conditions, operator: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AND">All conditions (AND)</SelectItem>
                    <SelectItem value="OR">Any condition (OR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Rules Builder */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Conditions</h4>
                <Button size="sm" onClick={handleAddRule}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Rule
                </Button>
              </div>

              {builderRules.map((rule, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-3">
                    <Label>Field</Label>
                    <Select 
                      value={rule.field} 
                      onValueChange={(value) => handleRuleChange(index, 'field', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        {fieldOptions?.fields?.map(category => (
                          <div key={category.category}>
                            <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                              {category.category}
                            </div>
                            {category.fields.map(field => (
                              <SelectItem key={field.value} value={field.value}>
                                {field.label}
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-3">
                    <Label>Operator</Label>
                    <Select 
                      value={rule.operator}
                      onValueChange={(value) => handleRuleChange(index, 'operator', value)}
                      disabled={!rule.field}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select operator" />
                      </SelectTrigger>
                      <SelectContent>
                        {getOperatorOptions(
                          fieldOptions?.fields
                            ?.flatMap(cat => cat.fields)
                            ?.find(f => f.value === rule.field)?.type
                        ).map(op => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2">
                    <Label>Value</Label>
                    <Input
                      value={rule.value}
                      onChange={(e) => handleRuleChange(index, 'value', e.target.value)}
                      placeholder="Enter value"
                      disabled={!rule.operator || ['exists', 'not_exists', 'is_empty', 'is_not_empty'].includes(rule.operator)}
                    />
                  </div>

                  {['between', 'date_between'].includes(rule.operator) && (
                    <div className="col-span-2">
                      <Label>To</Label>
                      <Input
                        value={rule.secondValue}
                        onChange={(e) => handleRuleChange(index, 'secondValue', e.target.value)}
                        placeholder="End value"
                      />
                    </div>
                  )}

                  <div className="col-span-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveRule(index)}
                      disabled={builderRules.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Preview</h4>
                <Button
                  variant="outline"
                  onClick={handlePreviewSegment}
                  disabled={previewSegmentMutation.isLoading}
                >
                  {previewSegmentMutation.isLoading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Eye className="h-4 w-4 mr-2" />
                  )}
                  Preview Results
                </Button>
              </div>

              {previewResults && (
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm">
                      <div className="font-medium mb-2">
                        This segment will include {previewResults.totalCount} leads
                      </div>
                      {previewResults.sampleLeads?.length > 0 && (
                        <div className="space-y-1">
                          <div className="text-muted-foreground">Sample leads:</div>
                          {previewResults.sampleLeads.map((lead, index) => (
                            <div key={index} className="text-xs bg-muted/50 p-2 rounded">
                              {lead.name || 'Unnamed'} ({lead.email}) - Score: {lead.leadScore}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSegmentBuilder(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateSegment} disabled={createSegmentMutation.isLoading}>
              {createSegmentMutation.isLoading ? 'Creating...' : 'Create Segment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}