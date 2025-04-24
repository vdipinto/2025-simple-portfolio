'use client'

import { useRef, useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TiptapEditor } from '@/components/ui/TiptapEditor'
import { slugify } from '@/lib/slugify'
import { updatePost } from '@/actions/actions'
import { toast } from 'sonner'
import clsx from 'clsx'

export default function EditPostForm({ post }: { post: any }) {
  const router = useRouter()
  const [title, setTitle] = useState(post.title)
  const [slug, setSlug] = useState(post.slug)
  const [category, setCategory] = useState(post.category ?? '')
  const [published, setPublished] = useState(post.published)
  const [formState, setFormState] = useState<any>(null)
  const [isPending, startTransition] = useTransition()

  const editorRef = useRef<{ getContent: () => any }>(null)

  useEffect(() => {
    setSlug(slugify(title))
  }, [title])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const content = editorRef.current?.getContent()
    formData.set('content', JSON.stringify(content))

    startTransition(async () => {
      const result = await updatePost(undefined, formData)

      if (result.success) {
        toast.success(result.published ? 'Post published!' : 'Post saved as draft.')
        router.push('/dashboard/all-posts')
      } else {
        toast.error(result.errors?.general || 'Failed to update post')
        setFormState(result)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="slug" value={post.slug} />

      <div>
        <label className="block mb-1 text-sm font-medium">Title</label>
        <input
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
        />
        {formState?.errors?.title && (
          <p className="text-red-600 text-sm mt-1">{formState.errors.title}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Slug</label>
        <input
          name="slug"
          value={slug}
          readOnly
          className="w-full border p-2 rounded bg-gray-100 text-gray-600"
        />
        {formState?.errors?.slug && (
          <p className="text-red-600 text-sm mt-1">{formState.errors.slug}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Category</label>
        <input
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-2 rounded"
        />
        {formState?.errors?.category && (
          <p className="text-red-600 text-sm mt-1">{formState.errors.category}</p>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="published"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        Published
      </label>

      <input type="hidden" name="content" />

      <div className="border rounded p-2">
        <TiptapEditor ref={editorRef} content={post.content ?? {}} />
        {formState?.errors?.content && (
          <p className="text-red-600 text-sm mt-2">{formState.errors.content}</p>
        )}
      </div>

      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={isPending}
      >
        {isPending ? 'Saving...' : 'Update Post'}
      </button>
    </form>
  )
}
