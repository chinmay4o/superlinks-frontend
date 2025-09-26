import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card, CardContent } from '../../components/ui/card'
import { Alert, AlertDescription } from '../../components/ui/alert'
import { Instagram, CheckCircle, AlertCircle } from 'lucide-react'

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005/api'

export function InstagramCallback() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('processing') // processing, success, error
  const [message, setMessage] = useState('Processing Instagram authorization...')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        const error = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')

        // Handle authorization error
        if (error) {
          setStatus('error')
          setMessage(errorDescription || 'Instagram authorization was cancelled or failed')
          // Close window after delay
          setTimeout(() => {
            window.close()
          }, 3000)
          return
        }

        // Handle missing authorization code
        if (!code) {
          setStatus('error')
          setMessage('No authorization code received from Instagram')
          setTimeout(() => {
            window.close()
          }, 3000)
          return
        }

        // Send authorization code to backend
        const response = await fetch(`${API_BASE_URL}/instagram/auth/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            code,
            state
          })
        })

        const data = await response.json()

        if (response.ok) {
          setStatus('success')
          setMessage(`Successfully connected Instagram account @${data.account.username}`)
          
          // Notify parent window of success
          if (window.opener) {
            window.opener.postMessage({
              type: 'INSTAGRAM_AUTH_SUCCESS',
              data: data.account
            }, window.location.origin)
          }
          
          // Close window after success
          setTimeout(() => {
            window.close()
          }, 2000)
        } else {
          throw new Error(data.message || 'Failed to connect Instagram account')
        }

      } catch (error) {
        console.error('Instagram callback error:', error)
        setStatus('error')
        setMessage(error.message || 'Failed to process Instagram authorization')
        
        // Notify parent window of error
        if (window.opener) {
          window.opener.postMessage({
            type: 'INSTAGRAM_AUTH_ERROR',
            error: error.message
          }, window.location.origin)
        }
        
        // Close window after error
        setTimeout(() => {
          window.close()
        }, 3000)
      }
    }

    handleCallback()
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              {status === 'processing' && (
                <div className="flex items-center gap-2">
                  <Instagram className="h-8 w-8 text-pink-600" />
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-600"></div>
                </div>
              )}
              {status === 'success' && (
                <CheckCircle className="h-12 w-12 text-green-600" />
              )}
              {status === 'error' && (
                <AlertCircle className="h-12 w-12 text-red-600" />
              )}
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-2">
                {status === 'processing' && 'Connecting Instagram...'}
                {status === 'success' && 'Success!'}
                {status === 'error' && 'Error'}
              </h2>
              
              <Alert className={`text-left ${
                status === 'success' ? 'border-green-200 bg-green-50' : 
                status === 'error' ? 'border-red-200 bg-red-50' : 
                'border-blue-200 bg-blue-50'
              }`}>
                <AlertDescription className={
                  status === 'success' ? 'text-green-800' : 
                  status === 'error' ? 'text-red-800' : 
                  'text-blue-800'
                }>
                  {message}
                </AlertDescription>
              </Alert>
            </div>

            {status !== 'processing' && (
              <p className="text-sm text-muted-foreground">
                This window will close automatically...
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}