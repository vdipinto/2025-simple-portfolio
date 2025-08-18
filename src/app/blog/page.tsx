// src/app/blog/page.tsx
import { prisma } from '@/lib/db'
import PostList, { type PostListItem } from '@/components/ui/PostList'

// Stable UK formatter (server-side)
const dtfUK = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Europe/London',
})

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      readingTime: true,
      publishedAt: true,
      seoDescription: true,
      featuredImage: {
        select: { url: true, alt: true, width: true, height: true },
      },
    },
  })

  // Shape to client-safe props: preformat dates, no Date objects
  const shaped: PostListItem[] = posts.map((p) => {
    const iso = p.publishedAt ? p.publishedAt.toISOString() : null
    const uk = iso ? dtfUK.format(new Date(iso)) : null

    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      readingTime: p.readingTime ?? null,
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
      published: true, // safety flag for PostList's public filter
    }
  })

  return (
    <div className="mx-auto p-6 max-w-6xl">
      <h1 className="text-4xl font-bold mb-6">What I’m Blogging About</h1>

      <div className="mb-10 text-muted-foreground">
        <p>
          I write about what I’m building, what I’m learning, and what I’m
          experimenting with—especially my journey into React. You’ll find
          posts on content systems, workflows, and scaling.
        </p>
      </div>

      <PostList posts={shaped} />
    </div>
  )
}
