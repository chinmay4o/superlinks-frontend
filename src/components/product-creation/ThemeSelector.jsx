import React, { useState } from 'react'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Check } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import toast from 'react-hot-toast'

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

export function ThemeSelector({ selectedTheme, onThemeChange, productData, updateProductData }) {
  const [customizeModal, setCustomizeModal] = useState(false)
  const [customColors, setCustomColors] = useState({
    primaryColor: productData?.customization?.primaryColor || '#6366f1',
    backgroundColor: productData?.customization?.backgroundColor || '#ffffff',
    textColor: productData?.customization?.textColor || '#000000'
  })

  const handleResetToDefault = () => {
    onThemeChange('default')
    updateProductData('customization.primaryColor', '#6366f1')
    updateProductData('customization.backgroundColor', '#ffffff')
    updateProductData('customization.textColor', '#000000')
    toast.success('Theme reset to default')
  }

  const handleSaveCustomization = () => {
    updateProductData('customization.primaryColor', customColors.primaryColor)
    updateProductData('customization.backgroundColor', customColors.backgroundColor)
    updateProductData('customization.textColor', customColors.textColor)
    setCustomizeModal(false)
    toast.success('Custom styling saved')
  }

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
            <Dialog open={customizeModal} onOpenChange={setCustomizeModal}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Change
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Customize Theme Colors</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={customColors.primaryColor}
                        onChange={(e) => setCustomColors(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={customColors.primaryColor}
                        onChange={(e) => setCustomColors(prev => ({ ...prev, primaryColor: e.target.value }))}
                        placeholder="#6366f1"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backgroundColor">Background Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="backgroundColor"
                        type="color"
                        value={customColors.backgroundColor}
                        onChange={(e) => setCustomColors(prev => ({ ...prev, backgroundColor: e.target.value }))}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={customColors.backgroundColor}
                        onChange={(e) => setCustomColors(prev => ({ ...prev, backgroundColor: e.target.value }))}
                        placeholder="#ffffff"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="textColor">Text Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="textColor"
                        type="color"
                        value={customColors.textColor}
                        onChange={(e) => setCustomColors(prev => ({ ...prev, textColor: e.target.value }))}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={customColors.textColor}
                        onChange={(e) => setCustomColors(prev => ({ ...prev, textColor: e.target.value }))}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setCustomizeModal(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveCustomization}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="ghost" size="sm" onClick={handleResetToDefault}>
              Reset to default
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThemeSelector