import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { authService } from '../../services/authService'
import { Button } from '../../components/ui/button'
import { FormInput } from '../../components/ui/form-input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Alert, AlertDescription } from '../../components/ui/alert'
import { Lock, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react'
import { useForm } from '../../hooks/useForm'
import { z } from 'zod'
import toast from 'react-hot-toast'

const resetPasswordSchema = z.object({
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

export function ResetPasswordPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resetError, setResetError] = useState(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    schema: resetPasswordSchema,
    onSubmit: async (data) => {
      try {
        setResetError(null)
        await authService.resetPassword(token, data.password)
        setIsSuccess(true)
        toast.success('Password reset successful!')
        // Navigate to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard')
        }, 2000)
      } catch (error) {
        if (error.message.includes('expired') || error.message.includes('Invalid')) {
          setResetError({
            message: 'This reset link has expired or is invalid. Please request a new one.',
            showForgotLink: true
          })
        } else {
          setResetError({
            message: error.message || 'Failed to reset password. Please try again.',
            showForgotLink: false
          })
        }
      }
    },
    defaultValues: {
      password: '',
      confirmPassword: ''
    },
    showToasts: false
  })

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Password Reset Successful</CardTitle>
              <CardDescription>
                Your password has been successfully reset. You are now logged in.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertDescription>
                  Redirecting you to your dashboard...
                </AlertDescription>
              </Alert>
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
          <h1 className="text-2xl font-bold">Set New Password</h1>
          <p className="text-muted-foreground">Enter your new password below</p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              Choose a strong password for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {resetError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="flex flex-col gap-2">
                    <span>{resetError.message}</span>
                    {resetError.showForgotLink && (
                      <Link 
                        to="/forgot-password" 
                        className="underline font-medium hover:no-underline"
                      >
                        Request a new reset link
                      </Link>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              <FormInput
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                icon={Lock}
                placeholder="Enter your new password"
                error={errors.password?.message}
                showPasswordToggle
                passwordVisible={showPassword}
                onPasswordToggle={() => setShowPassword(!showPassword)}
                required
                {...register('password')}
              />

              <FormInput
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                icon={Lock}
                placeholder="Confirm your new password"
                error={errors.confirmPassword?.message}
                showPasswordToggle
                passwordVisible={showConfirmPassword}
                onPasswordToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                required
                {...register('confirmPassword')}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
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