# Superlinks.ai Frontend

A modern React-based frontend for Superlinks.ai - a platform that helps creators, educators, and individuals monetize their knowledge by selling digital products online.

## Overview

Superlinks.ai enables users to:
- Create and manage digital products (ebooks, courses, templates)
- Track sales and analytics
- Collect payments through integrated payment gateways
- Customize their creator profile and product landing pages

**Target Users**: Creators, educators, solopreneurs who want to earn their first dollar online
**Tagline**: "Just start with what you know, see what sticks, and get paid."

## Tech Stack

- **Frontend**: React.js (without TypeScript)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Authentication**: JWT-based authentication
- **Payment Integration**: Razorpay
- **File Storage**: AWS S3

## Features

### Dashboard Layout
- **Home**: Overview dashboard with earnings and product stats
- **Products**: Create, edit, and manage digital products
- **Purchases**: View customer transactions with filtering
- **Analytics**: Charts and graphs for performance tracking
- **Communications**: Email tools for customer outreach
- **Settings**: Profile, payment settings, and custom domain setup

### Product Management
- Support for multiple product types (ebooks, courses, templates, digital art)
- File upload and preview capabilities
- Pricing configuration and discount management
- Inventory tracking for limited stock items
- Unique product landing pages

### User Experience
- Responsive design for all devices
- Intuitive product creation workflow
- Real-time dashboard updates
- Secure payment processing
- Theme toggle (light/dark mode)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/chinmay4o/superlinks-frontend.git
cd superlinks-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```
REACT_APP_API_URL=your_backend_api_url
REACT_APP_RAZORPAY_KEY=your_razorpay_key
REACT_APP_AWS_S3_BUCKET=your_s3_bucket
```

5. Start the development server:
```bash
npm start
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/
│   ├── forms/          # Reusable form components
│   ├── layout/         # Layout components (Header, Sidebar)
│   └── ui/             # shadcn/ui components
├── contexts/           # React Context providers
├── hooks/              # Custom React hooks
├── lib/                # Utilities and validations
├── pages/              # Page components
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # Dashboard pages
│   └── public/         # Public-facing pages
├── services/           # API service functions
└── index.css           # Global styles
```

## Key Components

### Authentication
- Login and registration with form validation
- JWT token management
- Protected routes and authentication context

### Product Creation
- Multi-step product creation wizard
- File upload with preview
- Pricing and inventory management
- Product categorization

### Dashboard
- Real-time analytics and statistics
- Sales tracking and reporting
- Customer management
- Revenue insights

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@superlinks.ai or join our community Discord server.

---

Built with ❤️ for creators worldwide