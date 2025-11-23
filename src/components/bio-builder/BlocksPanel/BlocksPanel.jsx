import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { 
  Plus, 
  GripVertical, 
  User,
  Type,
  Link,
  Youtube,
  Mail,
  DollarSign,
  Image,
  Music,
  ShoppingBag,
  MessageSquare,
  Calendar,
  FileText,
  Instagram,
  Trash2
} from 'lucide-react'
import { Switch } from '../../ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog'
import { Button } from '../../ui/button'
import './BlocksPanel.css'

const BLOCK_TYPES = [
  { type: 'header', icon: User, label: 'Header' },
  { type: 'text', icon: Type, label: 'Text' },
  { type: 'links', icon: Link, label: 'Links' },
  { type: 'support', icon: DollarSign, label: 'Support' },
  { type: 'contact', icon: Mail, label: 'Contact form' },
  { type: 'youtube', icon: Youtube, label: 'YouTube' },
  { type: 'instagram', icon: Instagram, label: 'Instagram' },
  { type: 'products', icon: ShoppingBag, label: 'Products' },
  { type: 'gallery', icon: Image, label: 'Gallery' },
  { type: 'music', icon: Music, label: 'Music' },
  { type: 'calendar', icon: Calendar, label: 'Calendar' },
  { type: 'faq', icon: MessageSquare, label: 'FAQ' },
  { type: 'social', icon: Instagram, label: 'Social Links' },
  { type: 'newsletter', icon: Mail, label: 'Newsletter' },
]

function DraggableBlock({ block, isSelected, onSelect, onToggle, onDelete }) {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const blockType = BLOCK_TYPES.find(t => t.type === block.type)
  const Icon = blockType?.icon || FileText

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`block-item ${isSelected ? 'selected' : ''} ${!block.isActive ? 'inactive' : ''}`}
        onClick={() => onSelect(block)}
      >
        <div className="block-drag-handle" {...attributes} {...listeners}>
          <GripVertical className="h-4 w-4" />
        </div>
        
        <div className="block-icon">
          <Icon className="h-3 w-3" />
        </div>
        
        <div className="block-label">
          {blockType?.label || block.type}
        </div>
        
        <div className="block-actions">
          <Switch
            checked={block.isActive}
            onCheckedChange={() => onToggle(block.id)}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="block-more"
            onClick={(e) => {
              e.stopPropagation()
              setShowDeleteDialog(true)
            }}
            title="Delete block"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Block</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {blockType?.label || block.type} block? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(block.id)
                setShowDeleteDialog(false)
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function BlocksPanel({ 
  blocks, 
  selectedBlock, 
  onSelectBlock, 
  onAddBlock, 
  onDeleteBlock, 
  onToggleBlock 
}) {
  const [showAddMenu, setShowAddMenu] = React.useState(false)

  return (
    <div className="blocks-panel">
      {/* Add Block Button */}
      <div className="add-block-container">
        <button 
          className="add-block-button"
          onClick={() => setShowAddMenu(!showAddMenu)}
        >
          <Plus className="h-4 w-4" />
          <span>Add block</span>
        </button>
      </div>

      {/* Add Block Menu */}
      {showAddMenu && (
        <div className="add-block-menu">
          {BLOCK_TYPES.map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              className="add-block-option"
              onClick={() => {
                onAddBlock(type)
                setShowAddMenu(false)
              }}
            >
              <Icon className="h-3 w-3" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Blocks List */}
      <div className="blocks-list">
        {blocks.map((block) => (
          <DraggableBlock
            key={block.id}
            block={block}
            isSelected={selectedBlock?.id === block.id}
            onSelect={onSelectBlock}
            onToggle={onToggleBlock}
            onDelete={onDeleteBlock}
          />
        ))}
        
        {blocks.length === 0 && (
          <div className="empty-blocks">
            <p>No blocks added yet</p>
            <p className="text-sm text-muted">Click "Add block" to get started</p>
          </div>
        )}
      </div>

      {/* Onboarding */}
      {blocks.length === 0 && (
        <div className="onboarding-card">
          <h3>Not sure where to start?</h3>
          <p>Let's walk you through the essentials.</p>
          <button className="watch-tour-button">
            WATCH TOUR
          </button>
        </div>
      )}
    </div>
  )
}