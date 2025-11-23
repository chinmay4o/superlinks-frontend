import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Plus, X, Phone, User, Mail } from 'lucide-react'

export function CheckoutExperienceSettings({ productData, updateProductData }) {
  const [newQuestion, setNewQuestion] = useState('')
  const [questionType, setQuestionType] = useState('text')

  const addCustomQuestion = () => {
    if (newQuestion.trim()) {
      const currentQuestions = productData.customerInfo.additionalQuestions || []
      const newQuestionObj = {
        id: Date.now(),
        question: newQuestion.trim(),
        required: true,
        type: questionType
      }
      updateProductData('customerInfo.additionalQuestions', [...currentQuestions, newQuestionObj])
      setNewQuestion('')
      setQuestionType('text')
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
              Standard checkout experience - customize customer information fields below
            </div>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="space-y-4">
        <h4 className="font-medium">Customer information</h4>
        
        {/* Customer Name */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-blue-500" />
                <div>
                  <div className="font-medium">Customer Name</div>
                  <div className="text-sm text-muted-foreground">Collect customer's full name</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Required</span>
                  <Switch
                    checked={productData.customerInfo.nameRequired}
                    onCheckedChange={(checked) => updateProductData('customerInfo.nameRequired', checked)}
                    disabled={!productData.customerInfo.collectName}
                  />
                </div>
                <Switch
                  checked={productData.customerInfo.collectName}
                  onCheckedChange={(checked) => {
                    updateProductData('customerInfo.collectName', checked)
                    if (!checked) {
                      updateProductData('customerInfo.nameRequired', false)
                    }
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email with Verification */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-green-500" />
                <div>
                  <div className="font-medium">Email Address</div>
                  <div className="text-sm text-muted-foreground">Always collected for delivery</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Email Verification</span>
                <Switch
                  checked={productData.customerInfo.emailVerification}
                  onCheckedChange={(checked) => updateProductData('customerInfo.emailVerification', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Phone Number */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-blue-500" />
                <div>
                  <div className="font-medium">Phone Number</div>
                  <div className="text-sm text-muted-foreground">Collect customer's phone number</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">SMS Verification</span>
                  <Switch
                    checked={productData.customerInfo.phoneVerification}
                    onCheckedChange={(checked) => updateProductData('customerInfo.phoneVerification', checked)}
                    disabled={!productData.customerInfo.collectPhoneNumber}
                  />
                </div>
                <Switch
                  checked={productData.customerInfo.collectPhoneNumber}
                  onCheckedChange={(checked) => {
                    updateProductData('customerInfo.collectPhoneNumber', checked)
                    if (!checked) {
                      updateProductData('customerInfo.phoneVerification', false)
                    }
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Custom Questions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="font-medium">Additional Questions</Label>
          </div>

          {/* Add Question Form */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter your question (e.g., What's your company name?)"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCustomQuestion()}
                    className="flex-1"
                  />
                  <Select value={questionType} onValueChange={setQuestionType}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="textarea">Long Text</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="tel">Phone</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={addCustomQuestion} disabled={!newQuestion.trim()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Add custom questions to collect additional information from customers
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Custom Questions List */}
          {productData.customerInfo.additionalQuestions?.length > 0 && (
            <div className="space-y-3">
              {productData.customerInfo.additionalQuestions.map((question) => (
                <Card key={question.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{question.question}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {question.type === 'textarea' ? 'Long Text' : 
                             question.type === 'tel' ? 'Phone' : 
                             question.type.charAt(0).toUpperCase() + question.type.slice(1)}
                          </Badge>
                          <Badge variant={question.required ? "default" : "secondary"} className="text-xs">
                            {question.required ? 'Required' : 'Optional'}
                          </Badge>
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
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {productData.customerInfo.additionalQuestions?.length === 0 && (
            <div className="text-center py-6 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground text-sm">
                No additional questions added yet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CheckoutExperienceSettings