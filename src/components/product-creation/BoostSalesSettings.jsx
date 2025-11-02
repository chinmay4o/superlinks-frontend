import React from 'react'
import { Button } from '../ui/button'
import { Label } from '../ui/label'

export function BoostSalesSettings({ productData, updateProductData }) {
  const settingsItems = [
    {
      key: 'bumpOffer',
      title: 'Bump Offer',
      description: 'Offer add-on product during checkout',
      action: 'Setup'
    },
    {
      key: 'automatedEmail',
      title: 'Automated Email',
      description: 'Trigger Email Automations based on certain triggers',
      action: 'Setup'
    },
    {
      key: 'discountCoupons',
      title: 'Discount Coupons',
      description: 'Offer discounts to your audience to boost sales',
      action: 'Setup'
    }
  ]

  return (
    <div className="space-y-4">
      {settingsItems.map((item) => (
        <div key={item.key} className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <div className="font-medium">{item.title}</div>
            <div className="text-sm text-muted-foreground">{item.description}</div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              // Toggle the setting or open setup modal
              updateProductData(`boostSales.${item.key}`, !productData.boostSales[item.key])
            }}
          >
            {item.action}
          </Button>
        </div>
      ))}
    </div>
  )
}

export default BoostSalesSettings