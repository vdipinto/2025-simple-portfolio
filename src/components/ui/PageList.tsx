'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

import { deletePageBySlug } from '@/actions/actions' // ❶ create in step 3

type Page = {
  id: string
  title: string
  slug: string
  published: boolean
}

type Props = {
  pages: Page[]
  /** show “Edit / Delete” buttons (hide them if you just need a read-only list) */
  showEditLinks?: boolean
}

export default function PageList({ pages, showEditLinks = false }: Props) {
  const [localPages, setLocalPages] = useState(pages)
  const [isPending, startTransition] = useTransition()

  const handleDelete = (slug: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return

    const formData = new FormData()
    formData.append('slug', slug)

    startTransition(async () => {
      const res = await deletePageBySlug(null, formData)

      if (res?.success) {
        toast.success('Page deleted')
        setLocalPages((prev) => prev.filter((p) => p.slug !== slug))
      } else {
        toast.error(res?.message ?? 'Failed to delete page')
      }
    })
  }

  return (
    <ul className="space-y-4">
      {localPages.map((page) => (
        <li
          key={page.id}
          className="flex items-center justify-between px-4 py-2 border rounded hover:bg-gray-50"
        >
          <div>
            <Link
              href={`/${page.slug}`}
              className="text-blue-600 hover:underline"
            >
              {page.title}
            </Link>

            {showEditLinks && !page.published && (
              <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                Draft
              </span>
            )}
          </div>

          {showEditLinks && (
            <div className="flex items-center gap-4">
              <Link
                href={`/dashboard/all-pages/edit/${page.slug}`}
                className="text-sm text-gray-500 hover:underline"
              >
                Edit
              </Link>

              <button
                disabled={isPending}
                onClick={() => handleDelete(page.slug)}
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
