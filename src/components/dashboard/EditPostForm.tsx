'use client'

import { useRef, useState, useEffect, startTransition } from 'react'
import { TiptapEditor } from '@/components/ui/TiptapEditor'
import { useActionState } from 'react'
import { slugify } from '@/lib/slugify'
import { updatePost } from '@/actions/actions'
import { toast } from 'sonner'
import { UpdatePostResult } from '@/types/post'

export default function EditPostForm({ post }: { post: any }) {
  const [title, setTitle] = useState(post.title)
  const [slug, setSlug] = useState(post.slug)
  const [category, setCategory] = useState(post.category ?? '')
  const [published, setPublished] = useState(post.published)
  const [state, formAction] = useActionState<UpdatePostResult | null, FormData>(
    updatePost,
    null
  )
  

  const editorRef = useRef<{ getContent: () => any }>(null)

  const isNewPost = false

  useEffect(() => {
    if (isNewPost) {
      setSlug(slugify(title))
    }
  }, [title, isNewPost])

  return (
    <form
    action={async (formData: FormData) => {
      const content = editorRef.current?.getContent()
      formData.append('content', JSON.stringify(content))
  
      await formAction(formData)
  
      // ✅ Now use `state`, not the result of formAction
      startTransition(() => {
        if (state?.success) {
          toast.success(state.published ? 'Post published successfully!' : 'Post saved as draft.')
        } else if (state?.message) {
          toast.error(state.message)
        }
      })
    }}
    className="space-y-4"
  >
      <input type="hidden" name="slug" value={post.slug} />

      <div>
        <label className="block mb-1 text-sm font-medium">Title</label>
        <input
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Slug</label>
        <input
          name="slug"
          value={slug}
          readOnly
          className="w-full border p-2 rounded bg-gray-100 text-gray-600"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Category</label>
        <input
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-2 rounded"
        />
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

      
      <TiptapEditor ref={editorRef} content={post.content ?? {}} />

      <button type="submit" className="bg-black text-white px-4 py-2 rounded">
        Update Post
      </button>

      {state?.errors?.general && (
        <p className="text-red-600 text-sm mt-2">{state.errors.general}</p>
      )}
    </form>
  )
}
