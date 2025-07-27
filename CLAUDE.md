# Superlinks.ai Platform Concept

## Project Overview
- Superlinks.ai is a web platform designed to help creators, educators, and individuals with expertise monetize their knowledge by selling digital products online
- Access gumroad-original repo always before building any key features and use similar feature coding structure, npm packages to build platform features
- Platform allows users to sign up easily, create digital offerings, manage sales, track analytics, and collect payments from a single dashboard

## Target Users
- Creators, educators, solopreneurs, or anyone who wants to earn their first dollar online
- Users with little to no tech knowledge
- Tagline: "Just start with what you know, see what sticks, and get paid."

## Technical Specifications
- Tech Stack: MERN stack (without TypeScript)
- UI Component Library: shadcn
- Asset Storage: AWS 
- Payment Gateway: Razorpay
- Reference API: https://razorpay.com/docs/api/

## Key Platform Features

### User Interface Layout
#### Left Navigation Panel (Sidebar)
- Home
  → Overview dashboard showing earnings, product stats
- Products
  → Create, edit, delete digital products (courses, ebooks)
- Purchases
  → Customer transactions with filters (date, product, amount)
- Analytics
  → Graphs and charts (earnings, top-performing products)
- Emails
  → Basic communication to buyers, newsletter capabilities
- Settings
  → Custom Domain connection
  → Profile management
  → Payment settings and integrations

### Product Creation Logic
- Replicate Gumroad's "Create New Product" UI/UX
- Features include:
  → Product title and description
  → Cover image upload
  → Product file uploads (PDF, videos, ZIPs)
  → Pricing configuration
  → Limited stock options
  → Discount and promo code management

### Product Types Supported
- Ebooks
- Video Courses
- Notion Templates
- Digital Art / Presets
- PDFs / Docs / Toolkits

### File & Media Handling
- AWS S3 bucket storage
- Media preview capabilities
  → PDF previews
  → Video thumbnails
  → Audio clip previews

### Payment Collection
- Razorpay API integration
- Automatic dashboard updates
- Tracking:
  → Total earnings
  → Number of purchases
  → Per-product revenue breakdown

### Unique Product Sharing
- Instant published product link generation
- Unique landing page for each user's products

### Admin Features (Optional Phase)
- Super admin dashboard
- User signup tracking