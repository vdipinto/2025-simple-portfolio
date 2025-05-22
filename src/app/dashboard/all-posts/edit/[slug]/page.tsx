import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import EditPostForm from '@/components/dashboard/EditPostForm'

type Props = {
  params: {
    slug: string
  }
}

export default async function EditPostPage({ params }: Props) {
  const { slug } = params

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      category: true, // ✅ you need this
      featuredImage: true,
      seoImage: true,
    },
  })
  if (!post) return notFound()

  // Log if featuredImage exists and its content
  console.log('[EditPostPage] featuredImage exists:', Boolean(post.featuredImage))
  if (post.featuredImage) {
    console.log('[EditPostPage] featuredImage details:', post.featuredImage)
  }


  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Edit Post</h1>
      <EditPostForm post={post} />
    </div>
  )
}
