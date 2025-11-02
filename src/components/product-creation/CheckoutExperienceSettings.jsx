import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Plus, X, Phone } from 'lucide-react'

export function CheckoutExperienceSettings({ productData, updateProductData }) {
  const [newQuestion, setNewQuestion] = useState('')

  const addCustomQuestion = () => {
    if (newQuestion.trim()) {
      const currentQuestions = productData.customerInfo.additionalQuestions || []
      const newQuestionObj = {
        id: Date.now(),
        question: newQuestion.trim(),
        required: true,
        type: 'text'
      }
      updateProductData('customerInfo.additionalQuestions', [...currentQuestions, newQuestionObj])
      setNewQuestion('')
    }
  }

  const removeQuestion = (questionId) => {
    const currentQuestions = productData.customerInfo.additionalQuestions || []
    updateProductData('customerInfo.additionalQuestions', 
      currentQuestions.filter(q => q.id !== questionId)
    )
  }

  return (
    <div className="space-y-6">
      {/* Checkout Flow */}
      <div className="space-y-4">
        <h4 className="font-medium">Customize how you would like customers to checkout on this product</h4>
        
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <div className="font-medium">Next Page Checkout</div>
            <div className="text-sm text-muted-foreground">
              Standard checkout experience
            </div>
          </div>
          <Button variant="outline" size="sm">
            Customise
          </Button>
        </div>
      </div>

      {/* Customer Information */}
      <div className="space-y-4">
        <h4 className="font-medium">Customer information</h4>
        
        {/* Email ID with Verification */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <div>
              <div className="font-medium">Email ID</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Verification Code</span>
              <Switch
                checked={productData.customerInfo.emailVerification}
                onCheckedChange={(checked) => updateProductData('customerInfo.emailVerification', checked)}
              />
            </div>
          </div>
        </div>

        {/* Phone Number */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="font-medium">Ask additional questions</Label>
          </div>

          <div className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-500" />
                <span className="font-medium text-red-500">Phone number *</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Verification Code</span>
                  <Switch
                    checked={productData.customerInfo.phoneVerification}
                    onCheckedChange={(checked) => updateProductData('customerInfo.phoneVerification', checked)}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => updateProductData('customerInfo.phoneNumber', false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">Phone number</div>
          </div>

          {/* Add Question Button */}
          <div className="flex gap-2">
            <Input
              placeholder="Add new question"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomQuestion()}
            />
            <Button onClick={addCustomQuestion} disabled={!newQuestion.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>

          {/* Custom Questions List */}
          {productData.customerInfo.additionalQuestions?.map((question) => (
            <div key={question.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{question.question}</div>
                  <div className="text-sm text-muted-foreground">
                    {question.required ? 'Required' : 'Optional'}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeQuestion(question.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CheckoutExperienceSettings