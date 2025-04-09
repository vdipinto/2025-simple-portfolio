import { prisma } from '@/lib/db'
import PostList from '@/components/ui/PostList'

export default async function AllPostsDashboardPage() {
  const posts = await prisma.post.findMany()

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">All Posts (Admin)</h1>
      <PostList posts={posts} showEditLinks />
    </main>
  )
}
