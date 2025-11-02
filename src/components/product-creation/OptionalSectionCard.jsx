import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Switch } from '../ui/switch'
import { cn } from '../../lib/utils'

export function OptionalSectionCard({ 
  icon: Icon, 
  title, 
  enabled, 
  onToggle, 
  className 
}) {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md",
        enabled ? "ring-2 ring-primary bg-primary/5" : "",
        className
      )}
      onClick={() => onToggle(!enabled)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg transition-colors",
              enabled ? "bg-primary text-primary-foreground" : "bg-muted"
            )}>
              <Icon className="h-4 w-4" />
            </div>
            <span className="font-medium">{title}</span>
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={onToggle}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default OptionalSectionCard