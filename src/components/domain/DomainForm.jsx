import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { FormInput } from '../ui/form-input'
import { Alert } from '../ui/alert'
import { useForm } from '../../hooks/useForm'
import { domainSettingsSchema } from '../../lib/validations'
import { domainService } from '../../services/domainService'
import { Globe, Plus, Loader2 } from 'lucide-react'

const DomainFormComponent = ({ onDomainAdded }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const isMountedRef = useRef(true)

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const onSubmit = useCallback(async (data) => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    setSubmitError('')
    
    try {
      const result = await domainService.createDomain(data.domain)
      
      if (!isMountedRef.current) return
      
      reset()
      
      if (onDomainAdded) {
        onDomainAdded(result)
      }
      
    } catch (error) {
      if (isMountedRef.current) {
        setSubmitError(error.message || 'Failed to add domain')
      }
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false)
      }
    }
  }, [isSubmitting, onDomainAdded])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    schema: domainSettingsSchema,
    defaultValues: {
      domain: ''
    },
    onSubmit: onSubmit
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Add Custom Domain
        </CardTitle>
        <CardDescription>
          Add your custom domain to improve email deliverability and brand consistency
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submitError && (
          <Alert variant="destructive" className="mb-4">
            {submitError}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            {...register('domain')}
            label="Domain Name"
            placeholder="example.com"
            error={errors.domain?.message}
            helperText="Enter your domain without www or https://"
            required
            icon={Globe}
          />
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding Domain...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Domain
              </>
            )}
          </Button>
        </form>
        
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">What happens next?</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Your domain will be added to Brevo</li>
            <li>• You'll receive DNS records to configure</li>
            <li>• Once verified, you can create custom email addresses</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

export const DomainForm = React.memo(DomainFormComponent)