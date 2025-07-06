// src/app/pages/[slug]/page.tsx

import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import type { Metadata } from 'next'
import type { JSONContent } from '@tiptap/react'
import PostContent from '@/components/blog/PostContent'

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const page = await prisma.page.findUnique({
    where: { slug: params.slug },
    include: { seoImage: true },
  })

  if (!page) return {}

  return {
    title: page.seoTitle ?? page.title,
    description: page.seoDescription ?? '',
    openGraph: {
      images: page.seoImage?.url ? [{ url: page.seoImage.url }] : [],
    },
  }
}

type Props = {
  params: { slug: string }
}

export default async function Page({ params }: Props) {
  const page = await prisma.page.findUnique({
    where: { slug: params.slug },
  })

  if (!page) return notFound()

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">{page.title}</h1>
      <PostContent content={page.content as JSONContent} />
    </main>
  )
}
