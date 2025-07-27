import React, { useState } from 'react'
import { Button } from '../../components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import VisualBioBuilder from '../../components/bio-builder/VisualBioBuilder'

export function BioBuilderPage() {
  const navigate = useNavigate()

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header - Only show on mobile/tablet */}
      <div className="flex items-center justify-between p-4 bg-white border-b lg:hidden">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-semibold">Bio Builder</h1>
        </div>
      </div>
      
      {/* Visual Builder takes full screen */}
      <div className="flex-1 overflow-hidden">
        <VisualBioBuilder />
      </div>
    </div>
  )
}