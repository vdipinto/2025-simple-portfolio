import { prisma } from '@/lib/db'
import PageList from '@/components/ui/PageList'

export const dynamic = "force-dynamic";

export default async function AllPagesDashboardPage() {
  // newest first – adjust as you like
  const pages = await prisma.page.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">All Pages (Admin)</h1>
      <PageList pages={pages} showEditLinks />
    </main>
  )
}