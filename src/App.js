import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Toaster } from 'react-hot-toast'

// Layouts
import { DashboardLayout } from './components/layout/DashboardLayout'

// Components
import { PrivateRoute } from './components/PrivateRoute'

// Pages
import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage'
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage'
import { DashboardHomePage } from './pages/dashboard/DashboardHomePage'
import { ProductsPage } from './pages/dashboard/ProductsPage'
import { CreateProductPage } from './pages/dashboard/CreateProductPage'
import CreateProductPageNew from './pages/dashboard/CreateProductPageNew'
import { PurchasesPage } from './pages/dashboard/PurchasesPage'
import { MyPurchasesPage } from './pages/dashboard/MyPurchasesPage'
import { AnalyticsPage } from './pages/dashboard/AnalyticsPage'
import { CommunicationsPage } from './pages/dashboard/CommunicationsPage'
import { SettingsPage } from './pages/dashboard/SettingsPage'
import { ProfileSettingsPage } from './pages/dashboard/ProfileSettingsPage'
import { PaymentSettingsPage } from './pages/dashboard/PaymentSettingsPage'
import { DomainSettingsPage } from './pages/dashboard/DomainSettingsPage'
import { BioBuilderPage } from './pages/dashboard/BioBuilderPage'
import BioBuilderPageNew from './pages/dashboard/BioBuilderPageNew'
import { InstagramSettings } from './pages/dashboard/InstagramSettings'
import { InstagramFunnels } from './pages/dashboard/InstagramFunnels'
import { InstagramCallback } from './pages/dashboard/InstagramCallback'

// Public pages
import { ProductLandingPage } from './pages/public/ProductLandingPage'
import { ProductLandingPageV2 } from './pages/public/ProductLandingPageV2'
import { ProductPreviewPage } from './pages/public/ProductPreviewPage'
import { CheckoutPage } from './pages/public/CheckoutPage'
import { ThankYouPage } from './pages/public/ThankYouPage'
import { UserProfilePage } from './pages/public/UserProfilePage'
import { PublicBioPage } from './pages/public/PublicBioPage'

// Content Viewer
import { ContentViewer } from './components/ContentViewer'

// Context
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
          <div className="App">
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
              
              {/* Product Creation Routes - Full Screen */}
              <Route path="/dashboard/products/new" element={
                <PrivateRoute>
                  <CreateProductPageNew />
                </PrivateRoute>
              } />
              
              {/* Bio Builder Routes - Full Screen */}
              <Route path="/bio-builder" element={
                <PrivateRoute>
                  <BioBuilderPageNew />
                </PrivateRoute>
              } />
              <Route path="/dashboard/products/:id/edit" element={
                <PrivateRoute>
                  <CreateProductPageNew />
                </PrivateRoute>
              } />

              {/* Dashboard Routes - Protected */}
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <DashboardLayout />
                </PrivateRoute>
              }>
                <Route index element={<DashboardHomePage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="purchases" element={<PurchasesPage />} />
                <Route path="my-purchases" element={<MyPurchasesPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="communications" element={<CommunicationsPage />} />
                <Route path="bio" element={<Navigate to="/bio-builder" replace />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="settings/profile" element={<ProfileSettingsPage />} />
                <Route path="settings/payments" element={<PaymentSettingsPage />} />
                <Route path="settings/domain" element={<DomainSettingsPage />} />
                <Route path="instagram/settings" element={<InstagramSettings />} />
                <Route path="instagram/funnels" element={<InstagramFunnels />} />
                <Route path="instagram/callback" element={<InstagramCallback />} />
                <Route path="content/:id" element={<ContentViewer />} />
              </Route>
              
              {/* Public Routes */}
              <Route path="/preview/:username/:slug" element={<ProductPreviewPage />} />
              <Route path="/p/:slug" element={<ProductLandingPageV2 />} />
              <Route path="/checkout/:productId" element={<CheckoutPage />} />
              <Route path="/thank-you/:purchaseId" element={<ThankYouPage />} />
              <Route path="/content/:purchaseId" element={<ContentViewer />} />
              <Route path="/bio/:username" element={<PublicBioPage />} />
              <Route path="/:username" element={<UserProfilePage />} />
              <Route path="/:username/:productSlug" element={<ProductLandingPageV2 />} />
              
              {/* Default redirect */}
              <Route path="/" element={
                <PrivateRoute>
                  <Navigate to="/dashboard" replace />
                </PrivateRoute>
              } />
              
              {/* 404 fallback */}
              <Route path="*" element={<div>404 - Page Not Found</div>} />
            </Routes>
            
            {/* Toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'hsl(var(--card))',
                  color: 'hsl(var(--card-foreground))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'calc(var(--radius) - 2px)',
                },
                success: {
                  iconTheme: {
                    primary: 'hsl(var(--primary))',
                    secondary: 'hsl(var(--primary-foreground))',
                  },
                },
                error: {
                  iconTheme: {
                    primary: 'hsl(var(--destructive))',
                    secondary: 'hsl(var(--destructive-foreground))',
                  },
                },
              }}
            />
          </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App