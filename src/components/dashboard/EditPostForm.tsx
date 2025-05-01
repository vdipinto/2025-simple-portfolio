'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { TiptapEditor } from '@/components/ui/TiptapEditor'
import { updatePost } from '@/actions/actions'
import { toast } from 'sonner'
import MediaLibraryClient from '@/components/dashboard/MediaLibraryClient'
import clsx from 'clsx'
import { Post, Image } from '@prisma/client' // ✅ Prisma types

type Props = {
  post: Post & {
    featuredImage?: Image | null
  }
}

export default function EditPostForm({ post }: Props) {
  const router = useRouter()
  const editorRef = useRef<{ getContent: () => any }>(null)

  const [title, setTitle] = useState(post.title)
  const [slug, setSlug] = useState(post.slug)
  const [category, setCategory] = useState(post.category)
  const [published, setPublished] = useState(post.published)
  const [featuredImage, setFeaturedImage] = useState(post.featuredImage || null)
  const [mediaOpen, setMediaOpen] = useState(false)
  const [formState, setFormState] = useState<any>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const content = editorRef.current?.getContent()
    const formData = new FormData(e.currentTarget)
    formData.set('content', JSON.stringify(content))

    if (featuredImage) {
      formData.set('featuredImageId', featuredImage.id)
    } else {
      formData.set('featuredImageId', '')
    }

    startTransition(async () => {
      const result = await updatePost(post.id, formData)

      if (result.success) {
        toast.success('Post updated!')
        router.push('/dashboard/all-posts')
      } else {
        toast.error(result.errors?.general || 'Failed to update post.')
        setFormState(result)
      }
    })
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Edit Post</h1>

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
          {formState?.errors?.title && (
            <p className="text-red-600 text-sm mt-1">{formState.errors.title}</p>
          )}
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
          />
          {formState?.errors?.slug && (
            <p className="text-red-600 text-sm mt-1">{formState.errors.slug}</p>
          )}
        </div>

        <div>
          <input
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Category"
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

        {/* 🖼️ Featured Image Section */}
        <div className="border p-3 rounded">
          <div className="mb-2 font-medium text-sm">Featured Image</div>

          {featuredImage ? (
            <div className="mb-2">
              <img
                src={featuredImage.url}
                alt="Featured"
                className="w-full h-40 object-cover rounded"
              />
            </div>
          ) : (
            <p className="text-sm text-gray-500 mb-2">No image selected.</p>
          )}

          <div className="flex gap-4 text-sm">
            <button
              type="button"
              className="underline text-blue-600"
              onClick={() => {
                console.debug('[DEBUG] Opening media library')
                setMediaOpen(true)
              }}
            >
              {featuredImage ? 'Replace Featured Image' : 'Set Featured Image'}
            </button>

            {featuredImage && (
              <button
                type="button"
                className="underline text-red-600"
                onClick={() => {
                  console.debug('[DEBUG] Removing featured image')
                  setFeaturedImage(null)
                }}
              >
                Remove Featured Image
              </button>
            )}
          </div>

          <input type="hidden" name="featuredImageId" value={featuredImage?.id || ''} />
        </div>

        <div className="border rounded p-2">
          <TiptapEditor ref={editorRef} content={post.content} />
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

      {/* 📦 Media Library Modal */}
      <MediaLibraryClient
        open={mediaOpen}
        onClose={() => {
          console.debug('[DEBUG] Closing media library')
          setMediaOpen(false)
        }}
        onSelect={(image) => {
          console.debug('[DEBUG] Selected image:', image)
          setFeaturedImage(image)
          setMediaOpen(false)
        }}
      />
    </div>
  )
}
