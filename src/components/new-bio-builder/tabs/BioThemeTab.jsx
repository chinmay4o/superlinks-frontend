import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Separator } from '../../ui/separator'
import {
  Palette, Upload, Trash2, Image, Type, Layout
} from 'lucide-react'

const THEME_PRESETS = [
  {
    id: 'default',
    name: 'Default',
    description: 'Clean and simple',
    colors: {
      primaryColor: '#000000',
      backgroundColor: '#ffffff',
      textColor: '#374151',
      borderColor: '#e5e7eb'
    }
  },
  {
    id: 'dawn',
    name: 'Dawn',
    description: 'Warm and welcoming',
    colors: {
      primaryColor: '#f59e0b',
      backgroundColor: '#fefbf3',
      textColor: '#78350f',
      borderColor: '#fed7aa'
    }
  },
  {
    id: 'dusk',
    name: 'Dusk',
    description: 'Dark and modern',
    colors: {
      primaryColor: '#8b5cf6',
      backgroundColor: '#1f2937',
      textColor: '#f9fafb',
      borderColor: '#4b5563'
    }
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Cool and calming',
    colors: {
      primaryColor: '#0ea5e9',
      backgroundColor: '#f0f9ff',
      textColor: '#0c4a6e',
      borderColor: '#bae6fd'
    }
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Natural and earthy',
    colors: {
      primaryColor: '#10b981',
      backgroundColor: '#f0fdf4',
      textColor: '#064e3b',
      borderColor: '#bbf7d0'
    }
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Vibrant and energetic',
    colors: {
      primaryColor: '#ef4444',
      backgroundColor: '#fef2f2',
      textColor: '#7f1d1d',
      borderColor: '#fecaca'
    }
  }
]

const FONT_OPTIONS = [
  { value: 'inter', name: 'Inter', description: 'Modern sans-serif' },
  { value: 'poppins', name: 'Poppins', description: 'Friendly rounded' },
  { value: 'playfair', name: 'Playfair Display', description: 'Elegant serif' },
  { value: 'source-sans', name: 'Source Sans Pro', description: 'Clean professional' },
  { value: 'montserrat', name: 'Montserrat', description: 'Bold and strong' }
]

const BUTTON_STYLES = [
  { value: 'rounded', name: 'Rounded', preview: 'rounded-lg' },
  { value: 'sharp', name: 'Sharp', preview: 'rounded-none' },
  { value: 'pill', name: 'Pill', preview: 'rounded-full' }
]

const LAYOUT_OPTIONS = [
  { value: 'center', name: 'Center', description: 'Centered content' },
  { value: 'left', name: 'Left', description: 'Left-aligned content' },
  { value: 'full', name: 'Full Width', description: 'Full width content' }
]

