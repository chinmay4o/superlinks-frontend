import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Switch } from '../../components/ui/switch'
import { Separator } from '../../components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { 
  User, 
  Lock, 
  Check, 
  X, 
  Eye, 
  EyeOff,
  AlertCircle,
  ExternalLink
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useAuth } from '../../contexts/AuthContext'
import { toast } from 'react-hot-toast'
import { debounce } from 'lodash'
import { dashboardColors } from '../../lib/dashboardColors'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5005/api'

const api = {
  getProfile: () => fetch(`${API_URL}/users/profile`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  }).then(res => res.json()),
  
  updateProfile: (data) => fetch(`${API_URL}/users/profile`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  
  updateSettings: (data) => fetch(`${API_URL}/users/settings`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  
  changePassword: (data) => fetch(`${API_URL}/users/change-password`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  
  checkUsername: (username) => fetch(`${API_URL}/users/check-username/${username}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  }).then(res => res.json())
}

export function ProfileSettingsPage() {
  const { user, updateUser } = useAuth()
  const queryClient = useQueryClient()
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    name: '',
    username: '',
    bio: '',
    website: '',
    avatar: ''
  })
  
  const [settingsForm, setSettingsForm] = useState({
    emailNotifications: true,
    profilePublic: true,
    showEarnings: false
  })
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  
  const [usernameStatus, setUsernameStatus] = useState({
    checking: false,
    available: null,
    message: ''
  })
  
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  
  // Queries
  const { data: profileData, isLoading } = useQuery('user-profile', api.getProfile, {
    onSuccess: (data) => {
      const userData = data.user
      setProfileForm({
        name: userData.name || '',
        username: userData.username || '',
        bio: userData.bio || '',
        website: userData.website || '',
        avatar: userData.avatar || ''
      })
      setSettingsForm({
        emailNotifications: userData.settings?.emailNotifications ?? true,
        profilePublic: userData.settings?.profilePublic ?? true,
        showEarnings: userData.settings?.showEarnings ?? false
      })
    }
  })
  
  // Mutations
  const updateProfileMutation = useMutation(api.updateProfile, {
    onSuccess: (data) => {
      queryClient.invalidateQueries('user-profile')
      updateUser(data.user)
      toast.success('Profile updated successfully')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update profile')
    }
  })
  
  const updateSettingsMutation = useMutation(api.updateSettings, {
    onSuccess: (data) => {
      queryClient.invalidateQueries('user-profile')
      updateUser(data.user)
      toast.success('Settings updated successfully')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update settings')
    }
  })
  
  const changePasswordMutation = useMutation(api.changePassword, {
    onSuccess: () => {
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setShowPasswordDialog(false)
      toast.success('Password changed successfully')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to change password')
    }
  })
  
  // Debounced username check
  const checkUsernameDebounced = debounce(async (username) => {
    if (!username || username.length < 3) {
      setUsernameStatus({ checking: false, available: null, message: '' })
      return
    }
    
    if (username === profileData?.user?.username) {
      setUsernameStatus({ checking: false, available: true, message: 'Current username' })
      return
    }
    
    setUsernameStatus({ checking: true, available: null, message: 'Checking...' })
    
    try {
      const result = await api.checkUsername(username)
      setUsernameStatus({
        checking: false,
        available: result.available,
        message: result.available ? 'Username available' : 'Username taken'
      })
    } catch (error) {
      setUsernameStatus({
        checking: false,
        available: false,
        message: 'Error checking username'
      })
    }
  }, 500)
  
  useEffect(() => {
    checkUsernameDebounced(profileForm.username)
  }, [profileForm.username])
  
  const handleProfileSubmit = (e) => {
    e.preventDefault()
    updateProfileMutation.mutate(profileForm)
  }
  
  const handleSettingsChange = (key, value) => {
    const newSettings = { ...settingsForm, [key]: value }
    setSettingsForm(newSettings)
    updateSettingsMutation.mutate({ [key]: value })
  }
  
  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }
    
    changePasswordMutation.mutate({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    })
  }
  
  const getProfileUrl = () => {
    const baseUrl = window.location.origin
    return profileForm.username ? `${baseUrl}/${profileForm.username}` : `${baseUrl}/user/${user?._id}`
  }
  
  if (isLoading) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile information and account settings
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 p-1 rounded-lg shadow-md border border-violet-200 dark:border-violet-800">
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Eye className="mr-2 h-4 w-4" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your profile details that will be visible to customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profileForm.avatar} alt={profileForm.name} />
                    <AvatarFallback className="text-lg">
                      {profileForm.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Label>Profile Photo</Label>
                    <Input
                      type="url"
                      placeholder="Enter image URL"
                      value={profileForm.avatar}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, avatar: e.target.value }))}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter a URL to your profile image
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <Input
                        id="username"
                        value={profileForm.username}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, username: e.target.value.toLowerCase() }))}
                        placeholder="your-username"
                        className={usernameStatus.available === false ? 'border-red-500' : usernameStatus.available === true ? 'border-green-500' : ''}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {usernameStatus.checking && (
                          <div className="animate-spin h-4 w-4 border-2 border-muted border-t-primary rounded-full"></div>
                        )}
                        {!usernameStatus.checking && usernameStatus.available === true && (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                        {!usernameStatus.checking && usernameStatus.available === false && (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                    <p className={`text-xs mt-1 ${
                      usernameStatus.available === false ? 'text-red-600' : 
                      usernameStatus.available === true ? 'text-green-600' : 
                      'text-muted-foreground'
                    }`}>
                      {usernameStatus.message || 'Choose a unique username for your profile URL'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell people about yourself..."
                    rows={3}
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {profileForm.bio.length}/500 characters
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={profileForm.website}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                
                {/* Profile URL Preview */}
                {profileForm.username && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <Label className="text-sm font-medium">Your Profile URL</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="text-sm bg-background px-2 py-1 rounded">
                        {getProfileUrl()}
                      </code>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(getProfileUrl(), '_blank')}
                        className="hover:bg-purple-50 hover:border-purple-300"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  disabled={updateProfileMutation.isLoading || usernameStatus.available === false}
                  className={`bg-gradient-to-r ${dashboardColors.primaryButton.gradient} text-white border-0 ${dashboardColors.primaryButton.shadow}`}
                >
                  {updateProfileMutation.isLoading ? 'Updating...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control who can see your information and how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive emails about new purchases and important updates
                  </p>
                </div>
                <Switch
                  checked={settingsForm.emailNotifications}
                  onCheckedChange={(checked) => handleSettingsChange('emailNotifications', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Public Profile</Label>
                  <p className="text-sm text-muted-foreground">
                    Make your profile page visible to everyone
                  </p>
                </div>
                <Switch
                  checked={settingsForm.profilePublic}
                  onCheckedChange={(checked) => handleSettingsChange('profilePublic', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Earnings</Label>
                  <p className="text-sm text-muted-foreground">
                    Display your total earnings on your public profile
                  </p>
                </div>
                <Switch
                  checked={settingsForm.showEarnings}
                  onCheckedChange={(checked) => handleSettingsChange('showEarnings', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>
                Manage your account security and password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Password</Label>
                  <p className="text-sm text-muted-foreground">
                    Change your account password
                  </p>
                </div>
                <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="hover:bg-purple-50 hover:border-purple-300">
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>
                        Enter your current password and choose a new one
                      </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="current-password">Current Password</Label>
                        <div className="relative">
                          <Input
                            id="current-password"
                            type={showPasswords.current ? 'text' : 'password'}
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-gray-100"
                            onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                          >
                            {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="new-password">New Password</Label>
                        <div className="relative">
                          <Input
                            id="new-password"
                            type={showPasswords.new ? 'text' : 'password'}
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                            required
                            minLength={6}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-gray-100"
                            onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                          >
                            {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <div className="relative">
                          <Input
                            id="confirm-password"
                            type={showPasswords.confirm ? 'text' : 'password'}
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            required
                            minLength={6}
                            className={passwordForm.newPassword && passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword ? 'border-red-500' : ''}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-gray-100"
                            onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                          >
                            {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        {passwordForm.newPassword && passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                          <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
                        )}
                      </div>
                    </form>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowPasswordDialog(false)} className="hover:bg-gray-50">
                        Cancel
                      </Button>
                      <Button 
                        onClick={handlePasswordSubmit}
                        disabled={changePasswordMutation.isLoading || !passwordForm.currentPassword || !passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword}
                        className={`bg-gradient-to-r ${dashboardColors.primaryButton.gradient} text-white border-0 ${dashboardColors.primaryButton.shadow}`}
                      >
                        {changePasswordMutation.isLoading ? 'Changing...' : 'Change Password'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              <Separator />
              
              <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Account Security Tips</p>
                  <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                    <li>• Use a strong, unique password</li>
                    <li>• Don't share your account credentials</li>
                    <li>• Keep your email address secure</li>
                    <li>• Log out from shared devices</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}