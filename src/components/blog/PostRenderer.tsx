'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Link from '@tiptap/extension-link'
import { ImageNode } from '@/extensions/ImageNode' // if you're using this custom image extension
import { useEffect, useState } from 'react'
import type { JSONContent } from '@tiptap/react'

export default function PostRenderer({ content }: { content: JSONContent }) {
  const [isMounted, setIsMounted] = useState(false)

  const editor = useEditor({
    content,
    editable: false,
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      ImageNode,
      Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose',
      },
    },
    immediatelyRender: false,
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || !editor) return null

  return <EditorContent editor={editor} />
}
