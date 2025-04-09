'use client'

import PostRenderer from '@/components/blog/PostRenderer'

export default function PostContent({ content }: { content: any }) {
  return <PostRenderer content={content} />
}
