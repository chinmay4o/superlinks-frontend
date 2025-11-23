import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Plus, X, Edit3, Star, User, Quote } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'

export function TestimonialsEditor({ testimonials = [], onChange }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    testimonial: '',
    rating: 5,
    avatar: ''
  })

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      company: '',
      testimonial: '',
      rating: 5,
      avatar: ''
    })
    setEditingTestimonial(null)
  }

  const handleEdit = (testimonial) => {
    setFormData(testimonial)
    setEditingTestimonial(testimonial.id)
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (!formData.name.trim() || !formData.testimonial.trim()) {
      return
    }

    const testimonialData = {
      ...formData,
      id: editingTestimonial || Date.now()
    }

    if (editingTestimonial) {
      const updated = testimonials.map(t => 
        t.id === editingTestimonial ? testimonialData : t
      )
      onChange(updated)
    } else {
      onChange([...testimonials, testimonialData])
    }

    resetForm()
    setIsModalOpen(false)
  }

  const handleDelete = (id) => {
    onChange(testimonials.filter(t => t.id !== id))
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Customer Testimonials</h4>
          <p className="text-sm text-muted-foreground">
            Add customer reviews and testimonials to build trust
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
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Customer Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role/Title</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    placeholder="CEO, Developer, etc."
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company (Optional)</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  placeholder="Company Name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="testimonial">Testimonial *</Label>
                <Textarea
                  id="testimonial"
                  value={formData.testimonial}
                  onChange={(e) => setFormData({...formData, testimonial: e.target.value})}
                  placeholder="This product changed my life..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({...formData, rating: star})}
                      className="hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= formData.rating 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {formData.rating} star{formData.rating !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatar">Avatar URL (Optional)</Label>
                <Input
                  id="avatar"
                  value={formData.avatar}
                  onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                  placeholder="https://example.com/avatar.jpg"
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
                  {editingTestimonial ? 'Update' : 'Add'} Testimonial
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {testimonials.length === 0 ? (
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <Quote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium text-lg mb-2">No testimonials yet</h3>
          <p className="text-muted-foreground mb-4">
            Add customer testimonials to build trust and credibility
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      {testimonial.avatar ? (
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{testimonial.name}</div>
                      {testimonial.role && (
                        <div className="text-sm text-muted-foreground">
                          {testimonial.role}
                          {testimonial.company && ` at ${testimonial.company}`}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(testimonial.rating)}</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(testimonial)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(testimonial.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm italic">&quot;{testimonial.testimonial}&quot;</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {testimonials.length > 0 && (
        <div className="text-center">
          <Badge variant="secondary" className="text-xs">
            {testimonials.length} testimonial{testimonials.length !== 1 ? 's' : ''} added
          </Badge>
        </div>
      )}
    </div>
  )
}

export default TestimonialsEditor