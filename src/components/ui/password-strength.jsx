import React from 'react'
import { cn } from '../../lib/utils'
import { Check, X } from 'lucide-react'

const PasswordStrength = ({ password = '', showRequirements = true }) => {
  const requirements = [
    {
      label: 'At least 6 characters',
      test: (pwd) => pwd.length >= 6,
      met: password.length >= 6
    },
    {
      label: 'One uppercase letter',
      test: (pwd) => /[A-Z]/.test(pwd),
      met: /[A-Z]/.test(password)
    },
    {
      label: 'One lowercase letter',
      test: (pwd) => /[a-z]/.test(pwd),
      met: /[a-z]/.test(password)
    },
    {
      label: 'One number',
      test: (pwd) => /\d/.test(pwd),
      met: /\d/.test(password)
    }
  ]

  const metRequirements = requirements.filter(req => req.met).length
  const strength = metRequirements / requirements.length

  const getStrengthColor = () => {
    if (strength === 0) return 'bg-muted'
    if (strength <= 0.25) return 'bg-red-500'
    if (strength <= 0.5) return 'bg-orange-500'
    if (strength <= 0.75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getStrengthText = () => {
    if (strength === 0) return 'Enter password'
    if (strength <= 0.25) return 'Weak'
    if (strength <= 0.5) return 'Fair'
    if (strength <= 0.75) return 'Good'
    return 'Strong'
  }

  if (!password && !showRequirements) return null

  return (
    <div className="space-y-3">
      {password && (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Password strength</span>
            <span className={cn(
              "font-medium",
              strength <= 0.25 && "text-red-500",
              strength > 0.25 && strength <= 0.5 && "text-orange-500",
              strength > 0.5 && strength <= 0.75 && "text-yellow-500",
              strength > 0.75 && "text-green-500"
            )}>
              {getStrengthText()}
            </span>
          </div>
          
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                getStrengthColor()
              )}
              style={{ width: `${strength * 100}%` }}
            />
          </div>
        </div>
      )}

      {showRequirements && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Password must contain:</p>
          <ul className="space-y-1">
            {requirements.map((req, index) => (
              <li
                key={index}
                className={cn(
                  "flex items-center gap-2 text-sm transition-colors",
                  req.met ? "text-green-600" : "text-muted-foreground"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center w-4 h-4 rounded-full text-xs",
                  req.met ? "bg-green-100 text-green-600" : "bg-muted"
                )}>
                  {req.met ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <X className="w-3 h-3" />
                  )}
                </div>
                {req.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export { PasswordStrength }