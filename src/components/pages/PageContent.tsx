'use client'

import type { JSONContent } from '@tiptap/react'
import TiptapRenderer from '@/components/editor/TiptapRenderer';

export default function PageContent({ content }: { content: JSONContent }) {
  return <TiptapRenderer content={content} />
}