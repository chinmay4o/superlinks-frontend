# Form Validation System

This document describes the comprehensive form validation system implemented in the Superlinks frontend application using React Hook Form and Zod.

## Overview

The form validation system provides:
- **Type-safe validation** using Zod schemas
- **Consistent error handling** across all forms
- **Reusable components** for form inputs
- **Password strength validation** for registration
- **Real-time validation feedback**
- **Accessible form components**

## Architecture

### Core Files

1. **`/lib/validations.js`** - Zod validation schemas for all forms
2. **`/hooks/useForm.js`** - Enhanced form hook with validation and error handling
3. **`/components/ui/form-input.jsx`** - Enhanced input component with validation styling
4. **`/components/ui/password-strength.jsx`** - Password strength indicator component
5. **`/components/forms/FormTemplate.jsx`** - Template for creating consistent forms

### Dependencies

- `react-hook-form` - Form state management and validation
- `@hookform/resolvers` - Resolver for Zod schemas
- `zod` - Schema validation library
- `react-hot-toast` - Toast notifications

## Usage

### 1. Basic Form with Validation

```jsx
import { useForm } from '../../hooks/useForm'
import { loginSchema } from '../../lib/validations'
import { FormInput } from '../../components/ui/form-input'

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    schema: loginSchema,
    onSubmit: async (data) => {
      // Handle form submission
      await loginUser(data)
    },
    defaultValues: {
      email: '',
      password: ''
    }
  })

  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        label="Email"
        type="email"
        error={errors.email?.message}
        {...register('email')}
      />
      
      <FormInput
        label="Password"
        type="password"
        error={errors.password?.message}
        {...register('password')}
      />
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  )
}
```

### 2. Form with Password Strength

```jsx
import { PasswordStrength } from '../../components/ui/password-strength'

function RegisterForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    schema: registerSchema,
    onSubmit: handleRegister
  })

  const password = watch('password', '')

  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        label="Password"
        type="password"
        error={errors.password?.message}
        {...register('password')}
      />
      
      <PasswordStrength 
        password={password}
        showRequirements={true}
      />
    </form>
  )
}
```

### 3. Using FormTemplate

```jsx
import { FormTemplate } from '../../components/forms/FormTemplate'

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
  }
]

function ContactForm() {
  return (
    <FormTemplate
      title="Contact Us"
      description="Send us a message"
      fields={contactFields}
      schema={contactSchema}
      onSubmit={handleContactSubmit}
      submitText="Send Message"
    />
  )
}
```

## Available Validation Schemas

### Authentication
- `loginSchema` - Email and password validation
- `registerSchema` - Name, email, and strong password validation
- `forgotPasswordSchema` - Email validation
- `resetPasswordSchema` - New password with confirmation
- `changePasswordSchema` - Current and new password validation

### Product Management
- `createProductSchema` - Product creation validation
- `updateProductSchema` - Product update validation (partial)

### User Profile
- `updateProfileSchema` - Profile information validation

### Settings
- `paymentSettingsSchema` - Payment provider configuration
- `domainSettingsSchema` - Domain and subdomain validation

### Other
- `checkoutSchema` - Checkout form validation
- `contactSchema` - Contact form validation
- `searchSchema` - Search query validation

## Creating New Validation Schemas

```javascript
// In /lib/validations.js
export const newFormSchema = z.object({
  field1: z
    .string()
    .min(1, 'Field 1 is required')
    .max(100, 'Field 1 is too long'),
  field2: z
    .number()
    .min(0, 'Field 2 must be positive'),
  field3: z
    .string()
    .email('Invalid email format')
    .optional()
})
```

## FormInput Component Props

```jsx
<FormInput
  label="Field Label"           // Field label
  type="text"                   // Input type
  placeholder="Placeholder"     // Placeholder text
  error="Error message"         // Error message to display
  helperText="Helper text"      // Helper text
  required={true}               // Show required indicator
  icon={IconComponent}          // Icon component (Lucide React)
  iconPosition="left"           // Icon position: "left" | "right"
  showPasswordToggle={true}     // Show password visibility toggle
  passwordVisible={false}       // Password visibility state
  onPasswordToggle={() => {}}   // Password toggle handler
  className="custom-class"      // Additional CSS classes
  {...register('fieldName')}   // React Hook Form registration
/>
```

## Password Strength Component

```jsx
<PasswordStrength
  password="user-password"      // Password to validate
  showRequirements={true}       // Show requirements list
/>
```

### Password Requirements
- Minimum 6 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)

## Error Handling

The form system provides automatic error handling:

1. **Client-side validation** - Real-time validation using Zod schemas
2. **Server-side errors** - Automatic display of API error messages
3. **Toast notifications** - Success/error messages via react-hot-toast
4. **Field-specific errors** - Errors displayed below each field

## Best Practices

1. **Always use validation schemas** for type safety and consistency
2. **Provide clear error messages** that help users fix issues
3. **Use appropriate input types** (email, password, etc.)
4. **Include helpful placeholder text**
5. **Show password requirements** for registration forms
6. **Disable submit buttons** during form submission
7. **Provide loading states** for better UX

## Accessibility

The form components are built with accessibility in mind:

- Proper ARIA labels and descriptions
- Keyboard navigation support
- Screen reader friendly error messages
- Focus management
- High contrast error indicators

## Examples in Codebase

- **Registration**: `/pages/auth/RegisterPage.jsx`
- **Login**: `/pages/auth/LoginPage.jsx`
- **Search**: `/components/layout/DashboardHeader.jsx`

## Extending the System

To add new form types:

1. Create validation schema in `/lib/validations.js`
2. Use `useForm` hook with the schema
3. Use `FormInput` components for consistent styling
4. Add specialized components as needed (like `PasswordStrength`)
5. Follow the established patterns for error handling

This system ensures all forms across the application have consistent validation, error handling, and user experience.