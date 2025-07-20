import React, { useState, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Color from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Youtube from '@tiptap/extension-youtube'
import { createLowlight } from 'lowlight'
import js from 'highlight.js/lib/languages/javascript'
import css from 'highlight.js/lib/languages/css'
import html from 'highlight.js/lib/languages/xml'
import python from 'highlight.js/lib/languages/python'
import json from 'highlight.js/lib/languages/json'

// Custom extensions
import ImageUpload from './extensions/ImageUpload'
import VideoUpload from './extensions/VideoUpload'

// Import editor styles
import './editor.css'

import { Card, CardContent } from '../ui/card'
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
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Link as LinkIcon, 
  Image as ImageIcon,
  Video as VideoIcon,
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
  Highlighter
} from 'lucide-react'

// Initialize lowlight
const lowlight = createLowlight()
lowlight.register('js', js)
lowlight.register('css', css)
lowlight.register('html', html)
lowlight.register('python', python)
lowlight.register('json', json)

const RichTextEditor = ({ 
  content, 
  onChange, 
  placeholder = "Start writing your content...",
  className = "" 
}) => {
  const [linkUrl, setLinkUrl] = useState('')
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [youtubeDialogOpen, setYoutubeDialogOpen] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // We'll use CodeBlockLowlight instead
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 hover:text-blue-700 underline cursor-pointer',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Color,
      TextStyle,
      Highlight.configure({
        multicolor: true,
      }),
      Underline,
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'javascript',
      }),
      Youtube.configure({
        controls: true,
        nocookie: true,
      }),
      ImageUpload,
      VideoUpload,
    ],
    content: (() => {
      if (!content) return ''
      
      // If content is already JSON string, parse it for the editor
      if (typeof content === 'string' && content.trim().startsWith('{')) {
        try {
          return JSON.parse(content)
        } catch (error) {
          console.warn('Failed to parse JSON content, using as HTML:', error)
          return content
        }
      }
      
      // Otherwise use content as-is (object or HTML string)
      return content
    })(),
    onUpdate: ({ editor }) => {
      // Save content as JSON to preserve custom node types (imageUpload, videoUpload)
      const content = editor.getJSON()
      onChange?.(JSON.stringify(content))
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4',
      },
    },
  })

  const addLink = useCallback(() => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run()
      setLinkUrl('')
      setLinkDialogOpen(false)
    }
  }, [editor, linkUrl])

  const addYoutube = useCallback(() => {
    if (youtubeUrl) {
      editor.chain().focus().setYoutubeVideo({ src: youtubeUrl }).run()
      setYoutubeUrl('')
      setYoutubeDialogOpen(false)
    }
  }, [editor, youtubeUrl])

  const addImage = useCallback(() => {
    editor.chain().focus().setImage({}).run()
  }, [editor])

  const addVideo = useCallback(() => {
    editor.chain().focus().setVideo({}).run()
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="p-0">
        {/* Toolbar */}
        <div className="border-b border-gray-200 p-3">
          <div className="flex flex-wrap gap-1">
            {/* Text Formatting */}
            <Button
              variant={editor.isActive('bold') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </Button>
            
            <Button
              variant={editor.isActive('italic') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </Button>
            
            <Button
              variant={editor.isActive('underline') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              title="Underline"
            >
              <UnderlineIcon className="h-4 w-4" />
            </Button>
            
            <Button
              variant={editor.isActive('highlight') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              title="Highlight"
            >
              <Highlighter className="h-4 w-4" />
            </Button>

            <div className="w-px h-8 bg-gray-300 mx-1" />

            {/* Headings */}
            <Button
              variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              title="Heading 1"
            >
              <Heading1 className="h-4 w-4" />
            </Button>
            
            <Button
              variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              title="Heading 2"
            >
              <Heading2 className="h-4 w-4" />
            </Button>
            
            <Button
              variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              title="Heading 3"
            >
              <Heading3 className="h-4 w-4" />
            </Button>
            
            <Button
              variant={editor.isActive('paragraph') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().setParagraph().run()}
              title="Paragraph"
            >
              <Type className="h-4 w-4" />
            </Button>

            <div className="w-px h-8 bg-gray-300 mx-1" />

            {/* Lists */}
            <Button
              variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </Button>
            
            <Button
              variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              title="Ordered List"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            
            <Button
              variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              title="Quote"
            >
              <Quote className="h-4 w-4" />
            </Button>
            
            <Button
              variant={editor.isActive('codeBlock') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              title="Code Block"
            >
              <Code className="h-4 w-4" />
            </Button>

            <div className="w-px h-8 bg-gray-300 mx-1" />

            {/* Alignment */}
            <Button
              variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              title="Align Left"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              title="Align Center"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            
            <Button
              variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              title="Align Right"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            
            <Button
              variant={editor.isActive({ textAlign: 'justify' }) ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              title="Justify"
            >
              <AlignJustify className="h-4 w-4" />
            </Button>

            <div className="w-px h-8 bg-gray-300 mx-1" />

            {/* Media */}
            <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
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
            
            <Button
              variant="ghost"
              size="sm"
              onClick={addImage}
              title="Add Image"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={addVideo}
              title="Add Video"
            >
              <VideoIcon className="h-4 w-4" />
            </Button>
            
            <Dialog open={youtubeDialogOpen} onOpenChange={setYoutubeDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
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

            <div className="w-px h-8 bg-gray-300 mx-1" />

            {/* Undo/Redo */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="Undo"
            >
              <Undo className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="Redo"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Editor Content */}
        <div className="min-h-[400px]">
          <EditorContent editor={editor} />
        </div>
      </CardContent>
    </Card>
  )
}

export default RichTextEditor