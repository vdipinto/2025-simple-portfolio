'use client'

import { useRef, useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { TiptapEditor } from '@/components/ui/TiptapEditor'
import { createPost } from '@/actions/actions'
import { slugify } from '@/lib/slugify'
import clsx from 'clsx'
import { toast } from 'sonner'
import MediaLibraryClient from '@/components/dashboard/MediaLibraryClient'
import type { FormState } from '@/actions/actions'
import type { JSONContent } from '@tiptap/react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"

function hasErrors(formState: FormState | null): formState is Exclude<FormState, { success: true }> {
  return formState !== null && formState.success === false
}

export default function CreatePostPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [category, setCategory] = useState('')
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDescription, setSeoDescription] = useState('')
  const [formState, setFormState] = useState<FormState | null>(null)
  const [isPending, startTransition] = useTransition()
  const editorRef = useRef<{ getContent: () => JSONContent }>(null)

  // 🖼️ Featured image
  const [featuredImage, setFeaturedImage] = useState<{ id: string; url: string } | null>(null)
  const [mediaOpen, setMediaOpen] = useState(false)

  useEffect(() => {
    setSlug(slugify(title))
  }, [title])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const content = editorRef.current?.getContent()
    formData.set('content', JSON.stringify(content))
    formData.set('seoTitle', seoTitle)
    formData.set('seoDescription', seoDescription)
    formData.set('category', category)

    if (featuredImage) {
      formData.set('featuredImageId', featuredImage.id)
      formData.set('seoImageId', featuredImage.id) // 👈 auto-use featured image for SEO
    } else {
      formData.set('featuredImageId', '')
      formData.set('seoImageId', '')
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
          {hasErrors(formState) && formState.errors.title && (
            <p className="text-red-600 text-sm mt-1">{formState.errors.title}</p>
          )}
        </div>

        <div>
          <input
            name="slug"
            value={slug}
            readOnly
            className={clsx('w-full border p-2 rounded', hasErrors(formState) && formState.errors.slug && 'border-red-500')}
            placeholder="Slug will be generated automatically"
          />
          {hasErrors(formState) && formState.errors.slug && (
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
          {hasErrors(formState) && formState.errors.category && (
            <p className="text-red-600 text-sm mt-1">{formState.errors.category}</p>
          )}
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
              <Image
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

          <button
            type="button"
            className="text-sm underline text-blue-600"
            onClick={() => setMediaOpen(true)}
          >
            Select Featured Image
          </button>

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
            <span className={seoTitle.length > 60 ? 'text-orange-600' : ''}>
              {seoTitle.length} / 60
            </span>
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
            <span className={seoDescription.length > 160 ? 'text-orange-600' : ''}>
              {seoDescription.length} / 160
            </span>
            {hasErrors(formState) && formState.errors.seoDescription && (
              <span className="text-red-600">{formState.errors.seoDescription}</span>
            )}
          </div>
        </div>

        <div className="border rounded p-2">
          <TiptapEditor ref={editorRef} content={{ type: 'doc', content: [] }} />
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

      {/* Media Picker Modal */}
      <MediaLibraryClient
        open={mediaOpen}
        onClose={() => setMediaOpen(false)}
        onSelect={(image) => {
          setFeaturedImage(image)
          setMediaOpen(false)
        }}
      />
    </div>
  )
}
