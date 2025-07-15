import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { Plugin, PluginKey } from 'prosemirror-state'
import ImageUploadComponent from '../ImageUploadComponent'

export default Node.create({
  name: 'imageUpload',

  group: 'block',

  content: '',

  draggable: true,

  isolating: true,

  priority: 1000,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: element => element.getAttribute('src'),
        renderHTML: attributes => {
          if (!attributes.src) return {}
          return { src: attributes.src }
        }
      },
      alt: {
        default: null,
        parseHTML: element => element.getAttribute('alt'),
        renderHTML: attributes => {
          if (!attributes.alt) return {}
          return { alt: attributes.alt }
        }
      },
      title: {
        default: null,
        parseHTML: element => element.getAttribute('title'),
        renderHTML: attributes => {
          if (!attributes.title) return {}
          return { title: attributes.title }
        }
      },
      width: {
        default: null,
        parseHTML: element => element.getAttribute('width'),
        renderHTML: attributes => {
          if (!attributes.width) return {}
          return { width: attributes.width }
        }
      },
      height: {
        default: null,
        parseHTML: element => element.getAttribute('height'),
        renderHTML: attributes => {
          if (!attributes.height) return {}
          return { height: attributes.height }
        }
      },
      alignment: {
        default: 'center',
        parseHTML: element => element.getAttribute('data-alignment') || 'center',
        renderHTML: attributes => {
          return { 'data-alignment': attributes.alignment }
        }
      },
      caption: {
        default: '',
        parseHTML: element => element.getAttribute('data-caption') || '',
        renderHTML: attributes => {
          return { 'data-caption': attributes.caption }
        }
      },
      fileId: {
        default: null,
        parseHTML: element => element.getAttribute('data-file-id'),
        renderHTML: attributes => {
          if (!attributes.fileId) return {}
          return { 'data-file-id': attributes.fileId }
        }
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
        getAttrs: element => {
          return {
            src: element.getAttribute('src'),
            alt: element.getAttribute('alt'),
            title: element.getAttribute('title'),
            width: element.getAttribute('width'),
            height: element.getAttribute('height'),
            alignment: element.getAttribute('data-alignment') || 'center',
            caption: element.getAttribute('data-caption') || '',
            fileId: element.getAttribute('data-file-id')
          }
        }
      },
      {
        tag: 'figure.image-block',
        getAttrs: element => {
          const img = element.querySelector('img')
          if (!img) return false
          
          return {
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt'),
            title: img.getAttribute('title'),
            width: img.getAttribute('width'),
            height: img.getAttribute('height'),
            alignment: element.getAttribute('data-alignment') || 'center',
            caption: element.getAttribute('data-caption') || '',
            fileId: img.getAttribute('data-file-id')
          }
        }
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { alignment, caption, ...imgAttributes } = HTMLAttributes
    
    return [
      'figure',
      {
        class: `image-block image-${alignment}`,
        style: `text-align: ${alignment}`
      },
      [
        'img',
        mergeAttributes(imgAttributes, {
          style: 'max-width: 100%; height: auto; border-radius: 8px;'
        })
      ],
      caption && [
        'figcaption',
        {
          class: 'image-caption',
          style: 'margin-top: 8px; font-size: 0.875rem; color: #6b7280; text-align: center; font-style: italic;'
        },
        caption
      ]
    ].filter(Boolean)
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageUploadComponent)
  },

  addCommands() {
    return {
      setImage: options => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
      updateImage: (options, pos) => ({ tr, dispatch }) => {
        if (dispatch) {
          tr.setNodeMarkup(pos, null, options)
        }
        return true
      }
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Alt-i': () => {
        // Trigger image upload dialog
        const event = new CustomEvent('openImageUpload')
        window.dispatchEvent(event)
        return true
      }
    }
  },

  addProseMirrorPlugins() {
    return [
      // Add plugin to handle drag and drop / paste events
      new Plugin({
        key: new PluginKey('imageUploadPaste'),
        props: {
          handlePaste: (view, event, slice) => {
            // Check if pasted content contains image filenames
            const text = event.clipboardData?.getData('text/plain')
            if (text && /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(text)) {
              // If it looks like an image filename, prevent default paste
              // and create an image node instead
              event.preventDefault()
              return true
            }
            return false
          },
          handleDrop: (view, event, slice, moved) => {
            // Handle image drops
            const files = event.dataTransfer?.files
            if (files && files.length > 0) {
              const file = files[0]
              if (file.type.startsWith('image/')) {
                event.preventDefault()
                return true
              }
            }
            return false
          }
        }
      })
    ]
  }
})