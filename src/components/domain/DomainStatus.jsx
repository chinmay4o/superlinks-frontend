import React from 'react'
import { Badge } from '../ui/badge'
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'

export function DomainStatus({ status, isVerified, isDkimAuthenticated }) {
  const getStatusConfig = () => {
    if (isVerified && isDkimAuthenticated) {
      return {
        icon: CheckCircle,
        label: 'Verified & Authenticated',
        variant: 'success',
        color: 'text-green-600'
      }
    } else if (isVerified) {
      return {
        icon: CheckCircle,
        label: 'Verified',
        variant: 'secondary',
        color: 'text-blue-600'
      }
    } else if (status === 'pending') {
      return {
        icon: Clock,
        label: 'Pending Verification',
        variant: 'warning',
        color: 'text-yellow-600'
      }
    } else if (status === 'failed') {
      return {
        icon: XCircle,
        label: 'Verification Failed',
        variant: 'destructive',
        color: 'text-red-600'
      }
    } else {
      return {
        icon: AlertCircle,
        label: 'Not Configured',
        variant: 'outline',
        color: 'text-gray-600'
      }
    }
  }

  const { icon: Icon, label, variant, color } = getStatusConfig()

  return (
    <div className="flex items-center gap-2">
      <Icon className={`h-4 w-4 ${color}`} />
      <Badge variant={variant} className="text-xs">
        {label}
      </Badge>
    </div>
  )
}

export function DomainStatusDetails({ domain }) {
  const statusItems = [
    {
      label: 'Domain Verification',
      status: domain.isVerified ? 'verified' : 'pending',
      description: domain.isVerified 
        ? 'Your domain ownership has been verified' 
        : 'Add the verification record to your DNS'
    },
    {
      label: 'DKIM Authentication',
      status: domain.isDkimAuthenticated ? 'verified' : 'pending',
      description: domain.isDkimAuthenticated 
        ? 'DKIM record is properly configured' 
        : 'Add the DKIM record to authenticate your emails'
    },
    {
      label: 'SPF Record',
      status: domain.isSpfConfigured ? 'verified' : 'optional',
      description: domain.isSpfConfigured 
        ? 'SPF record is configured' 
        : 'SPF record is optional but recommended'
    },
    {
      label: 'DMARC Policy',
      status: domain.isDmarcConfigured ? 'verified' : 'optional',
      description: domain.isDmarcConfigured 
        ? 'DMARC policy is active' 
        : 'DMARC policy is optional for advanced protection'
    }
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'optional':
        return <AlertCircle className="h-4 w-4 text-gray-400" />
      default:
        return <XCircle className="h-4 w-4 text-red-600" />
    }
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Domain Configuration Status</h4>
      <div className="space-y-3">
        {statusItems.map((item, index) => (
          <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
            {getStatusIcon(item.status)}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{item.label}</span>
                <Badge 
                  variant={item.status === 'verified' ? 'success' : item.status === 'pending' ? 'warning' : 'secondary'}
                  className="text-xs"
                >
                  {item.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}