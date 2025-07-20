import React, { useState, useCallback, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import Youtube from '@tiptap/extension-youtube'
import Color from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import { useFileUpload } from '../../hooks/useFileUpload'

import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter 
} from '../ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu'
import { Separator } from '../ui/separator'
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
  Undo,
  Redo,
  Type,
  Highlighter,
  ChevronDown,
  Upload,
  Link2,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow
} from 'lucide-react'

import './editor-new.css'

const MenuBar = ({ editor }) => {
  const [linkUrl, setLinkUrl] = useState('')
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [youtubeDialogOpen, setYoutubeDialogOpen] = useState(false)
  const fileInputRef = useRef(null)

  const { uploadFile, isUploading } = useFileUpload({
    onUploadComplete: ({ result }) => {
      if (result?.file?.url) {
        editor.chain().focus().setImage({ src: result.file.url }).run()
      }
    },
    onUploadError: (error) => {
      console.error('Image upload failed:', error)
      alert('Failed to upload image. Please try again.')
    }
  })

  const handleImageUpload = useCallback(async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Image size must be less than 10MB')
      return
    }

    await uploadFile(file, {
      uploadType: 'content',
      folder: 'images'
    })

    event.target.value = ''
  }, [uploadFile])

  const addLink = useCallback(() => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run()
      setLinkUrl('')
      setLinkDialogOpen(false)
    }
  }, [editor, linkUrl])

  const addImage = useCallback(() => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run()
      setImageUrl('')
      setImageDialogOpen(false)
    }
  }, [editor, imageUrl])

  const addYoutube = useCallback(() => {
    if (youtubeUrl) {
      editor.chain().focus().setYoutubeVideo({ src: youtubeUrl }).run()
      setYoutubeUrl('')
      setYoutubeDialogOpen(false)
    }
  }, [editor, youtubeUrl])

  if (!editor) {
    return null
  }

  return (
    <div className="editor-toolbar">
      {/* Text Styles */}
      <div className="toolbar-group">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="toolbar-button">
              <Type className="h-4 w-4 mr-2" />
              <span className="mr-1">
                {editor.isActive('heading', { level: 1 }) && 'Heading 1'}
                {editor.isActive('heading', { level: 2 }) && 'Heading 2'}
                {editor.isActive('heading', { level: 3 }) && 'Heading 3'}
                {!editor.isActive('heading') && 'Paragraph'}
              </span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => editor.chain().focus().setParagraph().run()}>
              <Pilcrow className="h-4 w-4 mr-2" />
              Paragraph
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
              <Heading1 className="h-4 w-4 mr-2" />
              Heading 1
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
              <Heading2 className="h-4 w-4 mr-2" />
              Heading 2
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
              <Heading3 className="h-4 w-4 mr-2" />
              Heading 3
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Text Formatting */}
      <div className="toolbar-group">
        <Button
          variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="toolbar-button"
          title="Bold (Cmd+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="toolbar-button"
          title="Italic (Cmd+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <Button
          variant={editor.isActive('underline') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className="toolbar-button"
          title="Underline (Cmd+U)"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        
        <Button
          variant={editor.isActive('highlight') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className="toolbar-button"
          title="Highlight"
        >
          <Highlighter className="h-4 w-4" />
        </Button>

        <Button
          variant={editor.isActive('code') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className="toolbar-button"
          title="Inline Code"
        >
          <Code className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Lists & Blocks */}
      <div className="toolbar-group">
        <Button
          variant={editor.isActive('bulletList') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="toolbar-button"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        
        <Button
          variant={editor.isActive('orderedList') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="toolbar-button"
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        
        <Button
          variant={editor.isActive('blockquote') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className="toolbar-button"
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Alignment */}
      <div className="toolbar-group">
        <Button
          variant={editor.isActive({ textAlign: 'left' }) ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className="toolbar-button"
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant={editor.isActive({ textAlign: 'center' }) ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className="toolbar-button"
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        
        <Button
          variant={editor.isActive({ textAlign: 'right' }) ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className="toolbar-button"
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Media & Links */}
      <div className="toolbar-group">
        <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant={editor.isActive('link') ? 'secondary' : 'ghost'}
              size="sm"
              className="toolbar-button"
              title="Add Link"
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Link</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="link-url">URL</Label>
                <Input
                  id="link-url"
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addLink()}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addLink} disabled={!linkUrl}>
                Add Link
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="toolbar-button"
              title="Add Image"
              disabled={isUploading}
            >
              {isUploading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent" />
              ) : (
                <ImageIcon className="h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Image
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setImageDialogOpen(true)}>
              <Link2 className="h-4 w-4 mr-2" />
              Add from URL
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={youtubeDialogOpen} onOpenChange={setYoutubeDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="toolbar-button"
              title="Add YouTube Video"
            >
              <YoutubeIcon className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add YouTube Video</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="youtube-url">YouTube URL</Label>
                <Input
                  id="youtube-url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addYoutube()}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setYoutubeDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addYoutube} disabled={!youtubeUrl}>
                Add Video
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="toolbar-group ml-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="toolbar-button"
          title="Undo (Cmd+Z)"
        >
          <Undo className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="toolbar-button"
          title="Redo (Cmd+Shift+Z)"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Image URL Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Image from URL</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addImage()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImageDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addImage} disabled={!imageUrl}>
              Add Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const RichTextEditor = ({ 
  content, 
  onChange, 
  placeholder = "Start writing your content...",
  className = "" 
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      Placeholder.configure({
        placeholder,
        showOnlyWhenEditable: true,
        showOnlyCurrent: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Underline,
      Youtube.configure({
        controls: true,
        nocookie: true,
        HTMLAttributes: {
          class: 'editor-youtube',
        },
      }),
      Color,
      TextStyle,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'editor-content',
      },
    },
  })

  return (
    <Card className={`editor-container ${className}`}>
      <MenuBar editor={editor} />
      <div className="editor-wrapper">
        <EditorContent editor={editor} />
      </div>
    </Card>
  )
}

export default RichTextEditor