export default function BioThemeTab({ 
  bio, 
  theme, 
  onUpdateTheme, 
  onUploadImage, 
  loading 
}) {
  const [activePreset, setActivePreset] = useState(theme?.theme || 'default')
  const [customColors, setCustomColors] = useState({
    primaryColor: theme?.primaryColor || '#000000',
    backgroundColor: theme?.backgroundColor || '#ffffff',
    textColor: theme?.textColor || '#374151',
    borderColor: theme?.borderColor || '#e5e7eb'
  })
  const [uploading, setUploading] = useState(false)

  const handlePresetSelect = (preset) => {
    setActivePreset(preset.id)
    setCustomColors(preset.colors)
    onUpdateTheme({
      theme: preset.id,
      ...preset.colors,
      fontFamily: theme?.fontFamily || 'inter',
      buttonStyle: theme?.buttonStyle || 'rounded',
      layout: theme?.layout || 'center'
    })
  }

  const handleColorChange = (colorKey, value) => {
    const newColors = { ...customColors, [colorKey]: value }
    setCustomColors(newColors)
    onUpdateTheme({
      theme: 'custom',
      ...newColors,
      fontFamily: theme?.fontFamily || 'inter',
      buttonStyle: theme?.buttonStyle || 'rounded',
      layout: theme?.layout || 'center'
    })
    setActivePreset('custom')
  }

  const handleStyleChange = (styleKey, value) => {
    onUpdateTheme({
      ...theme,
      [styleKey]: value
    })
  }

  const handleImageUpload = async (event, imageType) => {
    const file = event.target.files[0]
    if (!file) return

    try {
      setUploading(true)
      const result = await onUploadImage(file, imageType)
      
      if (imageType === 'background') {
        onUpdateTheme({
          ...theme,
          backgroundImage: result.url
        })
      } else if (imageType === 'avatar') {
        onUpdateTheme({
          ...theme,
          avatarUrl: result.url
        })
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Theme Presets */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme Presets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {THEME_PRESETS.map((preset) => (
              <div
                key={preset.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  activePreset === preset.id 
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handlePresetSelect(preset)}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div 
                    className="w-4 h-4 rounded-full border-2"
                    style={{ 
                      backgroundColor: preset.colors.primaryColor,
                      borderColor: preset.colors.borderColor 
                    }}
                  />
                  <span className="font-medium text-sm">{preset.name}</span>
                </div>
                <p className="text-xs text-gray-500">{preset.description}</p>
                <div className="flex gap-1 mt-2">
                  <div 
                    className="w-3 h-3 rounded-sm" 
                    style={{ backgroundColor: preset.colors.backgroundColor }}
                    title="Background"
                  />
                  <div 
                    className="w-3 h-3 rounded-sm" 
                    style={{ backgroundColor: preset.colors.primaryColor }}
                    title="Primary"
                  />
                  <div 
                    className="w-3 h-3 rounded-sm" 
                    style={{ backgroundColor: preset.colors.textColor }}
                    title="Text"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Custom Colors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  id="primary-color"
                  type="color"
                  value={customColors.primaryColor}
                  onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                  className="w-12 h-10 p-1 border rounded"
                />
                <Input
                  value={customColors.primaryColor}
                  onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="bg-color">Background</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  id="bg-color"
                  type="color"
                  value={customColors.backgroundColor}
                  onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                  className="w-12 h-10 p-1 border rounded"
                />
                <Input
                  value={customColors.backgroundColor}
                  onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                  placeholder="#ffffff"
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="text-color">Text Color</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  id="text-color"
                  type="color"
                  value={customColors.textColor}
                  onChange={(e) => handleColorChange('textColor', e.target.value)}
                  className="w-12 h-10 p-1 border rounded"
                />
                <Input
                  value={customColors.textColor}
                  onChange={(e) => handleColorChange('textColor', e.target.value)}
                  placeholder="#374151"
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="border-color">Border Color</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  id="border-color"
                  type="color"
                  value={customColors.borderColor}
                  onChange={(e) => handleColorChange('borderColor', e.target.value)}
                  className="w-12 h-10 p-1 border rounded"
                />
                <Input
                  value={customColors.borderColor}
                  onChange={(e) => handleColorChange('borderColor', e.target.value)}
                  placeholder="#e5e7eb"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Type className="h-5 w-5" />
            Typography
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Label>Font Family</Label>
            <div className="grid grid-cols-1 gap-2">
              {FONT_OPTIONS.map((font) => (
                <div
                  key={font.value}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    theme?.fontFamily === font.value 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleStyleChange('fontFamily', font.value)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-sm">{font.name}</span>
                      <p className="text-xs text-gray-500">{font.description}</p>
                    </div>
                    <span 
                      className="text-lg"
                      style={{ fontFamily: font.value }}
                    >
                      Aa
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Button Style */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Button Style</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {BUTTON_STYLES.map((style) => (
              <div
                key={style.value}
                className={`p-3 border rounded-lg cursor-pointer transition-all text-center ${
                  theme?.buttonStyle === style.value 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleStyleChange('buttonStyle', style.value)}
              >
                <div className="space-y-2">
                  <div 
                    className={`h-8 bg-gray-800 text-white text-xs flex items-center justify-center ${style.preview}`}
                  >
                    Button
                  </div>
                  <span className="text-sm font-medium">{style.name}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Layout */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Layout className="h-5 w-5" />
            Layout
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {LAYOUT_OPTIONS.map((layout) => (
              <div
                key={layout.value}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  theme?.layout === layout.value 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleStyleChange('layout', layout.value)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-sm">{layout.name}</span>
                    <p className="text-xs text-gray-500">{layout.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Background Image */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Image className="h-5 w-5" />
            Background
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {theme?.backgroundImage ? (
            <div className="space-y-3">
              <div className="relative">
                <img 
                  src={theme.backgroundImage} 
                  alt="Background" 
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => handleStyleChange('backgroundImage', null)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-3">Upload background image</p>
              <Button
                variant="outline"
                size="sm"
                disabled={uploading}
                onClick={() => document.getElementById('background-upload').click()}
              >
                {uploading ? 'Uploading...' : 'Choose Image'}
              </Button>
              <input
                id="background-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, 'background')}
              />
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  )
}