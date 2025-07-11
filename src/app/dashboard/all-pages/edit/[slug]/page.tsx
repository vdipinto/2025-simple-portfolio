// src/app/dashboard/all-pages/edit/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'

import EditPageForm from '@/components/dashboard/EditPageForm'

type Props = {
  params: Promise<{ slug: string }> // Promise because App Router passes an async proxy
}

export default async function EditPage({ params }: Props) {
  const { slug } = await params            // <— await is required

  // 🔍 Fetch the page
  const page = await prisma.page.findUnique({
    where: { slug },
    include: {
      featuredImage: true,
      seoImage: true,
    },
  })

  // 404 if it doesn't exist
  if (!page) return notFound()

  console.log("Editing page type:", page.type);

  // ✅ Render the edit form
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Edit Page</h1>
      {/* Pass the whole record down so the form can pre-fill */}
      <EditPageForm page={page} />
    </div>
  )
}
