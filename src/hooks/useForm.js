import { useForm as useReactHookForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'

/**
 * Enhanced form hook that provides validation, error handling, and loading states
 * @param {Object} options - Configuration options
 * @param {ZodSchema} options.schema - Zod validation schema
 * @param {Function} options.onSubmit - Submit handler function
 * @param {Object} options.defaultValues - Default form values
 * @param {string} options.successMessage - Success toast message
 * @param {string} options.errorMessage - Default error toast message
 * @param {boolean} options.showToasts - Whether to show toast notifications
 */
export function useForm({
  schema,
  onSubmit,
  defaultValues = {},
  successMessage,
  errorMessage = 'An error occurred. Please try again.',
  showToasts = true
}) {
  const form = useReactHookForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues,
    mode: 'onChange' // Validate on change for better UX
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await onSubmit(data)
      
      if (showToasts && successMessage) {
        toast.success(successMessage)
      }
    } catch (error) {
      console.error('Form submission error:', error)
      
      if (showToasts) {
        const message = error?.message || errorMessage
        toast.error(message)
      }
      
      // If the error contains field-specific errors, set them
      if (error?.fieldErrors) {
        Object.entries(error.fieldErrors).forEach(([field, message]) => {
          form.setError(field, { type: 'server', message })
        })
      }
      
      // Re-throw error so parent components can handle it if needed
      throw error
    }
  })

  return {
    ...form,
    handleSubmit,
    isSubmitting: form.formState.isSubmitting,
    isValid: form.formState.isValid,
    errors: form.formState.errors,
    isDirty: form.formState.isDirty
  }
}

/**
 * Hook for forms that need to track loading state separately from form submission
 */
export function useFormWithLoading(options) {
  const form = useForm(options)
  
  return form
}

/**
 * Utility function to get field error message
 */
export function getFieldError(errors, fieldName) {
  const error = errors[fieldName]
  return error?.message || ''
}

/**
 * Utility function to check if field has error
 */
export function hasFieldError(errors, fieldName) {
  return Boolean(errors[fieldName])
}

/**
 * Higher-order component for form field validation styling
 */
export function getFieldProps(register, errors, fieldName, options = {}) {
  return {
    ...register(fieldName, options),
    error: hasFieldError(errors, fieldName),
    helperText: getFieldError(errors, fieldName)
  }
}