import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import PostContent from '@/components/blog/PostContent'

interface PostPageProps {
  params: {
    slug: string
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  })

  if (!post) return notFound()

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
      <PostContent content={post.content} />
    </main>
  )
}
