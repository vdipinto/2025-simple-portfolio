'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { TiptapEditor } from '@/components/ui/TiptapEditor'
import { updatePost } from '@/actions/actions'
import { toast } from 'sonner'
import MediaLibraryClient from '@/components/dashboard/MediaLibraryClient'
import clsx from 'clsx'
import { Post, Image, Category } from '@prisma/client'
import type { JSONContent } from '@tiptap/react'
import NextImage from 'next/image'
import type { FormState } from '@/actions/actions';
import { hasErrors } from '@/utils/formHelpers'
import { Button } from "@/components/ui/button"


type Props = {
  post: Post & {
    category?: Category | null
    featuredImage?: Image | null
    seoImage?: Image | null
  }
}

export default function EditPostForm({ post }: Props) {
  const router = useRouter()
  const editorRef = useRef<{ getContent: () => JSONContent }>(null)
  const [title, setTitle] = useState(post.title)
  const [slug] = useState(post.slug)
  const [category, setCategory] = useState(post.category?.name || '')
  const [published, setPublished] = useState(post.published)
  const [featuredImage, setFeaturedImage] = useState(post.featuredImage || null)
  const [seoTitle, setSeoTitle] = useState(post.seoTitle || '')
  const [seoDescription, setSeoDescription] = useState(post.seoDescription || '')
  const [mediaOpen, setMediaOpen] = useState(false)
  const [formState, setFormState] = useState<FormState | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const content = editorRef.current?.getContent()
    const formData = new FormData(e.currentTarget)
    formData.set('content', JSON.stringify(content))

    if (featuredImage) {
      formData.set('featuredImageId', featuredImage.id)
      formData.set('seoImageId', featuredImage.id) // 👈 use same image for SEO
    } else {
      formData.set('featuredImageId', '')
      formData.set('seoImageId', '')
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
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border p-2 rounded"
            placeholder="Post title"
          />
          {/* Title */}
          {hasErrors(formState) && formState.errors.title && (
            <p className="text-red-600 text-sm mt-1">{formState.errors.title}</p>
          )}
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium mb-1">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            value={slug}
            readOnly
            className={clsx(
              'w-full border p-2 rounded',
              hasErrors(formState) && formState.errors.slug && 'border-red-500'
            )}
          />
          {/* Slug */}
          {hasErrors(formState) && formState.errors.slug && (
            <p className="text-red-600 text-sm mt-1">{formState.errors.slug}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">
            Category
          </label>
          <input
            id="category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Post category"
          />
          {/* Category */}
          {hasErrors(formState) && formState.errors.category && (
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
              <NextImage
                src={featuredImage.url}
                alt="Featured"
                width={800}
                height={320}
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

        {/* SEO Title */}
        <div>
          <label htmlFor="seoTitle" className="block text-sm font-medium mb-1">
            SEO Title
          </label>
          <input
            name="seoTitle"
            type="text"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Custom title for search engines"
            required
          />
          <div className="flex justify-between text-sm text-zinc-500 mt-1">
            <span className={seoTitle.length > 60 ? "text-orange-600" : ""}>
              {seoTitle.length} / 60
            </span>
            {/* SEO Title */}
            {hasErrors(formState) && formState.errors.seoTitle && (
              <span className="text-red-600">{formState.errors.seoTitle}</span>
            )}
          </div>
        </div>

        {/* SEO Description */}
        <div>
          <label htmlFor="seoDescription" className="block text-sm font-medium mb-1">
            SEO Description
          </label>
          <textarea
            name="seoDescription"
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            rows={3}
            className="w-full border p-2 rounded"
            placeholder="Meta description for search and social"
            required
          />
          <div className="flex justify-between text-sm text-zinc-500 mt-1">
            <span className={seoDescription.length > 160 ? "text-orange-600" : ""}>
              {seoDescription.length} / 160
            </span>
            {/* SEO Description */}
            {hasErrors(formState) && formState.errors.seoDescription && (
              <span className="text-red-600">{formState.errors.seoDescription}</span>
            )}
          </div>
        </div>


        <div className="border rounded p-2">
          <TiptapEditor ref={editorRef} content={(post.content ?? { type: 'doc', content: [] }) as JSONContent} />
          {hasErrors(formState) && formState.errors.content && (
            <p className="text-red-600 text-sm mt-2">{formState.errors.content}</p>
          )}
        </div>
        <Button
          type="submit"
          variant="default"
          disabled={isPending}
          className="w-40"
        >
          {isPending && (
            <span className="inline-block w-4 h-4 border-2 border-t-transparent border-primary-foreground rounded-full animate-spin" />
          )}
          {isPending ? "Saving..." : "Update Post"}
        </Button>
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
