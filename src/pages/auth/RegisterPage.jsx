import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../../components/ui/button'
import { FormInput } from '../../components/ui/form-input'
import { PasswordStrength } from '../../components/ui/password-strength'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Mail, Lock, User } from 'lucide-react'
import { useForm } from '../../hooks/useForm'
import { registerSchema } from '../../lib/validations'
import toast from 'react-hot-toast'
import { AnimatedBackground } from '../../components/ui/animated-background'

export function RegisterPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { register: authRegister } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  
  // Get the location they were trying to go to
  const from = location.state?.from?.pathname || '/dashboard'
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    schema: registerSchema,
    onSubmit: async (data) => {
      await authRegister(data)
      toast.success('Account created successfully!')
      navigate(from, { replace: true })
    },
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  })
  
  const watchedPassword = watch('password', '')

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
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground">Start selling your digital products today</p>
        </div>

        {/* Register Form */}
        <Card className="backdrop-blur-sm bg-white/95">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Create your free Superlinks account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                label="Full Name"
                icon={User}
                placeholder="Enter your full name"
                error={errors.name?.message}
                required
                {...register('name')}
              />

              <FormInput
                label="Email"
                type="email"
                icon={Mail}
                placeholder="Enter your email"
                error={errors.email?.message}
                required
                {...register('email')}
              />

              <div className="space-y-2">
                <FormInput
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  icon={Lock}
                  placeholder="Create a strong password"
                  error={errors.password?.message}
                  showPasswordToggle
                  passwordVisible={showPassword}
                  onPasswordToggle={() => setShowPassword(!showPassword)}
                  required
                  {...register('password')}
                />
                
                <PasswordStrength 
                  password={watchedPassword}
                  showRequirements={true}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sign In Link */}
        <div className="text-center">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link to="/login" className="text-primary hover:underline font-medium">
            Sign in
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