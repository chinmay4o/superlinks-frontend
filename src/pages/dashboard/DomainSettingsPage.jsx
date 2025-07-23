import React, { useState, useEffect, useCallback } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Alert } from '../../components/ui/alert'
import { DomainForm } from '../../components/domain/DomainForm'
import { DomainList } from '../../components/domain/DomainList'
import { DomainInstructions } from '../../components/domain/DomainInstructions'
import { EmailSetup } from '../../components/domain/EmailSetup'
import { domainService } from '../../services/domainService'
import { Globe, List, FileText, Mail, AlertCircle, Info } from 'lucide-react'
import { dashboardColors } from '../../lib/dashboardColors'

export function DomainSettingsPage() {
  const [domains, setDomains] = useState([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [selectedDomain, setSelectedDomain] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
  }, [loadDomains])

  const handleDomainAdded = async (newDomain) => {
    // Trigger refresh of domain list
    setRefreshTrigger(prev => prev + 1)
    
    // Auto-select the new domain for DNS instructions
    if (newDomain) {
      setSelectedDomain(newDomain)
    }
  }

  const handleDomainSelected = (domain) => {
    setSelectedDomain(domain)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Custom Domain & Email</h1>
        <p className="text-muted-foreground">
          Connect your custom domain to improve email deliverability and create professional email addresses
        </p>
      </div>

      <Alert className={`border-0 bg-gradient-to-r ${dashboardColors.info.gradient}`}>
        <Info className={`h-4 w-4 ${dashboardColors.info.icon}`} />
        <div>
          <p className="font-medium">Why use custom domains?</p>
          <p className="text-sm mt-1">
            Custom domains improve email deliverability, reduce spam risk, and provide professional branding for your email campaigns and transactional emails.
          </p>
        </div>
      </Alert>

      <Tabs defaultValue="add" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-indigo-100 to-cyan-100 dark:from-indigo-900 dark:to-cyan-900 p-1 rounded-lg shadow-md border border-indigo-200 dark:border-indigo-800">
          <TabsTrigger value="add" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Add Domain
          </TabsTrigger>
          <TabsTrigger value="domains" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            My Domains
          </TabsTrigger>
          <TabsTrigger value="instructions" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            DNS Setup
          </TabsTrigger>
          <TabsTrigger value="emails" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Setup
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="space-y-4">
          <DomainForm onDomainAdded={handleDomainAdded} />
        </TabsContent>

        <TabsContent value="domains" className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              {error}
            </Alert>
          )}
          <DomainList 
            refreshTrigger={refreshTrigger} 
            onDomainSelected={handleDomainSelected}
          />
        </TabsContent>

        <TabsContent value="instructions" className="space-y-4">
          {selectedDomain ? (
            <DomainInstructions domain={selectedDomain} />
          ) : (
            <Alert className={`border-0 bg-gradient-to-r ${dashboardColors.warning.gradient}`}>
              <Info className={`h-4 w-4 ${dashboardColors.warning.icon}`} />
              <div>
                <p className="font-medium">No domain selected</p>
                <p className="text-sm mt-1">
                  Select a domain from the "My Domains" tab to view DNS configuration instructions.
                </p>
              </div>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="emails" className="space-y-4">
          <EmailSetup domains={domains} />
        </TabsContent>
      </Tabs>
    </div>
  )
}