import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import VideoUploadComponent from '../VideoUploadComponent'

export default Node.create({
  name: 'videoUpload',

  group: 'block',

  content: '',

  draggable: true,

  isolating: true,

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
      title: {
        default: null,
        parseHTML: element => element.getAttribute('title'),
        renderHTML: attributes => {
          if (!attributes.title) return {}
          return { title: attributes.title }
        }
      },
      poster: {
        default: null,
        parseHTML: element => element.getAttribute('poster'),
        renderHTML: attributes => {
          if (!attributes.poster) return {}
          return { poster: attributes.poster }
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
      controls: {
        default: true,
        parseHTML: element => element.hasAttribute('controls'),
        renderHTML: attributes => {
          if (!attributes.controls) return {}
          return { controls: '' }
        }
      },
      autoplay: {
        default: false,
        parseHTML: element => element.hasAttribute('autoplay'),
        renderHTML: attributes => {
          if (!attributes.autoplay) return {}
          return { autoplay: '' }
        }
      },
      loop: {
        default: false,
        parseHTML: element => element.hasAttribute('loop'),
        renderHTML: attributes => {
          if (!attributes.loop) return {}
          return { loop: '' }
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
      },
      isExternal: {
        default: false,
        parseHTML: element => element.getAttribute('data-external') === 'true',
        renderHTML: attributes => {
          if (!attributes.isExternal) return {}
          return { 'data-external': 'true' }
        }
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'video[src]',
        getAttrs: element => {
          const src = element.getAttribute('src')
          // Don't parse video elements with image file extensions
          if (src && /\.(png|jpg|jpeg|gif|webp|bmp|svg)$/i.test(src)) {
            return false
          }
          
          return {
            src: src,
            title: element.getAttribute('title'),
            poster: element.getAttribute('poster'),
            width: element.getAttribute('width'),
            height: element.getAttribute('height'),
            controls: element.hasAttribute('controls'),
            autoplay: element.hasAttribute('autoplay'),
            loop: element.hasAttribute('loop'),
            caption: element.getAttribute('data-caption') || '',
            fileId: element.getAttribute('data-file-id'),
            isExternal: element.getAttribute('data-external') === 'true'
          }
        }
      },
      {
        tag: 'iframe[src*="youtube.com"], iframe[src*="youtu.be"], iframe[src*="vimeo.com"]',
        getAttrs: element => {
          return {
            src: element.getAttribute('src'),
            title: element.getAttribute('title'),
            width: element.getAttribute('width'),
            height: element.getAttribute('height'),
            caption: element.getAttribute('data-caption') || '',
            isExternal: true
          }
        }
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { caption, isExternal, controls, autoplay, loop, ...videoAttributes } = HTMLAttributes
    
    // Check if it's a YouTube or Vimeo URL
    const isYoutube = videoAttributes.src?.includes('youtube.com') || videoAttributes.src?.includes('youtu.be')
    const isVimeo = videoAttributes.src?.includes('vimeo.com')
    
    if (isYoutube || isVimeo || isExternal) {
      return [
        'figure',
        {
          class: 'video-block',
          style: 'margin: 1rem 0;'
        },
        [
          'iframe',
          mergeAttributes(videoAttributes, {
            frameborder: '0',
            allowfullscreen: '',
            style: 'width: 100%; min-height: 300px; border-radius: 8px;'
          })
        ],
        caption && [
          'figcaption',
          {
            class: 'video-caption',
            style: 'margin-top: 8px; font-size: 0.875rem; color: #6b7280; text-align: center; font-style: italic;'
          },
          caption
        ]
      ].filter(Boolean)
    }

    // Regular video element
    const videoAttrs = { ...videoAttributes }
    if (controls) videoAttrs.controls = ''
    if (autoplay) videoAttrs.autoplay = ''
    if (loop) videoAttrs.loop = ''

    return [
      'figure',
      {
        class: 'video-block',
        style: 'margin: 1rem 0;'
      },
      [
        'video',
        mergeAttributes(videoAttrs, {
          style: 'width: 100%; border-radius: 8px;'
        }),
        'Your browser does not support the video tag.'
      ],
      caption && [
        'figcaption',
        {
          class: 'video-caption',
          style: 'margin-top: 8px; font-size: 0.875rem; color: #6b7280; text-align: center; font-style: italic;'
        },
        caption
      ]
    ].filter(Boolean)
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoUploadComponent)
  },

  addCommands() {
    return {
      setVideo: options => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
      updateVideo: (options, pos) => ({ tr, dispatch }) => {
        if (dispatch) {
          tr.setNodeMarkup(pos, null, options)
        }
        return true
      }
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Alt-v': () => {
        // Trigger video upload dialog
        const event = new CustomEvent('openVideoUpload')
        window.dispatchEvent(event)
        return true
      }
    }
  }
})