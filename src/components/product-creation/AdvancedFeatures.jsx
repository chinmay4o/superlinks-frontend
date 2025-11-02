import React from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Edit, Info } from 'lucide-react'

export function AdvancedFeatures({ productData, updateProductData }) {
  return (
    <div className="space-y-6">
      {/* Page URL */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">Page URL</h4>
            <Info className="h-4 w-4 text-muted-foreground" />
          </div>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          Customise the slug of your page URL
        </div>
      </div>

      {/* Post Purchase Behaviour */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Post Purchase Behaviour</h4>
            <div className="text-sm text-muted-foreground">
              Define what needs to happen when someone complete the purchase
            </div>
          </div>
          <Button variant="outline" size="sm">
            Setup
          </Button>
        </div>
      </div>

      {/* Tracking */}
      <div className="space-y-6">
        <h4 className="font-medium">Tracking</h4>
        
        {/* Meta Pixel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Meta Pixel</div>
              <div className="text-sm text-muted-foreground">
                Connect your Pixel IDs to this product to run re-marketing campaigns on Meta Business
              </div>
            </div>
            <Button variant="outline" size="sm">
              Setup
            </Button>
          </div>
        </div>

        {/* Google Analytics */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Google Analytics</div>
              <div className="text-sm text-muted-foreground">
                Add your Google Analytics Tracking IDs to get crucial visitor-level data on your GA dashboard.
              </div>
            </div>
            <Button variant="outline" size="sm">
              Setup
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdvancedFeatures