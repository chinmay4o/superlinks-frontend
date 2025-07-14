import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'

export function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>
      <Card>
        <CardHeader>
          <CardTitle>Performance Analytics</CardTitle>
          <CardDescription>Track your sales and performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Analytics dashboard coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}