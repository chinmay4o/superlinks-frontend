import React from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import RichTextEditor from '../editor/RichTextEditorSimple'
import { User } from 'lucide-react'

export function AboutMeEditor({ aboutMeData, onChange }) {
  const handleUpdate = (field, value) => {
    onChange({
      ...aboutMeData,
      [field]: value
    })
  }

  const data = aboutMeData || {
    title: '',
    content: '',
    name: '',
    role: '',
    company: '',
    profileImage: ''
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <User className="h-5 w-5 text-primary" />
        <div>
          <h4 className="font-medium">About Me Section</h4>
          <p className="text-sm text-muted-foreground">
            Tell your audience about yourself and build trust
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => handleUpdate('name', e.target.value)}
              placeholder="John Doe"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role/Title</Label>
            <Input
              id="role"
              value={data.role}
              onChange={(e) => handleUpdate('role', e.target.value)}
              placeholder="CEO, Developer, Designer, etc."
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company (Optional)</Label>
          <Input
            id="company"
            value={data.company}
            onChange={(e) => handleUpdate('company', e.target.value)}
            placeholder="Your Company Name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="profileImage">Profile Image URL (Optional)</Label>
          <Input
            id="profileImage"
            value={data.profileImage}
            onChange={(e) => handleUpdate('profileImage', e.target.value)}
            placeholder="https://example.com/your-photo.jpg"
          />
          {data.profileImage && (
            <div className="mt-2">
              <img 
                src={data.profileImage} 
                alt="Profile preview"
                className="w-16 h-16 rounded-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            </div>
          )}
        </div>

        {/* Section Title */}
        <div className="space-y-2">
          <Label htmlFor="sectionTitle">Section Title (Optional)</Label>
          <Input
            id="sectionTitle"
            value={data.title}
            onChange={(e) => handleUpdate('title', e.target.value)}
            placeholder="About the Creator"
          />
        </div>

        {/* About Me Content */}
        <div className="space-y-2">
          <Label>About Me Content *</Label>
          <RichTextEditor
            value={data.content}
            onChange={(value) => handleUpdate('content', value)}
            placeholder="Tell your audience about yourself, your background, expertise, and why they should trust you. Share your story, experience, and what makes you unique..."
          />
          <p className="text-xs text-muted-foreground">
            Share your background, expertise, achievements, or anything that helps build trust with your audience.
          </p>
        </div>
      </div>

      {/* Preview */}
      {(data.name || data.content) && (
        <div className="mt-6 p-4 border rounded-lg bg-muted/30">
          <h5 className="font-medium text-sm mb-3 text-muted-foreground">Preview</h5>
          <div className="bg-background p-4 rounded border">
            {data.title && (
              <h3 className="text-lg font-semibold mb-4">{data.title}</h3>
            )}
            <div className="flex items-start gap-4">
              {data.profileImage && (
                <img 
                  src={data.profileImage} 
                  alt={data.name}
                  className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1">
                {data.name && (
                  <div className="mb-2">
                    <h4 className="font-medium">{data.name}</h4>
                    {data.role && (
                      <p className="text-sm text-muted-foreground">
                        {data.role}{data.company && ` at ${data.company}`}
                      </p>
                    )}
                  </div>
                )}
                {data.content && (
                  <div 
                    className="text-sm prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: data.content }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AboutMeEditor