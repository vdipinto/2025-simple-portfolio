// src/components/ui/PostList.tsx
'use client'

import { useTransition, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { deletePostBySlug } from '@/actions/actions'
import BlogCard from './BlogCard'

export type PostListItem = {
  id: string
  title: string
  slug: string
  readingTime: number | null
  /** Preformatted (from the server) */
  publishedAtISO: string | null // e.g. "2025-08-15T10:23:00.000Z"
  publishedAtUK: string | null  // e.g. "15 August 2025"
  seoDescription?: string | null
  featuredImage?: {
    url: string
    alt?: string | null
    width?: number | null
    height?: number | null
  } | null
  /** Optional flag used only in public view safety filtering */
  published?: boolean | null
}

type PostListProps = {
  posts: PostListItem[]
  /** When true, render the dashboard list with Edit/Delete actions */
  showEditLinks?: boolean
}

export default function PostList({ posts, showEditLinks = false }: PostListProps) {
  const [isPending, startTransition] = useTransition()
  const [localPosts, setLocalPosts] = useState(posts)

  const handleDelete = (slug: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    const formData = new FormData()
    formData.append('slug', slug)

    startTransition(async () => {
      const result = await deletePostBySlug(null, formData)
      if (result?.success) {
        setLocalPosts((prev) => prev.filter((p) => p.slug !== slug))
        toast.success('Post deleted successfully!')
      } else {
        toast.error(result?.message || 'Failed to delete post.')
      }
    })
  }

  if (showEditLinks) {
    // Dashboard list view
    return (
      <ul className="space-y-2">
        {localPosts.map((post) => (
          <li
            key={post.id}
            className="flex items-center justify-between px-4 py-2 border border-border rounded-lg bg-card text-card-foreground hover:bg-muted transition-colors"
          >
            <div className="min-w-0">
              <Link
                href={`/blog/${post.slug}`}
                className="truncate hover:underline"
                title={post.title}
              >
                {post.title}
              </Link>
              {post.published === false && (
                <span className="ml-2 text-xs rounded px-2 py-0.5 bg-yellow-100 text-yellow-800">
                  Draft
                </span>
              )}
              {/* Meta line (reading time + date) */}
              {(typeof post.readingTime === 'number' || post.publishedAtUK) && (
                <div className="mt-1 text-xs text-muted-foreground">
                  {typeof post.readingTime === 'number' ? (
                    <span>{post.readingTime} min read</span>
                  ) : null}
                  {typeof post.readingTime === 'number' && post.publishedAtUK ? (
                    <span> • </span>
                  ) : null}
                  {post.publishedAtUK ? (
                    <time dateTime={post.publishedAtISO!}>{post.publishedAtUK}</time>
                  ) : null}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <Link
                href={`/dashboard/all-posts/edit/${post.slug}`}
                className="text-sm text-muted-foreground hover:underline"
              >
                Edit
              </Link>
              <button
                disabled={isPending}
                onClick={() => handleDelete(post.slug)}
                className="text-sm text-red-600 hover:underline disabled:opacity-50"
              >
                {isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  // Public grid view — filter out unpublished just in case
  const publicPosts = localPosts.filter((p) => p.published !== false)

  return (
    <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {publicPosts.map((post) => (
        <BlogCard key={post.id} {...post} />
      ))}
    </div>
  )
}