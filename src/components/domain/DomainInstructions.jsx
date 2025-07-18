import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Alert } from '../ui/alert'
import { Badge } from '../ui/badge'
import { 
  Copy, 
  Check, 
  ExternalLink, 
  AlertTriangle,
  Info,
  Globe
} from 'lucide-react'

export function DomainInstructions({ domain }) {
  const [copiedField, setCopiedField] = useState(null)

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const dnsRecords = domain?.dnsRecords || []

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            DNS Configuration Instructions
          </CardTitle>
          <CardDescription>
            Add these DNS records to your domain provider to verify ownership and enable email authentication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <div>
              <p className="font-medium">Before you begin</p>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Log in to your domain provider's control panel</li>
                <li>• Navigate to the DNS management section</li>
                <li>• Add the records exactly as shown below</li>
                <li>• DNS changes can take up to 24 hours to propagate</li>
              </ul>
            </div>
          </Alert>

          <div className="space-y-4">
            {dnsRecords.map((record, index) => (
              <DNSRecord 
                key={index}
                record={record}
                onCopy={copyToClipboard}
                copiedField={copiedField}
              />
            ))}
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">Important Notes</h4>
                <ul className="mt-2 space-y-1 text-sm text-yellow-700">
                  <li>• Don't include quotes when adding records to your DNS</li>
                  <li>• Some DNS providers require a trailing dot (.) for hostname values</li>
                  <li>• TTL values can typically be left as default (3600 seconds)</li>
                  <li>• Contact your domain provider if you need help adding these records</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Common DNS Providers</CardTitle>
          <CardDescription>
            Quick links to DNS management for popular providers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {commonProviders.map((provider) => (
              <Button
                key={provider.name}
                variant="outline"
                className="h-12 flex items-center gap-2"
                onClick={() => window.open(provider.url, '_blank')}
              >
                <span className="text-sm font-medium">{provider.name}</span>
                <ExternalLink className="h-3 w-3" />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Verification Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Domain Verification</p>
                <p className="text-sm text-muted-foreground">
                  Confirms you own the domain
                </p>
              </div>
              <Badge variant={domain?.isVerified ? 'success' : 'warning'}>
                {domain?.isVerified ? 'Verified' : 'Pending'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">DKIM Authentication</p>
                <p className="text-sm text-muted-foreground">
                  Enables email authentication
                </p>
              </div>
              <Badge variant={domain?.isDkimAuthenticated ? 'success' : 'warning'}>
                {domain?.isDkimAuthenticated ? 'Authenticated' : 'Pending'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DNSRecord({ record, onCopy, copiedField }) {
  const getRecordTypeColor = (type) => {
    switch (type) {
      case 'TXT':
        return 'bg-blue-100 text-blue-800'
      case 'CNAME':
        return 'bg-green-100 text-green-800'
      case 'MX':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center gap-3 mb-3">
        <Badge className={getRecordTypeColor(record.type)}>
          {record.type}
        </Badge>
        <span className="font-medium">{record.name}</span>
        <Badge variant="outline" className="ml-auto">
          {record.purpose}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <label className="font-medium text-gray-700">Host/Name</label>
          <div className="flex items-center gap-2 mt-1">
            <code className="flex-1 p-2 bg-gray-50 rounded border text-xs">
              {record.host}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCopy(record.host, `${record.name}-host`)}
              className="p-2"
            >
              {copiedField === `${record.name}-host` ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        
        <div>
          <label className="font-medium text-gray-700">Type</label>
          <div className="mt-1">
            <code className="block p-2 bg-gray-50 rounded border text-xs">
              {record.type}
            </code>
          </div>
        </div>
        
        <div>
          <label className="font-medium text-gray-700">Value</label>
          <div className="flex items-center gap-2 mt-1">
            <code className="flex-1 p-2 bg-gray-50 rounded border text-xs break-all">
              {record.value}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCopy(record.value, `${record.name}-value`)}
              className="p-2"
            >
              {copiedField === `${record.name}-value` ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {record.description && (
        <p className="mt-3 text-sm text-muted-foreground">
          {record.description}
        </p>
      )}
    </div>
  )
}

const commonProviders = [
  { name: 'Cloudflare', url: 'https://dash.cloudflare.com' },
  { name: 'Namecheap', url: 'https://ap.www.namecheap.com/domains/list' },
  { name: 'GoDaddy', url: 'https://dcc.godaddy.com/manage/dns' },
  { name: 'Google Domains', url: 'https://domains.google.com' },
  { name: 'AWS Route 53', url: 'https://console.aws.amazon.com/route53' },
  { name: 'Others', url: 'https://www.google.com/search?q=how+to+add+dns+records' }
]