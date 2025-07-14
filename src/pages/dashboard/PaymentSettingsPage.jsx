import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'

export function PaymentSettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Payment Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Payment Configuration</CardTitle>
          <CardDescription>Set up your payment methods and bank details</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Payment settings coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}