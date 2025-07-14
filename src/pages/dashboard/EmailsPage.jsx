import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'

export function EmailsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Emails</h1>
      <Card>
        <CardHeader>
          <CardTitle>Email Campaigns</CardTitle>
          <CardDescription>Communicate with your customers</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Email campaigns coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}