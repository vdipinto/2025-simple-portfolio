// src/app/case-studies/page.tsx
import { prisma } from '@/lib/db'
import PostList, { type PostListItem } from '@/components/ui/PostList'

const dtfUK = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Europe/London',
})

export const revalidate = 60 // optional ISR

export default async function CaseStudyIndexPage() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      publishedAt: true,
      seoDescription: true,
      featuredImage: {
        select: { url: true, alt: true, width: true, height: true },
      },
    },
  })

  const shaped: PostListItem[] = projects.map((p) => {
    const iso = p.publishedAt ? p.publishedAt.toISOString() : null
    const uk = iso ? dtfUK.format(new Date(iso)) : null

    return {
      id: p.id,
      title: p.title,
      slug: p.slug, // ✅ just the slug, no prefix
      readingTime: null,
      publishedAtISO: iso,
      publishedAtUK: uk,
      seoDescription: p.seoDescription,
      featuredImage: p.featuredImage
        ? {
            url: p.featuredImage.url,
            alt: p.featuredImage.alt ?? null,
            width: p.featuredImage.width ?? null,
            height: p.featuredImage.height ?? null,
          }
        : null,
      published: true,
    }
  })

  return (
    <div className="mx-auto p-6 max-w-6xl">
      <h1 className="text-4xl font-bold mb-6">Case Studies</h1>
      <div className="mb-10 text-muted-foreground">
        <p>
          A selection of projects with deeper write-ups: goals, decisions,
          trade-offs, and outcomes.
        </p>
      </div>
      <PostList posts={shaped} basePath="/case-studies" />
    </div>
  )
}
