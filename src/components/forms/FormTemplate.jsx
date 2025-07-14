import React from 'react'
import { Button } from '../ui/button'
import { FormInput } from '../ui/form-input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { useForm } from '../../hooks/useForm'

/**
 * Template component for creating consistent forms across the application
 * 
 * @param {Object} props
 * @param {string} props.title - Form title
 * @param {string} props.description - Form description
 * @param {Array} props.fields - Array of field configurations
 * @param {ZodSchema} props.schema - Validation schema
 * @param {Function} props.onSubmit - Submit handler
 * @param {Object} props.defaultValues - Default form values
 * @param {string} props.submitText - Submit button text
 * @param {string} props.loadingText - Loading button text
 * @param {ReactNode} props.children - Additional form content
 * @param {string} props.className - Additional CSS classes
 */
export function FormTemplate({
  title,
  description,
  fields = [],
  schema,
  onSubmit,
  defaultValues = {},
  submitText = 'Submit',
  loadingText = 'Submitting...',
  children,
  className = ''
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    schema,
    onSubmit,
    defaultValues
  })

  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <FormInput
              key={field.name}
              label={field.label}
              type={field.type || 'text'}
              placeholder={field.placeholder}
              error={errors[field.name]?.message}
              required={field.required}
              icon={field.icon}
              helperText={field.helperText}
              {...register(field.name)}
              {...(field.props || {})}
            />
          ))}
          
          {children}
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? loadingText : submitText}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

// Example usage:
/*
const contactFields = [
  {
    name: 'name',
    label: 'Full Name',
    placeholder: 'Enter your name',
    required: true,
    icon: User
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Enter your email',
    required: true,
    icon: Mail
  },
  {
    name: 'message',
    label: 'Message',
    type: 'textarea',
    placeholder: 'Enter your message',
    required: true
  }
]

<FormTemplate
  title="Contact Us"
  description="Send us a message and we'll get back to you"
  fields={contactFields}
  schema={contactSchema}
  onSubmit={handleContactSubmit}
  submitText="Send Message"
  loadingText="Sending..."
/>
*/