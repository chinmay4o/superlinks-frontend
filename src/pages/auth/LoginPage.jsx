import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../../components/ui/button'
import { FormInput } from '../../components/ui/form-input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Mail, Lock } from 'lucide-react'
import { useForm } from '../../hooks/useForm'
import { loginSchema } from '../../lib/validations'
import toast from 'react-hot-toast'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login: authLogin } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  // Get the location they were trying to go to
  const from = location.state?.from?.pathname || '/dashboard'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    schema: loginSchema,
    onSubmit: async (data) => {
      await authLogin(data)
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    },
    defaultValues: {
      email: '',
      password: ''
    }
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
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
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard
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
  )
}