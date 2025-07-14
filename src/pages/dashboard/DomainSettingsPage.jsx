import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'

export function DomainSettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Custom Domain</h1>
      <Card>
        <CardHeader>
          <CardTitle>Domain Configuration</CardTitle>
          <CardDescription>Connect your custom domain via DNS or CNAME</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Custom domain settings coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}