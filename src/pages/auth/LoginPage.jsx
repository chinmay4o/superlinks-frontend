import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../../components/ui/button'
import { FormInput } from '../../components/ui/form-input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Alert, AlertDescription } from '../../components/ui/alert'
import { Mail, Lock, AlertCircle } from 'lucide-react'
import { useForm } from '../../hooks/useForm'
import { loginSchema } from '../../lib/validations'
import toast from 'react-hot-toast'
import { AnimatedBackground } from '../../components/ui/animated-background'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login: authLogin } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState(null)

  // Get the location they were trying to go to
  const from = location.state?.from?.pathname || '/dashboard'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    schema: loginSchema,
    onSubmit: async (data) => {
      try {
        setLoginError(null)
        await authLogin(data)
        toast.success('Welcome back!')
        navigate(from, { replace: true })
      } catch (error) {
        // Handle specific error codes from the backend
        const errorResponse = error.response?.data
        if (errorResponse?.code === 'USER_NOT_FOUND') {
          setLoginError({
            message: errorResponse.message,
            action: 'signup'
          })
        } else if (errorResponse?.code === 'INVALID_PASSWORD') {
          setLoginError({
            message: errorResponse.message,
            action: 'forgot_password'
          })
        } else if (errorResponse?.code === 'ACCOUNT_DEACTIVATED') {
          setLoginError({
            message: errorResponse.message,
            action: null
          })
        } else {
          setLoginError({
            message: error.message || 'Login failed. Please try again.',
            action: null
          })
        }
        // Don't throw the error to prevent double toast
      }
    },
    defaultValues: {
      email: '',
      password: ''
    },
    showToasts: false // Disable default toasts since we're handling errors manually
  })

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-lg bg-primary flex items-center justify-center mb-4">
            <span className="text-primary-foreground font-bold text-lg">SL</span>
          </div>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">Sign in to your Superlinks account</p>
        </div>

        {/* Login Form */}
        <Card className="backdrop-blur-sm bg-white/95">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {loginError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="flex flex-col gap-2">
                    <span>{loginError.message}</span>
                    {loginError.action === 'signup' && (
                      <Link 
                        to="/register" 
                        className="underline font-medium hover:no-underline"
                      >
                        Click here to sign up
                      </Link>
                    )}
                    {loginError.action === 'forgot_password' && (
                      <Link 
                        to="/forgot-password" 
                        className="underline font-medium hover:no-underline"
                      >
                        Reset your password
                      </Link>
                    )}
                  </AlertDescription>
                </Alert>
              )}
              
              <FormInput
                label="Email"
                type="email"
                icon={Mail}
                placeholder="Enter your email"
                error={errors.email?.message}
                required
                {...register('email')}
              />

              <FormInput
                label="Password"
                type={showPassword ? 'text' : 'password'}
                icon={Lock}
                placeholder="Enter your password"
                error={errors.password?.message}
                showPasswordToggle
                passwordVisible={showPassword}
                onPasswordToggle={() => setShowPassword(!showPassword)}
                required
                {...register('password')}
              />

              <div className="flex items-center justify-between">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sign Up Link */}
        <div className="text-center">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link to="/register" className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </div>

        {/* Tagline */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground italic">
            "Just start with what you know, see what sticks, and get paid."
          </p>
        </div>
      </div>
      </div>
    </div>
  )
}