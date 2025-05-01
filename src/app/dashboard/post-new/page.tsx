'use client'

import { useRef, useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { TiptapEditor } from '@/components/ui/TiptapEditor'
import { createPost } from '@/actions/actions'
import { slugify } from '@/lib/slugify'
import clsx from 'clsx'
import { toast } from 'sonner'
import MediaLibraryClient from '@/components/dashboard/MediaLibraryClient'

export default function CreatePostPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [formState, setFormState] = useState<any>(null)
  const [isPending, startTransition] = useTransition()
  const editorRef = useRef<{ getContent: () => any }>(null)

  // 🖼️ Featured image
  const [featuredImage, setFeaturedImage] = useState<{ id: string, url: string } | null>(null)
  const [mediaOpen, setMediaOpen] = useState(false)

  useEffect(() => {
    setSlug(slugify(title))
  }, [title])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const content = editorRef.current?.getContent()
    formData.set('content', JSON.stringify(content))

    if (featuredImage) {
      formData.set('featuredImageId', featuredImage.id)
    }

    startTransition(async () => {
      const result = await createPost(undefined, formData)

      if (result.success) {
        toast.success('Post created successfully!')
        router.push('/dashboard/all-posts')
      } else {
        toast.error(result.errors?.general || 'Failed to create post.')
        setFormState(result)
      }
    })
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">New Post</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border p-2 rounded"
            placeholder="Title"
          />
          {formState?.errors?.title && <p className="text-red-600 text-sm mt-1">{formState.errors.title}</p>}
        </div>

        <div>
          <input
            name="slug"
            value={slug}
            readOnly
            className={clsx(
              'w-full border p-2 rounded',
              formState?.errors?.slug && 'border-red-500'
            )}
            placeholder="Slug will be generated automatically"
          />
          {formState?.errors?.slug && <p className="text-red-600 text-sm mt-1">{formState.errors.slug}</p>}
        </div>

        <div>
          <input name="category" className="w-full border p-2 rounded" placeholder="Category" />
          {formState?.errors?.category && <p className="text-red-600 text-sm mt-1">{formState.errors.category}</p>}
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" />
          Publish immediately
        </label>

        {/* 🔥 Featured Image Picker */}
        <div className="border p-3 rounded">
          <div className="mb-2 font-medium text-sm">Featured Image</div>

          {featuredImage ? (
            <div className="mb-2">
              <img src={featuredImage.url} alt="Featured" className="w-full h-40 object-cover rounded" />
            </div>
          ) : (
            <p className="text-sm text-gray-500 mb-2">No image selected.</p>
          )}

          <button
            type="button"
            className="text-sm underline text-blue-600"
            onClick={() => setMediaOpen(true)}
          >
            Select Featured Image
          </button>

          <input type="hidden" name="featuredImageId" value={featuredImage?.id || ''} />
        </div>

        <div className="border rounded p-2">
          <TiptapEditor ref={editorRef} content={{ type: 'doc', content: [] }} />
          {formState?.errors?.content && (
            <p className="text-red-600 text-sm mt-2">{formState.errors.content}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={isPending}
        >
          {isPending ? 'Publishing...' : 'Publish Post'}
        </button>
      </form>

      {/* Media Picker Modal */}
      <MediaLibraryClient
        open={mediaOpen}
        onClose={() => setMediaOpen(false)}
        onSelect={(image) => {
          setFeaturedImage(image)
          setMediaOpen(false)
        }}
        images={[]} // You should fetch them if needed
      />
    </div>
  )
}
