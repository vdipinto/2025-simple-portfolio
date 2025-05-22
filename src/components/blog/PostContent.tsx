'use client'

import type { JSONContent } from '@tiptap/react'
import PostRenderer from '@/components/blog/PostRenderer'

export default function PostContent({ content }: { content: JSONContent }) {
  return <PostRenderer content={content} />
}
