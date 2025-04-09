'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useState } from 'react'

export default function PostRenderer({ content }: { content: any }) {
  const [isMounted, setIsMounted] = useState(false)

  const editor = useEditor({
    content,
    editable: false,
    extensions: [StarterKit],
    editorProps: {
      attributes: {
        class: 'prose',
      },
    },
    immediatelyRender: false, // ✅ prevent SSR render mismatches
  })

  // Avoid hydration mismatches
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || !editor) return null

  return <EditorContent editor={editor} />
}
