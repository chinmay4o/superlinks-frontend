import React from 'react'
import { Input } from './input'
import { cn } from '../../lib/utils'
import { Eye, EyeOff } from 'lucide-react'

const FormInput = React.forwardRef(({ 
  label,
  error,
  helperText,
  required,
  className,
  icon: Icon,
  iconPosition = 'left',
  showPasswordToggle,
  passwordVisible,
  onPasswordToggle,
  ...props 
}, ref) => {
  const inputId = props.id || props.name
  const hasError = Boolean(error)
  
  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={inputId} 
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        )}
        
        <Input
          ref={ref}
          id={inputId}
          className={cn(
            Icon && iconPosition === 'left' && "pl-10",
            (Icon && iconPosition === 'right') || showPasswordToggle && "pr-10",
            hasError && "border-destructive focus-visible:ring-destructive",
            className
          )}
          {...props}
        />
        
        {Icon && iconPosition === 'right' && (
          <Icon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        )}
        
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onPasswordToggle}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {passwordVisible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      
      {(hasError || helperText) && (
        <p className={cn(
          "text-sm",
          hasError ? "text-destructive" : "text-muted-foreground"
        )}>
          {hasError ? error : helperText}
        </p>
      )}
    </div>
  )
})

FormInput.displayName = "FormInput"

export { FormInput }