import { z } from 'zod'

// Common validation patterns
const emailValidation = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')

const passwordValidation = z
  .string()
  .min(6, 'Password must be at least 6 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number')

const nameValidation = z
  .string()
  .min(2, 'Name must be at least 2 characters long')
  .max(100, 'Name must be less than 100 characters')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')

// Auth schemas
export const loginSchema = z.object({
  email: emailValidation,
  password: z.string().min(1, 'Password is required')
})

export const registerSchema = z.object({
  name: nameValidation,
  email: emailValidation,
  password: passwordValidation
})

export const forgotPasswordSchema = z.object({
  email: emailValidation
})

export const resetPasswordSchema = z.object({
  password: passwordValidation,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordValidation,
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

// Product schemas
export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, 'Product name is required')
    .max(100, 'Product name must be less than 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  price: z
    .number()
    .min(0.01, 'Price must be greater than 0')
    .max(999999, 'Price is too high'),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).optional(),
  isDigital: z.boolean().default(true),
  isActive: z.boolean().default(true)
})

export const updateProductSchema = createProductSchema.partial()

// Profile schemas
export const updateProfileSchema = z.object({
  name: nameValidation.optional(),
  bio: z
    .string()
    .max(500, 'Bio must be less than 500 characters')
    .optional(),
  website: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  avatar: z.string().optional()
})

// Payment schemas
export const paymentSettingsSchema = z.object({
  paymentProvider: z.enum(['razorpay', 'stripe'], {
    required_error: 'Please select a payment provider'
  }),
  apiKey: z.string().min(1, 'API key is required'),
  apiSecret: z.string().min(1, 'API secret is required'),
  webhookSecret: z.string().optional()
})

// Domain schemas
export const domainSettingsSchema = z.object({
  domain: z
    .string()
    .min(1, 'Domain is required')
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/, 'Please enter a valid domain'),
  subdomain: z
    .string()
    .min(3, 'Subdomain must be at least 3 characters')
    .max(20, 'Subdomain must be less than 20 characters')
    .regex(/^[a-zA-Z0-9-]+$/, 'Subdomain can only contain letters, numbers, and hyphens')
    .optional()
})

// Checkout schemas
export const checkoutSchema = z.object({
  customerName: nameValidation,
  customerEmail: emailValidation,
  billingAddress: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'ZIP code is required'),
    country: z.string().min(1, 'Country is required')
  }).optional(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions'
  })
})

// Contact/Support schemas
export const contactSchema = z.object({
  name: nameValidation,
  email: emailValidation,
  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(100, 'Subject must be less than 100 characters'),
  message: z
    .string()
    .min(20, 'Message must be at least 20 characters')
    .max(1000, 'Message must be less than 1000 characters')
})

// Search schemas
export const searchSchema = z.object({
  query: z
    .string()
    .min(1, 'Search query is required')
    .max(100, 'Search query is too long'),
  category: z.string().optional(),
  priceRange: z.object({
    min: z.number().min(0).optional(),
    max: z.number().min(0).optional()
  }).optional()
})