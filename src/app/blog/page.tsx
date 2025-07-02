import { prisma } from '@/lib/db'
import PostList from '@/components/ui/PostList';


export default async function BlogPage() {
  const posts = await prisma.post.findMany()

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Blog</h1>
      <PostList posts={posts} />
    </div>
  )
}
