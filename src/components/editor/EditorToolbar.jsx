import React from 'react'
import { Button } from '../ui/button'
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Link as LinkIcon, 
  Image as ImageIcon,
  Youtube as YoutubeIcon,
  Code,
  Quote,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Heading3,
  Type,
  Highlighter,
  FileText,
  Play,
  Volume2
} from 'lucide-react'

const EditorToolbar = ({ 
  editor, 
  onAddLink, 
  onAddImage, 
  onAddYoutube,
  onAddFile,
  onAddVideo,
  onAddAudio 
}) => {
  if (!editor) {
    return null
  }

  const ToolbarButton = ({ 
    variant = 'ghost', 
    size = 'sm', 
    onClick, 
    disabled = false,
    title, 
    children, 
    active = false 
  }) => (
    <Button
      variant={active ? 'default' : variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="h-8 w-8"
    >
      {children}
    </Button>
  )

  return (
    <div className="flex flex-wrap gap-1 p-3 border-b border-gray-200">
      {/* Text Formatting */}
      <ToolbarButton
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold (Ctrl+B)"
      >
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      
      <ToolbarButton
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic (Ctrl+I)"
      >
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      
      <ToolbarButton
        active={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="Underline (Ctrl+U)"
      >
        <UnderlineIcon className="h-4 w-4" />
      </ToolbarButton>
      
      <ToolbarButton
        active={editor.isActive('highlight')}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        title="Highlight"
      >
        <Highlighter className="h-4 w-4" />
      </ToolbarButton>

      <div className="w-px h-8 bg-gray-300 mx-1" />

      {/* Headings */}
      <ToolbarButton
        active={editor.isActive('heading', { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        title="Heading 1"
      >
        <Heading1 className="h-4 w-4" />
      </ToolbarButton>
      
      <ToolbarButton
        active={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        title="Heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </ToolbarButton>
      
      <ToolbarButton
        active={editor.isActive('heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        title="Heading 3"
      >
        <Heading3 className="h-4 w-4" />
      </ToolbarButton>
      
      <ToolbarButton
        active={editor.isActive('paragraph')}
        onClick={() => editor.chain().focus().setParagraph().run()}
        title="Paragraph"
      >
        <Type className="h-4 w-4" />
      </ToolbarButton>

      <div className="w-px h-8 bg-gray-300 mx-1" />

      {/* Lists */}
      <ToolbarButton
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </ToolbarButton>
      
      <ToolbarButton
        active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Ordered List"
      >
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>
      
      <ToolbarButton
        active={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        title="Quote"
      >
        <Quote className="h-4 w-4" />
      </ToolbarButton>
      
      <ToolbarButton
        active={editor.isActive('codeBlock')}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        title="Code Block"
      >
        <Code className="h-4 w-4" />
      </ToolbarButton>

      <div className="w-px h-8 bg-gray-300 mx-1" />

      {/* Alignment */}
      <ToolbarButton
        active={editor.isActive({ textAlign: 'left' })}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        title="Align Left"
      >
        <AlignLeft className="h-4 w-4" />
      </ToolbarButton>
      
      <ToolbarButton
        active={editor.isActive({ textAlign: 'center' })}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        title="Align Center"
      >
        <AlignCenter className="h-4 w-4" />
      </ToolbarButton>
      
      <ToolbarButton
        active={editor.isActive({ textAlign: 'right' })}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        title="Align Right"
      >
        <AlignRight className="h-4 w-4" />
      </ToolbarButton>
      
      <ToolbarButton
        active={editor.isActive({ textAlign: 'justify' })}
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        title="Justify"
      >
        <AlignJustify className="h-4 w-4" />
      </ToolbarButton>

      <div className="w-px h-8 bg-gray-300 mx-1" />

      {/* Media */}
      <ToolbarButton
        onClick={onAddLink}
        title="Add Link"
      >
        <LinkIcon className="h-4 w-4" />
      </ToolbarButton>
      
      <ToolbarButton
        onClick={onAddImage}
        title="Add Image"
      >
        <ImageIcon className="h-4 w-4" />
      </ToolbarButton>
      
      <ToolbarButton
        onClick={onAddYoutube}
        title="Add YouTube Video"
      >
        <YoutubeIcon className="h-4 w-4" />
      </ToolbarButton>

      {/* File Upload Options */}
      <ToolbarButton
        onClick={onAddFile}
        title="Add File Download"
      >
        <FileText className="h-4 w-4" />
      </ToolbarButton>
      
      <ToolbarButton
        onClick={onAddVideo}
        title="Add Video"
      >
        <Play className="h-4 w-4" />
      </ToolbarButton>
      
      <ToolbarButton
        onClick={onAddAudio}
        title="Add Audio"
      >
        <Volume2 className="h-4 w-4" />
      </ToolbarButton>

      <div className="w-px h-8 bg-gray-300 mx-1" />

      {/* Undo/Redo */}
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo (Ctrl+Z)"
      >
        <Undo className="h-4 w-4" />
      </ToolbarButton>
      
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo (Ctrl+Y)"
      >
        <Redo className="h-4 w-4" />
      </ToolbarButton>
    </div>
  )
}

export { EditorToolbar }