import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Switch } from '../../components/ui/switch'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Separator } from '../../components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert'
import { 
  Instagram, 
  Settings, 
  Link2, 
  Unlink, 
  RefreshCw,
  AlertCircle,
  Check,
  Shield,
  Zap,
  BarChart3
} from 'lucide-react'
import toast from 'react-hot-toast'

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005/api'

export function InstagramSettings() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [savingSettings, setSavingSettings] = useState(false)
  
  const [account, setAccount] = useState(null)
  const [settings, setSettings] = useState({
    autoRespond: true,
    responseDelay: 5,
    dailyLimit: 100,
    workingHours: {
      enabled: false,
      startTime: '09:00',
      endTime: '18:00',
      timezone: 'Asia/Kolkata'
    }
  })
  
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    fetchAccountData()
    fetchAnalytics()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAccountData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/instagram/account`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setAccount(data.account)
        setSettings(data.account.settings || settings)
      } else if (response.status === 404) {
        setAccount(null)
      }
    } catch (error) {
      console.error('Error fetching Instagram account:', error)
      toast.error('Failed to load Instagram account')
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/instagram/analytics/overview?period=30`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setAnalytics(data.analytics)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }

  const handleConnect = async () => {
    try {
      setConnecting(true)
      
      const response = await fetch(`${API_BASE_URL}/instagram/auth/url`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to get authorization URL')
      }

      const data = await response.json()
      
      // Open Instagram OAuth in new window
      const authWindow = window.open(data.authUrl, 'instagram-auth', 'width=500,height=600')
      
      // Listen for messages from callback window
      const handleMessage = (event) => {
        if (event.origin !== window.location.origin) return
        
        if (event.data.type === 'INSTAGRAM_AUTH_SUCCESS') {
          setConnecting(false)
          toast.success(`Successfully connected Instagram account @${event.data.data.username}`)
          fetchAccountData()
          window.removeEventListener('message', handleMessage)
        } else if (event.data.type === 'INSTAGRAM_AUTH_ERROR') {
          setConnecting(false)
          toast.error(event.data.error || 'Failed to connect Instagram account')
          window.removeEventListener('message', handleMessage)
        }
      }
      
      window.addEventListener('message', handleMessage)
      
      // Fallback: Check if window was closed without message
      const checkAuth = setInterval(() => {
        if (authWindow.closed) {
          clearInterval(checkAuth)
          window.removeEventListener('message', handleMessage)
          if (connecting) {
            setConnecting(false)
            fetchAccountData() // Refresh data in case connection succeeded
          }
        }
      }, 1000)

    } catch (error) {
      console.error('Error connecting Instagram:', error)
      toast.error('Failed to connect Instagram account')
      setConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    if (!window.confirm('Are you sure you want to disconnect your Instagram account? This will deactivate all your funnels.')) {
      return
    }

    try {
      setDisconnecting(true)
      
      const response = await fetch(`${API_BASE_URL}/instagram/auth/disconnect`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to disconnect Instagram account')
      }

      toast.success('Instagram account disconnected')
      setAccount(null)
      setAnalytics(null)
    } catch (error) {
      console.error('Error disconnecting Instagram:', error)
      toast.error('Failed to disconnect Instagram account')
    } finally {
      setDisconnecting(false)
    }
  }

  const handleRefresh = async () => {
    try {
      setRefreshing(true)
      await fetchAccountData()
      await fetchAnalytics()
      toast.success('Instagram data refreshed')
    } catch (error) {
      toast.error('Failed to refresh data')
    } finally {
      setRefreshing(false)
    }
  }

  const handleSettingsChange = (key, value) => {
    if (key.includes('.')) {
      const keys = key.split('.')
      setSettings(prev => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]],
          [keys[1]]: value
        }
      }))
    } else {
      setSettings(prev => ({ ...prev, [key]: value }))
    }
  }

  const handleSaveSettings = async () => {
    try {
      setSavingSettings(true)
      
      const response = await fetch(`${API_BASE_URL}/instagram/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(settings)
      })

      if (!response.ok) {
        throw new Error('Failed to save settings')
      }

      toast.success('Settings saved successfully')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setSavingSettings(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Instagram settings...</p>
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
            <Instagram className="h-8 w-8" />
            Instagram Automation
          </h1>
          <p className="text-muted-foreground">
            Connect your Instagram account and automate comment responses
          </p>
        </div>
        {account && (
          <Button onClick={handleRefresh} variant="outline" disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        )}
      </div>

      {/* Account Connection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Instagram Account
          </CardTitle>
          <CardDescription>
            Connect your Instagram Business or Creator account to enable automation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {account ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={account.profilePicture || '/placeholder-avatar.png'}
                    alt={account.username}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">@{account.username}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{account.followersCount?.toLocaleString() || 0} followers</span>
                      <span>{account.mediaCount?.toLocaleString() || 0} posts</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{account.accountType}</Badge>
                      {account.webhookSubscribed ? (
                        <Badge variant="default" className="bg-green-600">
                          <Check className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Webhook Inactive
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  onClick={handleDisconnect}
                  disabled={disconnecting}
                >
                  <Unlink className="h-4 w-4 mr-2" />
                  {disconnecting ? 'Disconnecting...' : 'Disconnect'}
                </Button>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Connected</p>
                  <p className="font-medium">
                    {new Date(account.connectedAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Synced</p>
                  <p className="font-medium">
                    {new Date(account.lastSyncAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Instagram className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Instagram Account Connected</h3>
              <p className="text-muted-foreground mb-4">
                Connect your Instagram Business or Creator account to start automating
              </p>
              <Button onClick={handleConnect} disabled={connecting}>
                <Link2 className="h-4 w-4 mr-2" />
                {connecting ? 'Connecting...' : 'Connect Instagram'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {account && (
        <>
          {/* Automation Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Automation Settings
              </CardTitle>
              <CardDescription>
                Configure how your automated responses work
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="autoRespond">Auto-Respond to Comments</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically send DMs when comments match your funnel triggers
                  </p>
                </div>
                <Switch
                  id="autoRespond"
                  checked={settings.autoRespond}
                  onCheckedChange={(checked) => handleSettingsChange('autoRespond', checked)}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="responseDelay">Response Delay (minutes)</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="responseDelay"
                      type="number"
                      min="1"
                      max="60"
                      value={settings.responseDelay}
                      onChange={(e) => handleSettingsChange('responseDelay', parseInt(e.target.value))}
                      className="w-24"
                    />
                    <span className="text-sm text-muted-foreground">
                      Wait before sending automated DM
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dailyLimit">Daily DM Limit</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="dailyLimit"
                      type="number"
                      min="10"
                      max="500"
                      value={settings.dailyLimit}
                      onChange={(e) => handleSettingsChange('dailyLimit', parseInt(e.target.value))}
                      className="w-24"
                    />
                    <span className="text-sm text-muted-foreground">
                      Maximum DMs to send per day
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="workingHours">Working Hours</Label>
                    <p className="text-sm text-muted-foreground">
                      Only send DMs during specified hours
                    </p>
                  </div>
                  <Switch
                    id="workingHours"
                    checked={settings.workingHours.enabled}
                    onCheckedChange={(checked) => handleSettingsChange('workingHours.enabled', checked)}
                  />
                </div>

                {settings.workingHours.enabled && (
                  <div className="grid grid-cols-3 gap-4 pl-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={settings.workingHours.startTime}
                        onChange={(e) => handleSettingsChange('workingHours.startTime', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={settings.workingHours.endTime}
                        onChange={(e) => handleSettingsChange('workingHours.endTime', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        value={settings.workingHours.timezone}
                        onValueChange={(value) => handleSettingsChange('workingHours.timezone', value)}
                      >
                        <SelectTrigger id="timezone">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
                          <SelectItem value="America/New_York">America/New_York</SelectItem>
                          <SelectItem value="America/Los_Angeles">America/Los_Angeles</SelectItem>
                          <SelectItem value="Europe/London">Europe/London</SelectItem>
                          <SelectItem value="Australia/Sydney">Australia/Sydney</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSettings} disabled={savingSettings}>
                  {savingSettings ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Overview */}
          {analytics && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Overview
                </CardTitle>
                <CardDescription>
                  Last 30 days of automation performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Active Funnels</p>
                    <p className="text-2xl font-bold">{analytics.funnels.activeFunnels}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Comments Received</p>
                    <p className="text-2xl font-bold">{analytics.funnels.totalTriggers}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">DMs Sent</p>
                    <p className="text-2xl font-bold">{analytics.funnels.totalResponses}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Link Clicks</p>
                    <p className="text-2xl font-bold">{analytics.funnels.totalClicks}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Conversions</p>
                    <p className="text-2xl font-bold">{analytics.funnels.totalConversions}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-2xl font-bold">₹{analytics.funnels.totalRevenue?.toLocaleString() || 0}</p>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {analytics.calculated.responseRate}%
                    </div>
                    <p className="text-sm text-muted-foreground">Response Rate</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {analytics.calculated.clickThroughRate}%
                    </div>
                    <p className="text-sm text-muted-foreground">Click-Through Rate</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {analytics.calculated.conversionRate}%
                    </div>
                    <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/dashboard/instagram/funnels')}
                  >
                    View Funnels
                    <Zap className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Help & Tips */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertTitle>Instagram Automation Guidelines</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Always respect Instagram's Community Guidelines and Terms of Service</li>
                <li>Avoid spammy or repetitive messages</li>
                <li>Keep response delays natural (2-10 minutes recommended)</li>
                <li>Monitor your daily limits to avoid rate limiting</li>
                <li>Test your funnels before activating them</li>
              </ul>
            </AlertDescription>
          </Alert>
        </>
      )}
    </div>
  )
}