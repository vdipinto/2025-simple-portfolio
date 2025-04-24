import { Node, mergeAttributes } from '@tiptap/core'

export const ImageNode = Node.create({
  name: 'imageNode',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      imageId: { default: null },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'img[data-image-id]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      { class: 'my-4' },
      [
        'img',
        mergeAttributes(HTMLAttributes, {
          'data-image-id': HTMLAttributes.imageId,
          class: 'w-full h-auto rounded',
        }),
      ],
    ]
  },

  addNodeView() {
    return ({ node }) => {
      const wrapper = document.createElement('div')
      wrapper.className = 'my-4'

      const img = document.createElement('img')
      img.src = node.attrs.src
      img.alt = node.attrs.alt || ''
      img.title = node.attrs.title || ''
      img.setAttribute('data-image-id', node.attrs.imageId)
      img.className = 'w-full h-auto rounded'

      wrapper.appendChild(img)

      return {
        dom: wrapper,
      }
    }
  },
})
