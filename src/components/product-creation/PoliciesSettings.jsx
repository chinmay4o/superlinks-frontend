import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { FileText, Shield, RefreshCw } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import RichTextEditor from '../editor/RichTextEditorSimple'

export function PoliciesSettings({ productData, updateProductData }) {
  const [activePolicy, setActivePolicy] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const policiesItems = [
    {
      key: 'termsConditions',
      title: 'Terms and Conditions',
      description: 'Add additional terms you want to show to the users',
      icon: FileText,
      placeholder: 'Enter your terms and conditions here. For example: By purchasing this product, you agree to the following terms...',
      template: `<h3>Terms and Conditions</h3>
<p>By purchasing this digital product, you agree to the following terms:</p>
<ul>
<li>This is a digital product and no physical item will be shipped</li>
<li>You will receive access to the download link via email</li>
<li>All sales are final unless otherwise stated in our refund policy</li>
<li>You may not redistribute, resell, or share this product</li>
<li>The content is for personal use only</li>
</ul>
<p>If you have any questions, please contact us at support@yourstore.com</p>`
    },
    {
      key: 'refundPolicy',
      title: 'Refund Policy',
      description: 'Refund policy will be shown to the customers',
      icon: RefreshCw,
      placeholder: 'Enter your refund policy here. For example: We offer a 30-day money-back guarantee...',
      template: `<h3>Refund Policy</h3>
<p>We stand behind our products and offer the following refund policy:</p>
<ul>
<li>30-day money-back guarantee on all digital products</li>
<li>Refunds are processed within 5-7 business days</li>
<li>To request a refund, contact us at support@yourstore.com</li>
<li>Please include your order number and reason for refund</li>
</ul>
<p>Note: Due to the digital nature of our products, all sales are final after the 30-day period.</p>`
    },
    {
      key: 'privacyPolicy',
      title: 'Privacy Policy',
      description: 'Privacy policy will be shown to the customers',
      icon: Shield,
      placeholder: 'Enter your privacy policy here. For example: We respect your privacy and protect your personal information...',
      template: `<h3>Privacy Policy</h3>
<p>We are committed to protecting your privacy. This policy explains how we collect and use your information:</p>
<ul>
<li>We collect only necessary information to process your order</li>
<li>Your personal information is never sold or shared with third parties</li>
<li>We use secure payment processing through trusted providers</li>
<li>Email addresses are used only for order confirmation and support</li>
<li>You may request deletion of your data by contacting us</li>
</ul>
<p>Contact us at privacy@yourstore.com for any privacy-related questions.</p>`
    }
  ]

  const openPolicyEditor = (policyKey) => {
    setActivePolicy(policyKey)
    setIsModalOpen(true)
  }

  const savePolicyContent = (content) => {
    if (activePolicy) {
      updateProductData(`policies.${activePolicy}`, content)
    }
    setIsModalOpen(false)
    setActivePolicy(null)
  }

  const handleUseTemplate = (template) => {
    if (activePolicy) {
      updateProductData(`policies.${activePolicy}`, template)
    }
  }

  const activePolicyItem = activePolicy ? policiesItems.find(p => p.key === activePolicy) : null

  return (
    <div className="space-y-4">
      {policiesItems.map((item) => {
        const IconComponent = item.icon
        const hasContent = productData.policies[item.key]?.trim()
        
        return (
          <Card key={item.key}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <IconComponent className="h-4 w-4 text-blue-500" />
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {hasContent && (
                    <Badge variant="default" className="text-xs">
                      Added
                    </Badge>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openPolicyEditor(item.key)}
                  >
                    {hasContent ? 'Edit' : 'Add'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}

      {/* Policy Editor Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {activePolicyItem ? `Edit ${activePolicyItem.title}` : 'Edit Policy'}
            </DialogTitle>
          </DialogHeader>
          
          {activePolicyItem && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Create your {activePolicyItem.title.toLowerCase()} or use our template
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUseTemplate(activePolicyItem.template)}
                >
                  Use Template
                </Button>
              </div>

              <RichTextEditor
                value={productData.policies[activePolicy] || ''}
                onChange={(value) => updateProductData(`policies.${activePolicy}`, value)}
                placeholder={activePolicyItem.placeholder}
                className="min-h-96"
              />

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsModalOpen(false)
                    setActivePolicy(null)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setIsModalOpen(false)
                    setActivePolicy(null)
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PoliciesSettings