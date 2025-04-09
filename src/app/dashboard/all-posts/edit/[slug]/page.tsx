import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import EditPostForm from '@/components/dashboard/EditPostForm'

export default async function EditPostPage(promise: Promise<{ params: { slug: string } }>) {
  const resolved = await promise
  const { slug } = resolved.params

  const post = await prisma.post.findUnique({
    where: { slug },
  })

  if (!post) return notFound()

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Edit Post</h1>
      <EditPostForm post={post} />
    </div>
  )
}
