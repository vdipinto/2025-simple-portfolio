'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import clsx from 'clsx'
import { updatePage } from '@/actions/pageActions'          // 🔁 create this server-action
import { hasErrors } from '@/utils/formHelpers'
import MediaLibraryClient from '@/components/dashboard/MediaLibraryClient'
import { TiptapEditor } from '@/components/ui/TiptapEditor'
import type { Page, Image } from '@prisma/client'
import type { JSONContent } from '@tiptap/react'
import type { FormState } from '@/actions/actions'
import NextImage from 'next/image'
import { Button } from "@/components/ui/button"

/* -------------------------------------------------------------------------- */

type Props = {
  page: Page & {
    featuredImage?: Image | null
    seoImage?: Image | null
  }
}

export default function EditPageForm({ page }: Props) {
  const router = useRouter()
  const editorRef = useRef<{ getContent: () => JSONContent }>(null)

  /* ─────────── local state ─────────── */
  const [title, setTitle] = useState(page.title)
  const [slug] = useState(page.slug)      // read-only
  const [published, setPublished] = useState(page.published)
  const [featuredImage, setFeaturedImage] = useState<Image | null>(page.featuredImage ?? null)
  const [seoTitle, setSeoTitle] = useState(page.seoTitle ?? '')
  const [seoDescription, setSeoDescription] = useState(page.seoDescription ?? '')
  const [mediaOpen, setMediaOpen] = useState(false)
  const [formState, setFormState] = useState<FormState | null>(null)
  const [isPending, startTransition] = useTransition()

  /* ─────────── submit handler ─────────── */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const content = editorRef.current?.getContent()
    const formData = new FormData(e.currentTarget)
    formData.set('content', JSON.stringify(content))

    // Featured / SEO image IDs
    if (featuredImage) {
      formData.set('featuredImageId', featuredImage.id)
      formData.set('seoImageId', featuredImage.id)
    } else {
      formData.set('featuredImageId', '')
      formData.set('seoImageId', '')
    }

    startTransition(async () => {
      const result = await updatePage(page.id, formData)

      if (result.success) {
        toast.success('Page updated!')
        router.push('/dashboard/all-pages')
      } else {
        toast.error(result.errors?.general || 'Failed to update page')
        setFormState(result)
      }
    })
  }

  /* ─────────── UI ─────────── */
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Edit Page</h1>

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
            placeholder="Page title"
          />
          {hasErrors(formState) && formState.errors.title && (
            <p className="text-red-600 text-sm mt-1">{formState.errors.title}</p>
          )}
        </div>

        {/* Slug (read-only) */}
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
        </div>

        {/* Published toggle */}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="published"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          Published
        </label>

        {/* Featured image */}
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
              onClick={() => setMediaOpen(true)}
            >
              {featuredImage ? 'Replace Featured Image' : 'Set Featured Image'}
            </button>

            {featuredImage && (
              <button
                type="button"
                className="underline text-red-600"
                onClick={() => setFeaturedImage(null)}
              >
                Remove Featured Image
              </button>
            )}
          </div>

          <input type="hidden" name="featuredImageId" value={featuredImage?.id ?? ''} />
        </div>

        {/* SEO Title */}
        <div>
          <label htmlFor="seoTitle" className="block text-sm font-medium mb-1">
            SEO Title
          </label>
          <input
            name="seoTitle"
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

        {/* Page Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium mb-1">
            Page Type
          </label>
          <select
            name="type"
            defaultValue={page.type ?? "GENERAL"}
            className="w-full border p-2 rounded"
          >
            <option value="GENERAL">General</option>
            <option value="SERVICES">Services</option>
          </select>
        </div>

        {/* Rich-text editor */}
        <div className="border rounded p-2">
          <TiptapEditor
            ref={editorRef}
            content={(page.content ?? { type: 'doc', content: [] }) as JSONContent}
          />
          {hasErrors(formState) && formState.errors.content && (
            <p className="text-red-600 text-sm mt-2">{formState.errors.content}</p>
          )}
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          variant="default"
          disabled={isPending}
          className="w-40"
        >
          {isPending && (
            <span className="inline-block w-4 h-4 border-2 border-t-transparent border-primary-foreground rounded-full animate-spin" />
          )}
          {isPending ? "Saving..." : "Update Page"}
        </Button>
      </form>

      {/* Media Library Modal */}
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
