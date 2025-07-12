'use client'

import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import { forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import { ImageNode } from '@/extensions/ImageNode'
import MediaLibraryClient from '@/components/dashboard/MediaLibraryClient'
import Link from '@tiptap/extension-link'
import type { JSONContent } from '@tiptap/react'
import { Button } from '@/components/ui/button'

type Image = {
  id: string
  url: string
  alt?: string | null
  uploadedAt: string
}

const MenuBar = ({ editor }: { editor: Editor }) => {
  const [mediaOpen, setMediaOpen] = useState(false)
  const [images, setImages] = useState<Image[]>([])

  useEffect(() => {
    if (!mediaOpen) return
    const fetchImages = async () => {
      try {
        const res = await fetch('/api/images')
        const data = await res.json()
        setImages(data)
      } catch (err) {
        console.error('Failed to fetch images', err)
      }
    }
    fetchImages()
  }, [mediaOpen])

  const handleSelect = (image: Image) => {
    editor.chain().focus().insertContent({
      type: 'imageNode',
      attrs: {
        src: image.url,
        alt: image.alt || '',
        title: image.alt || '',
        imageId: image.id,
      },
    }).run()
  }

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-4">
        <Button variant="default" onClick={() => editor.chain().focus().toggleBold().run()}>Bold</Button>
        <Button variant="default" onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</Button>
        <Button variant="default" onClick={() => editor.chain().focus().toggleStrike().run()}>Strike</Button>
        <Button variant="default" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</Button>
        <Button variant="default" onClick={() => editor.chain().focus().toggleBulletList().run()}>Bullet</Button>
        <Button variant="default" onClick={() => editor.chain().focus().toggleOrderedList().run()}>Ordered</Button>
        <Button variant="default" onClick={() => editor.chain().focus().toggleCodeBlock().run()}>Code Block</Button>
        <Button variant="default" onClick={() => editor.chain().focus().toggleBlockquote().run()}>Quote</Button>
        <Button variant="default" onClick={() => editor.chain().focus().undo().run()}>Undo</Button>
        <Button variant="default" onClick={() => editor.chain().focus().redo().run()}>Redo</Button>
        <Button variant="default" onClick={() => setMediaOpen(true)}>Image</Button>
        <Button
          variant="default"
          onClick={() => {
            const url = window.prompt('Enter URL')
            if (url) {
              editor
                .chain()
                .focus()
                .extendMarkRange('link')
                .setLink({ href: url })
                .run()
            }
          }}
        >
          Link
        </Button>
        <Button variant="default" onClick={() => editor.chain().focus().unsetLink().run()}>Unlink</Button>
      </div>

      {mediaOpen && (
        <MediaLibraryClient
          open={mediaOpen}
          onClose={() => setMediaOpen(false)}
          onSelect={(image) => {
            handleSelect(image)
            setMediaOpen(false)
          }}
          images={images}
        />
      )}
    </>
  )
}

export const TiptapEditor = forwardRef(function TiptapEditor(
  { content }: { content?: JSONContent },
  ref: React.Ref<{ getContent: () => JSONContent }>
) {
  const editor = useEditor({
    content,
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Color.configure({ types: ['textStyle'] }),
      TextStyle,
      ImageNode,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
    ],
    autofocus: true,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert min-h-[300px] focus:outline-none",
      },
    },
  })

  useImperativeHandle(ref, () => ({
    getContent: () => editor?.getJSON() ?? { type: 'doc', content: [] },
  }))

  if (!editor) return null

  return (
    <div className="tiptap prose prose-sm sm:prose lg:prose-lg max-w-none">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
})
