import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'

import EditProjectForm from '@/components/dashboard/EditProjectForm';

type Props = {
  params: { slug: string }
}

export default async function EditProjectPage({ params }: Props) {
  const { slug } = params

  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      category: true,        // ✅ singular
      tags: true,            // ✅ array
      featuredImage: true,
      seoImage: true,
    },
  })

  if (!project) return notFound()

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Edit Project</h1>
      <EditProjectForm project={project} />
    </div>
  )
}
