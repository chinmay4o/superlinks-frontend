import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Check } from 'lucide-react'

const THEMES = [
  { 
    value: 'default', 
    label: 'Default',
    description: 'Clean and professional',
    primaryColor: '#6366f1'
  },
  { 
    value: 'dawn', 
    label: 'Dawn',
    description: 'Light and airy',
    primaryColor: '#f59e0b'
  },
  { 
    value: 'dusk', 
    label: 'Dusk',
    description: 'Dark and modern',
    primaryColor: '#8b5cf6'
  }
]

export function ThemeSelector({ selectedTheme, onThemeChange }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {THEMES.map((theme) => (
          <Card 
            key={theme.value}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedTheme === theme.value 
                ? 'ring-2 ring-primary' 
                : ''
            }`}
            onClick={() => onThemeChange(theme.value)}
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Theme Preview */}
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg relative overflow-hidden">
                  <div className="absolute inset-0 p-2">
                    <div className="bg-white rounded shadow-sm h-full flex flex-col">
                      <div className="h-2 bg-gray-200 rounded mb-1"></div>
                      <div className="flex-1 flex items-center justify-center">
                        <div 
                          className="w-8 h-8 rounded"
                          style={{ backgroundColor: theme.primaryColor }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  {selectedTheme === theme.value && (
                    <div className="absolute top-2 right-2">
                      <div className="bg-primary text-primary-foreground rounded-full p-1">
                        <Check className="h-3 w-3" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Theme Info */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{theme.label}</h3>
                    {selectedTheme === theme.value && (
                      <Badge variant="default" className="text-xs">Selected</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{theme.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Style Customization */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Style</h4>
            <p className="text-sm text-muted-foreground">
              The default style uses the same styling you have on your store. This helps
              your store and all your products to look consistent and create a seamless
              store experience to your site visitors.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Change
            </Button>
            <Button variant="ghost" size="sm">
              Reset to default
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThemeSelector