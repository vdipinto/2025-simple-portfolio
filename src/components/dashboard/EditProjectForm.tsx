'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { updateProject } from '@/actions/projectActions'
import { hasErrors } from '@/utils/formHelpers'
import MediaLibraryClient from '@/components/dashboard/MediaLibraryClient'
import { TiptapEditor } from '@/components/ui/TiptapEditor'
import type { Project, Category, Image } from '@prisma/client'
import type { JSONContent } from '@tiptap/react'
import type { FormState } from '@/actions/actions'
import NextImage from 'next/image'
import { Button } from "@/components/ui/button"

type Props = {
    project: Project & {
        category?: Category | null
        featuredImage?: Image | null
        seoImage?: Image | null
    }
}

export default function EditProjectForm({ project }: Props) {
    const router = useRouter()
    const editorRef = useRef<{ getContent: () => JSONContent }>(null)

    const [title, setTitle] = useState(project.title)
    const [slug] = useState(project.slug)
    const [published, setPublished] = useState(project.published)
    const [category, setCategory] = useState(project.category?.name ?? '')
    const [featuredImage, setFeaturedImage] = useState<Image | null>(project.featuredImage ?? null)
    const [seoTitle, setSeoTitle] = useState(project.seoTitle ?? '')
    const [seoDescription, setSeoDescription] = useState(project.seoDescription ?? '')
    const [liveUrl, setLiveUrl] = useState(project.liveUrl ?? '')
    const [repoUrl, setRepoUrl] = useState(project.repoUrl ?? '')
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
            formData.set('seoImageId', featuredImage.id)
        } else {
            formData.set('featuredImageId', '')
            formData.set('seoImageId', '')
        }

        startTransition(async () => {
            const result = await updateProject(project.id, formData)

            if (result.success) {
                toast.success('Project updated!')
                router.push('/dashboard/all-projects')
            } else {
                toast.error(result.errors?.general || 'Failed to update project')
                setFormState(result)
            }
        })
    }

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-4">
            <h1 className="text-2xl font-bold">Edit Project</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
                    <input
                        id="title"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full border p-2 rounded"
                        placeholder="Project title"
                    />
                    {hasErrors(formState) && formState.errors.title && (
                        <p className="text-red-600 text-sm mt-1">{formState.errors.title}</p>
                    )}
                </div>

                {/* Slug (read-only, for display) */}
                <div>
                    <label htmlFor="slug" className="block text-sm font-medium mb-1">Slug</label>
                    <input
                        id="slug"
                        value={slug}
                        readOnly
                        className="w-full border p-2 rounded text-gray-600 cursor-not-allowed"
                    />
                    <input type="hidden" name="slug" value={slug} />
                </div>

                {/* Published */}
                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        name="published"
                        checked={published}
                        onChange={(e) => setPublished(e.target.checked)}
                    />
                    Published
                </label>

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
                        placeholder="e.g. Web, Mobile, Design"
                        required
                    />
                    {hasErrors(formState) && formState.errors.category && (
                        <p className="text-red-600 text-sm mt-1">{formState.errors.category}</p>
                    )}
                </div>

                {/* Live & Repo URLs */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="liveUrl" className="block text-sm font-medium mb-1">Live URL</label>
                        <input
                            name="liveUrl"
                            value={liveUrl}
                            onChange={(e) => setLiveUrl(e.target.value)}
                            className="w-full border p-2 rounded"
                            placeholder="https://example.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="repoUrl" className="block text-sm font-medium mb-1">Repo URL</label>
                        <input
                            name="repoUrl"
                            value={repoUrl}
                            onChange={(e) => setRepoUrl(e.target.value)}
                            className="w-full border p-2 rounded"
                            placeholder="https://github.com/example"
                        />
                    </div>
                </div>

                {/* Featured Image */}
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
                        <button type="button" className="underline text-blue-600" onClick={() => setMediaOpen(true)}>
                            {featuredImage ? 'Replace Featured Image' : 'Set Featured Image'}
                        </button>
                        {featuredImage && (
                            <button type="button" className="underline text-red-600" onClick={() => setFeaturedImage(null)}>
                                Remove Featured Image
                            </button>
                        )}
                    </div>
                    <input type="hidden" name="featuredImageId" value={featuredImage?.id ?? ''} />
                </div>

                {/* SEO Title */}
                <div>
                    <label htmlFor="seoTitle" className="block text-sm font-medium mb-1">SEO Title</label>
                    <input
                        name="seoTitle"
                        value={seoTitle}
                        onChange={(e) => setSeoTitle(e.target.value)}
                        className="w-full border p-2 rounded"
                        placeholder="SEO title"
                        required
                    />
                </div>

                {/* SEO Description */}
                <div>
                    <label htmlFor="seoDescription" className="block text-sm font-medium mb-1">SEO Description</label>
                    <textarea
                        name="seoDescription"
                        value={seoDescription}
                        onChange={(e) => setSeoDescription(e.target.value)}
                        rows={3}
                        className="w-full border p-2 rounded"
                        placeholder="SEO description"
                        required
                    />
                </div>

                {/* Rich-text editor */}
                <div className="border rounded p-2">
                    <TiptapEditor
                        ref={editorRef}
                        content={(project.content ?? { type: 'doc', content: [] }) as JSONContent}
                    />
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    variant="default"
                    disabled={isPending}
                    className="w-40"
                >
                    {isPending && (
                        <span className="inline-block w-4 h-4 border-2 border-t-transparent border-primary-foreground rounded-full animate-spin" />
                    )}
                    {isPending ? "Saving..." : "Update Project"}
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
