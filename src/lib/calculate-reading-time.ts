// src/lib/calculate-reading-time.ts

import { TiptapContent } from "./types"

export function calculateReadingTime(content: TiptapContent | null): number {
  if (!content) return 1

  let text = ''

  if (content.type === 'doc' && Array.isArray(content.content)) {
    content.content.forEach((node) => {
      if (node.type === 'paragraph' && Array.isArray(node.content)) {
        text += node.content.map((n) => n.text || '').join(' ')
      }
    })
  }

  const words = text.trim().split(/\s+/).length
  const wordsPerMinute = 200
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}
