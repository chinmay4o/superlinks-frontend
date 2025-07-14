import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { 
  Plus, 
  Mail, 
  MessageSquare, 
  Send, 
  Eye, 
  MousePointer,
  Users,
  Target,
  BarChart3,
  Layers,
  FileText
} from 'lucide-react'
import { useQuery } from 'react-query'

// Import tab components
import LeadsTab from './tabs/LeadsTab'
import SegmentsTab from './tabs/SegmentsTab'
import CampaignsTab from './tabs/CampaignsTab'
// import TemplatesTab from './tabs/TemplatesTab'
// import AnalyticsTab from './tabs/AnalyticsTab'

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005/api'

// Temporary placeholder components

const TemplatesTab = () => (
  <div className="text-center py-12">
    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
    <h3 className="text-lg font-semibold mb-2">Campaign Templates</h3>
    <p className="text-muted-foreground">Pre-built templates for faster campaign creation</p>
  </div>
)

const AnalyticsTab = () => (
  <div className="text-center py-12">
    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
    <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
    <p className="text-muted-foreground">Track performance and ROI across all channels</p>
  </div>
)

export function CommunicationsPage() {
  const [activeTab, setActiveTab] = useState('leads')

  // Get communications overview stats
  const { data: stats } = useQuery('communications-overview', async () => {
    const response = await fetch(`${API_BASE_URL}/communications/stats`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    return response.json()
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Communications</h1>
          <p className="text-muted-foreground">
            Manage leads, create campaigns, and track performance across all channels
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Import Leads
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold">{stats?.totalLeads || 0}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
                <p className="text-2xl font-bold">{stats?.activeCampaigns || 0}</p>
              </div>
              <Send className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Emails Sent</p>
                <p className="text-2xl font-bold">{stats?.totalSent || 0}</p>
              </div>
              <Mail className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Rate</p>
                <p className="text-2xl font-bold">{stats?.averageOpenRate || 0}%</p>
              </div>
              <Eye className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Click Rate</p>
                <p className="text-2xl font-bold">{stats?.averageClickRate || 0}%</p>
              </div>
              <MousePointer className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">₹{stats?.attributedRevenue || 0}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="leads" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Leads</span>
          </TabsTrigger>
          <TabsTrigger value="segments" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Segments</span>
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Campaigns</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Templates</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-6">
          <LeadsTab />
        </TabsContent>

        <TabsContent value="segments" className="space-y-6">
          <SegmentsTab />
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <CampaignsTab />
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Campaign Templates
              </CardTitle>
              <CardDescription>
                Pre-built templates for faster campaign creation and better performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemplatesTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Advanced Analytics
              </CardTitle>
              <CardDescription>
                Track performance, measure ROI, and optimize your marketing efforts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsTab />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}