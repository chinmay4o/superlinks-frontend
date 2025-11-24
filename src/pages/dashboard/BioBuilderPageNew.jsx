import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Separator } from '../../components/ui/separator'
import { 
  ArrowLeft, Edit3, Eye, Smartphone, Monitor,
  Palette, Settings, Share2
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext'
import { useBioDataSimple } from '../../hooks/useBioDataSimple'

// Import tab components (from new-bio-builder)
import BioContentTab from '../../components/new-bio-builder/tabs/BioContentTab'
import BioThemeTab from '../../components/new-bio-builder/tabs/BioThemeTab'
import BioSettingsTab from '../../components/new-bio-builder/tabs/BioSettingsTab'
import BioLivePreview from '../../components/new-bio-builder/BioLivePreview'

// Import CSS
import '../../styles/bio-builder.css'

export function BioBuilderPageNew() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('content')
  const [previewMode, setPreviewMode] = useState('mobile') // 'mobile' | 'desktop'

  // Use the simplified bio data hook
  const {
    bioData,
    selectedBlock,
    selectedBlockId,
    loading,
    saving,
    handleInputChange,
    updateProfile,
    updateCustomization,
    updateSettings,
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    toggleBlockVisibility,
    uploadImage,
    saveChanges,
    resetBio,
    setSelectedBlockId,
    refresh
  } = useBioDataSimple()

  const handleSave = async (isDraft = false) => {
    try {
      await saveChanges()
      
      if (isDraft) {
        toast.success('Bio saved as draft!')
      } else {
        toast.success('Bio published successfully!')
      }
    } catch (error) {
      toast.error('Failed to save bio')
      console.error('Error saving bio:', error)
    }
  }

  const handleShare = () => {
    const bioUrl = `https://superlinks.ai/${user?.username}`
    navigator.clipboard.writeText(bioUrl)
    toast.success('Bio URL copied to clipboard!')
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bio builder...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bio-builder-container">
      {/* Header Bar */}
      <header className="bio-builder-header">
        <div className="max-w-full mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="bio-button-secondary"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <h1 className="font-semibold text-lg">
                Bio Builder
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>superlinks.ai/{user?.username}</span>
                <Button variant="ghost" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <Button 
                variant="outline" 
                size="sm" 
                disabled={saving} 
                onClick={() => handleSave(true)}
                className="bio-button-secondary"
              >
                {saving ? 'Saving...' : 'Save Draft'}
              </Button>
              <Button 
                onClick={() => handleSave(false)} 
                disabled={saving} 
                size="sm"
                className="bio-button-primary"
              >
                {saving ? 'Saving...' : 'Publish Bio'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - 40/60 Split */}
      <div className="bio-builder-main">
        {/* Left Panel - Form Content (40%) */}
        <div className="bio-builder-left-panel">
          <div className="p-6">
            {/* Tab Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bio-tabs-list grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="content" className="bio-tabs-trigger flex items-center gap-2">
                  <Edit3 className="h-4 w-4" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="theme" className="bio-tabs-trigger flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Theme
                </TabsTrigger>
                <TabsTrigger value="settings" className="bio-tabs-trigger flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </TabsTrigger>
              </TabsList>

              {/* Tab Content */}
              <TabsContent value="content" className="space-y-6">
                <BioContentTab
                  bio={bioData}
                  blocks={bioData.blocks}
                  selectedBlock={selectedBlock}
                  onSelectBlock={setSelectedBlockId}
                  onAddBlock={addBlock}
                  onUpdateBlock={updateBlock}
                  onDeleteBlock={deleteBlock}
                  onToggleBlock={toggleBlockVisibility}
                  onReorderBlocks={reorderBlocks}
                  onUpdateBio={updateProfile}
                  loading={loading}
                />
              </TabsContent>

              <TabsContent value="theme" className="space-y-6">
                <BioThemeTab
                  bio={bioData}
                  theme={bioData.customization}
                  onUpdateTheme={updateCustomization}
                  onUploadImage={uploadImage}
                  loading={loading}
                />
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <BioSettingsTab
                  bio={bioData}
                  user={user}
                  onUpdateSettings={updateSettings}
                  onResetBio={resetBio}
                  loading={loading}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right Panel - Live Preview (60%) */}
        <div className="bio-builder-right-panel">
          <div className="h-full flex flex-col">
            {/* Preview Header */}
            <div className="preview-panel-header flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <h2 className="font-medium">Preview</h2>
                {saving && (
                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    Saving...
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={previewMode === 'mobile' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('mobile')}
                  className={`preview-mode-button ${previewMode === 'mobile' ? 'active' : ''}`}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
                <Button
                  variant={previewMode === 'desktop' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('desktop')}
                  className={`preview-mode-button ${previewMode === 'desktop' ? 'active' : ''}`}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-hidden">
              <BioLivePreview
                bio={bioData}
                blocks={bioData.blocks?.filter(b => b.isActive) || []}
                theme={bioData.customization}
                username={user?.username}
                previewMode={previewMode}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BioBuilderPageNew