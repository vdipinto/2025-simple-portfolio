'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Link from '@tiptap/extension-link'
import { ImageNode } from '@/extensions/ImageNode'
import { useEffect, useState } from 'react'
import type { JSONContent } from '@tiptap/react'

type Props = {
  content: JSONContent
  className?: string
}

export default function TiptapRenderer({ content, className = 'prose dark:prose-invert' }: Props) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

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
        class: 'prose dark:prose-invert min-h-[300px] focus:outline-none',
      },
    },
    immediatelyRender: false,
  })

  if (!isMounted || !editor) return null

  return <EditorContent editor={editor} />
}
