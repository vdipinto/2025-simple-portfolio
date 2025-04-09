'use client'

import { useActionState } from 'react'
import { useEffect, useState } from 'react'
import { TiptapEditor } from '@/components/ui/TiptapEditor'
import { createPost } from '@/actions/actions'
import { slugify } from '@/lib/slugify'
import clsx from 'clsx'


export default function CreatePostPage() {
    const [editorContent, setEditorContent] = useState({})
    const [state, formAction] = useActionState(createPost, null)
    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [postSlug, setPostSlug] = useState('')

    useEffect(() => {
        if (state?.success) {
          setPostSlug(state.slug || '')
        }
      }, [state])

    useEffect(() => {
        setSlug(slugify(title))
      }, [title])
      

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-4">
            <h1 className="text-2xl font-bold">New Post</h1>

            <form action={formAction} className="space-y-4">
                <div>
                <input
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full border p-2 rounded"
                    placeholder="Title"
                    />

                    {state?.errors?.title && (
                    <p className="text-red-600 text-sm mt-1">{state.errors.title}</p>
                    )}
                </div>

                <div>
                    <input
                        name="slug"
                        value={slug}
                        readOnly
                        className={clsx(
                        'w-full border p-2 rounded bg-gray-100 text-gray-600',
                        state?.errors?.slug && 'border-red-500'
                        )}
                        placeholder="Slug will be generated automatically"
                    />

                    {state?.errors?.slug && (
                        <p className="text-red-600 text-sm mt-1">{state.errors.slug}</p>
                    )}
                </div>

                <div>
                    <input name="category" className="w-full border p-2 rounded" placeholder="Category" />
                    {state?.errors?.category && (
                        <p className="text-red-600 text-sm mt-1">{state.errors.category}</p>
                    )}
                </div>

                <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="published" />
                    Publish immediately
                </label>

                <input type="hidden" name="content" value={JSON.stringify(editorContent)} />

                <div className="border rounded p-2">
                    <TiptapEditor content={{}} onChange={setEditorContent} />
                    {state?.errors?.content && (
                        <p className="text-red-600 text-sm mt-2">{state.errors.content}</p>
                    )}
                </div>

                <button type="submit" className="bg-black text-white px-4 py-2 rounded">
                    Publish Post
                </button>

                {state?.errors?.general && (
                    <p className="text-red-600 text-sm mt-2">{state.errors.general}</p>
                )}
            </form>
        </div>
    )
}
