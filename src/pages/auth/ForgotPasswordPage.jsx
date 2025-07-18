import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { authService } from '../../services/authService'
import { Button } from '../../components/ui/button'
import { FormInput } from '../../components/ui/form-input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Alert, AlertDescription } from '../../components/ui/alert'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { useForm } from '../../hooks/useForm'
import { z } from 'zod'
import toast from 'react-hot-toast'

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email')
})

export function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    schema: forgotPasswordSchema,
    onSubmit: async (data) => {
      try {
        await authService.forgotPassword(data.email)
        setSubmittedEmail(data.email)
        setIsSubmitted(true)
      } catch (error) {
        toast.error(error.message || 'Failed to send reset email')
      }
    },
    defaultValues: {
      email: ''
    }
  })

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Check your email</CardTitle>
              <CardDescription>
                We've sent a password reset link to {submittedEmail}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>
                  If an account exists with this email, you'll receive a password reset link shortly. 
                  Please check your spam folder if you don't see it in your inbox.
                </AlertDescription>
              </Alert>
              
              <div className="flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setIsSubmitted(false)
                    setSubmittedEmail('')
                  }}
                >
                  Try another email
                </Button>
                
                <Link to="/login">
                  <Button variant="ghost" className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-lg bg-primary flex items-center justify-center mb-4">
            <span className="text-primary-foreground font-bold text-lg">SL</span>
          </div>
          <h1 className="text-2xl font-bold">Forgot your password?</h1>
          <p className="text-muted-foreground">We'll send you a reset link</p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                label="Email"
                type="email"
                icon={Mail}
                placeholder="Enter your email"
                error={errors.email?.message}
                required
                {...register('email')}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </Button>

              <div className="text-center">
                <Link to="/login" className="text-sm text-muted-foreground hover:text-primary">
                  <ArrowLeft className="inline h-3 w-3 mr-1" />
                  Back to login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}