export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/db'
import PageList from '@/components/ui/PageList'

export default async function AllPagesDashboardPage() {
  // newest first – adjust as you like
  const pages = await prisma.page.findMany({
    orderBy: { createdAt: 'desc' },
    cacheStrategy: { ttl: 60 },   // ✔ no error
  })

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">All Pages (Admin)</h1>
      <PageList pages={pages} showEditLinks />
    </main>
  )
}