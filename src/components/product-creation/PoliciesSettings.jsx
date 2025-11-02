import React from 'react'
import { Button } from '../ui/button'

export function PoliciesSettings({ productData, updateProductData }) {
  const policiesItems = [
    {
      key: 'termsConditions',
      title: 'Terms and Conditions',
      description: 'Add additional terms you want to show to the users'
    },
    {
      key: 'refundPolicy',
      title: 'Refund Policy',
      description: 'Refund policy will be shown to the customers'
    },
    {
      key: 'privacyPolicy',
      title: 'Privacy Policy',
      description: 'Privacy policy will be shown to the customers'
    }
  ]

  return (
    <div className="space-y-4">
      {policiesItems.map((item) => (
        <div key={item.key} className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <div className="font-medium">{item.title}</div>
            <div className="text-sm text-muted-foreground">{item.description}</div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              // Open policy editor modal
              console.log(`Setup ${item.title}`)
            }}
          >
            Setup
          </Button>
        </div>
      ))}
    </div>
  )
}

export default PoliciesSettings