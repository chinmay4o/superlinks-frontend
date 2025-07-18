import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Alert } from '../ui/alert'
import { DomainStatus, DomainStatusDetails } from './DomainStatus'
import { domainService } from '../../services/domainService'
import { 
  Globe, 
  Trash2, 
  RefreshCw, 
  Settings, 
  ChevronDown, 
  ChevronUp,
  Loader2,
  AlertCircle 
} from 'lucide-react'

export function DomainList({ refreshTrigger, onDomainSelected }) {
  const [domains, setDomains] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedDomain, setExpandedDomain] = useState(null)
  const [actionLoading, setActionLoading] = useState({})

  const loadDomains = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const result = await domainService.getDomains()
      setDomains(result.domains || [])
    } catch (err) {
      setError(err.message || 'Failed to load domains')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDomains()
  }, [refreshTrigger, loadDomains])

  const handleVerifyDomain = async (domainName) => {
    try {
      setActionLoading(prev => ({ ...prev, [domainName]: 'verifying' }))
      await domainService.authenticateDomain(domainName)
      await loadDomains() // Refresh the list
    } catch (err) {
      setError(err.message || 'Failed to verify domain')
    } finally {
      setActionLoading(prev => ({ ...prev, [domainName]: null }))
    }
  }

  const handleDeleteDomain = async (domainName) => {
    if (!window.confirm(`Are you sure you want to delete ${domainName}?`)) {
      return
    }

    try {
      setActionLoading(prev => ({ ...prev, [domainName]: 'deleting' }))
      await domainService.deleteDomain(domainName)
      await loadDomains() // Refresh the list
    } catch (err) {
      setError(err.message || 'Failed to delete domain')
    } finally {
      setActionLoading(prev => ({ ...prev, [domainName]: null }))
    }
  }

  const toggleExpanded = (domainName) => {
    setExpandedDomain(expandedDomain === domainName ? null : domainName)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading domains...
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <div>
              <p>{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadDomains}
                className="mt-2"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (domains.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No domains configured</h3>
          <p className="text-muted-foreground">
            Add your first domain to start using custom email addresses
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            My Domains ({domains.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              {error}
            </Alert>
          )}
          
          <div className="space-y-4">
            {domains.map((domain) => (
              <div key={domain.name} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">{domain.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Added {new Date(domain.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <DomainStatus 
                      status={domain.status}
                      isVerified={domain.isVerified}
                      isDkimAuthenticated={domain.isDkimAuthenticated}
                    />
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(domain.name)}
                    >
                      {expandedDomain === domain.name ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                {expandedDomain === domain.name && (
                  <div className="mt-4 pt-4 border-t">
                    <DomainStatusDetails domain={domain} />
                    
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerifyDomain(domain.name)}
                        disabled={actionLoading[domain.name] === 'verifying'}
                      >
                        {actionLoading[domain.name] === 'verifying' ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Verify Now
                          </>
                        )}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDomainSelected && onDomainSelected(domain)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteDomain(domain.name)}
                        disabled={actionLoading[domain.name] === 'deleting'}
                        className="text-red-600 hover:text-red-700"
                      >
                        {actionLoading[domain.name] === 'deleting' ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}