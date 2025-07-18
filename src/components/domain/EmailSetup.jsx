import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { FormInput } from '../ui/form-input'
import { Alert } from '../ui/alert'
import { Badge } from '../ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { domainService } from '../../services/domainService'
import { 
  Mail, 
  Plus, 
  Trash2, 
  Loader2, 
  CheckCircle,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react'

export function EmailSetup({ domains }) {
  const [selectedDomain, setSelectedDomain] = useState('')
  const [emailPrefix, setEmailPrefix] = useState('')
  const [customEmails, setCustomEmails] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [copiedEmail, setCopiedEmail] = useState(null)

  const verifiedDomains = domains?.filter(d => d.isVerified && d.isDkimAuthenticated) || []

  useEffect(() => {
    if (selectedDomain) {
      loadCustomEmails()
    }
  }, [selectedDomain, loadCustomEmails])

  const loadCustomEmails = useCallback(async () => {
    try {
      setLoading(true)
      const result = await domainService.getCustomEmails(selectedDomain)
      setCustomEmails(result.emails || [])
    } catch (err) {
      setError(err.message || 'Failed to load custom emails')
    } finally {
      setLoading(false)
    }
  }, [selectedDomain])

  const handleCreateEmail = async (e) => {
    e.preventDefault()
    
    if (!selectedDomain || !emailPrefix.trim()) {
      setError('Please select a domain and enter an email prefix')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await domainService.createCustomEmail(selectedDomain, emailPrefix.trim())
      setSuccess(`Email ${emailPrefix}@${selectedDomain} created successfully!`)
      setEmailPrefix('')
      await loadCustomEmails()
    } catch (err) {
      setError(err.message || 'Failed to create custom email')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEmail = async (emailId) => {
    if (!window.confirm('Are you sure you want to delete this email address?')) {
      return
    }

    try {
      await domainService.deleteCustomEmail(emailId)
      setSuccess('Email address deleted successfully')
      await loadCustomEmails()
    } catch (err) {
      setError(err.message || 'Failed to delete email')
    }
  }

  const copyToClipboard = async (email) => {
    try {
      await navigator.clipboard.writeText(email)
      setCopiedEmail(email)
      setTimeout(() => setCopiedEmail(null), 2000)
    } catch (err) {
      console.error('Failed to copy email: ', err)
    }
  }

  const validateEmailPrefix = (prefix) => {
    const emailRegex = /^[a-zA-Z0-9._-]+$/
    return emailRegex.test(prefix) && prefix.length >= 1 && prefix.length <= 64
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Create Custom Email Address
          </CardTitle>
          <CardDescription>
            Create custom email addresses for your verified domains to use in email campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert className="mb-4">
              <CheckCircle className="h-4 w-4" />
              {success}
            </Alert>
          )}

          {verifiedDomains.length === 0 ? (
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <div>
                <p className="font-medium">No verified domains available</p>
                <p className="text-sm mt-1">
                  You need to add and verify a domain before creating custom email addresses.
                </p>
              </div>
            </Alert>
          ) : (
            <form onSubmit={handleCreateEmail} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Select Domain
                  </label>
                  <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a domain..." />
                    </SelectTrigger>
                    <SelectContent>
                      {verifiedDomains.map((domain) => (
                        <SelectItem key={domain.name} value={domain.name}>
                          {domain.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <FormInput
                  label="Email Prefix"
                  value={emailPrefix}
                  onChange={(e) => setEmailPrefix(e.target.value)}
                  placeholder="support, sales, hello, etc."
                  error={emailPrefix && !validateEmailPrefix(emailPrefix) ? 'Invalid email prefix' : ''}
                  helperText="Only letters, numbers, dots, hyphens, and underscores allowed"
                />
              </div>
              
              {selectedDomain && emailPrefix && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Preview:</p>
                  <p className="font-medium">
                    {emailPrefix}@{selectedDomain}
                  </p>
                </div>
              )}
              
              <Button 
                type="submit" 
                disabled={loading || !selectedDomain || !emailPrefix || !validateEmailPrefix(emailPrefix)}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Email...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Email Address
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {selectedDomain && (
        <Card>
          <CardHeader>
            <CardTitle>Custom Emails for {selectedDomain}</CardTitle>
            <CardDescription>
              Manage your custom email addresses for this domain
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Loading emails...
              </div>
            ) : customEmails.length === 0 ? (
              <div className="text-center py-8">
                <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No custom emails yet</h3>
                <p className="text-muted-foreground">
                  Create your first custom email address above
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {customEmails.map((email) => (
                  <div key={email.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{email.address}</p>
                        <p className="text-sm text-muted-foreground">
                          Created {new Date(email.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant={email.isActive ? 'success' : 'secondary'}>
                        {email.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(email.address)}
                      >
                        {copiedEmail === email.address ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEmail(email.id)}
                        className="text-red-600 hover:text-red-700"
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
      )}

      <Card>
        <CardHeader>
          <CardTitle>Email Usage Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Best Practices</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use descriptive prefixes like "support", "sales", "newsletter"</li>
                <li>• Keep prefixes short and professional</li>
                <li>• Avoid special characters except dots, hyphens, and underscores</li>
                <li>• Consider your brand and communication purpose</li>
              </ul>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Common Email Types</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-green-800">
                <div>• support@yourdomain.com</div>
                <div>• sales@yourdomain.com</div>
                <div>• hello@yourdomain.com</div>
                <div>• newsletter@yourdomain.com</div>
                <div>• info@yourdomain.com</div>
                <div>• noreply@yourdomain.com</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}