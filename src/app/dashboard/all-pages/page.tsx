import { prisma } from '@/lib/db'
import PageList from '@/components/ui/PageList'
import type { Page } from '@prisma/client'

export const dynamic = 'force-dynamic'

export default async function AllPagesDashboardPage() {
  const pages: Page[] = await prisma.page.findMany({
    //where: { published: true },
    orderBy: { createdAt: 'desc' },
    cacheStrategy: { ttl: 60 },
  })

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">All Pages (Admin)</h1>
      <PageList pages={pages} showEditLinks />
    </main>
  )
}
