'use client'

import Link from 'next/link'
import { useTransition, useState } from 'react'
import { deletePostBySlug } from '@/actions/actions'
import { toast } from 'sonner'

type Post = {
  id: string
  title: string
  slug: string
}

type PostListProps = {
  posts: Post[]
  showEditLinks?: boolean
}

export default function PostList({ posts, showEditLinks = false }: PostListProps) {
  const [isPending, startTransition] = useTransition()
  const [localPosts, setLocalPosts] = useState(posts) // 👈 local copy

  const handleDelete = (slug: string) => {
    const confirmed = confirm('Are you sure you want to delete this post?')
    if (!confirmed) return

    const formData = new FormData()
    formData.append('slug', slug)

    startTransition(async () => {
      const result = await deletePostBySlug(null, formData)

      if (result?.success) {
        toast.success('Post deleted successfully!')
        setLocalPosts((prev) => prev.filter((post) => post.slug !== slug)) // ✅ remove from UI
      } else {
        toast.error(result?.message || 'Failed to delete post.')
      }
    })
  }

  return (
    <ul className="space-y-4">
      {localPosts.map((post) => (
        <li
          key={post.id}
          className="flex items-center justify-between px-4 py-2 border rounded hover:bg-gray-50"
        >
          <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:underline">
            {post.title}
          </Link>

          {showEditLinks && (
            <div className="flex items-center gap-4">
              <Link
                href={`/dashboard/all-posts/edit/${post.slug}`}
                className="text-sm text-gray-500 hover:underline"
              >
                Edit
              </Link>

              <button
                disabled={isPending}
                onClick={() => handleDelete(post.slug)}
                className="text-sm text-red-600 hover:underline disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}
