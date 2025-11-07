import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Plus, X, Edit3, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible'

export function FAQEditor({ faqs = [], onChange }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingFAQ, setEditingFAQ] = useState(null)
  const [formData, setFormData] = useState({
    question: '',
    answer: ''
  })
  const [openItems, setOpenItems] = useState(new Set())

  const resetForm = () => {
    setFormData({
      question: '',
      answer: ''
    })
    setEditingFAQ(null)
  }

  const handleEdit = (faq) => {
    setFormData(faq)
    setEditingFAQ(faq.id)
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (!formData.question.trim() || !formData.answer.trim()) {
      return
    }

    const faqData = {
      ...formData,
      id: editingFAQ || Date.now()
    }

    if (editingFAQ) {
      const updated = faqs.map(f => 
        f.id === editingFAQ ? faqData : f
      )
      onChange(updated)
    } else {
      onChange([...faqs, faqData])
    }

    resetForm()
    setIsModalOpen(false)
  }

  const handleDelete = (id) => {
    onChange(faqs.filter(f => f.id !== id))
  }

  const toggleItem = (id) => {
    const newOpenItems = new Set(openItems)
    if (openItems.has(id)) {
      newOpenItems.delete(id)
    } else {
      newOpenItems.add(id)
    }
    setOpenItems(newOpenItems)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Frequently Asked Questions</h4>
          <p className="text-sm text-muted-foreground">
            Add common questions and answers to help customers
          </p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                resetForm()
                setIsModalOpen(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add FAQ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingFAQ ? 'Edit FAQ' : 'Add New FAQ'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question">Question *</Label>
                <Input
                  id="question"
                  value={formData.question}
                  onChange={(e) => setFormData({...formData, question: e.target.value})}
                  placeholder="What is your refund policy?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="answer">Answer *</Label>
                <Textarea
                  id="answer"
                  value={formData.answer}
                  onChange={(e) => setFormData({...formData, answer: e.target.value})}
                  placeholder="We offer a 30-day money-back guarantee..."
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    resetForm()
                    setIsModalOpen(false)
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {editingFAQ ? 'Update' : 'Add'} FAQ
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {faqs.length === 0 ? (
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium text-lg mb-2">No FAQs yet</h3>
          <p className="text-muted-foreground mb-4">
            Add frequently asked questions to help your customers
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <Card key={faq.id} className="overflow-hidden">
              <Collapsible 
                open={openItems.has(faq.id)} 
                onOpenChange={() => toggleItem(faq.id)}
              >
                <CollapsibleTrigger asChild>
                  <div className="w-full p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-primary">
                            {index + 1}
                          </span>
                        </div>
                        <div className="text-left flex-1">
                          <h4 className="font-medium text-sm pr-4">{faq.question}</h4>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEdit(faq)
                          }}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(faq.id)
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        {openItems.has(faq.id) ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-4 pb-4 pl-16">
                    <div className="border-l-2 border-muted pl-4">
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      )}

      {faqs.length > 0 && (
        <div className="text-center">
          <Badge variant="secondary" className="text-xs">
            {faqs.length} FAQ{faqs.length !== 1 ? 's' : ''} added
          </Badge>
        </div>
      )}
    </div>
  )
}

export default FAQEditor