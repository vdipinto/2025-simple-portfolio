'use client'

import Image from 'next/image'
import Link from 'next/link'

export type BlogCardProps = {
  id: string
  title: string
  href: string   // ✅ only href, no slug
  readingTime: number | null
  publishedAtISO: string | null
  publishedAtUK: string | null
  seoDescription?: string | null
  featuredImage?: {
    url: string
    alt?: string | null
    width?: number | null
    height?: number | null
  } | null
}

export default function BlogCard({
  id,
  title,
  href,
  readingTime,
  publishedAtISO,
  publishedAtUK,
  seoDescription,
  featuredImage,
}: BlogCardProps) {
  const hasDate = !!(publishedAtISO && publishedAtUK)
  const excerpt = seoDescription || ''

  return (
    <article className="group blog-card" data-id={id}>
      {/* Cover */}
      <Link
        href={href}
        className="blog-card__cover focus-ring"
        aria-label={`Open blog post: ${title}`}
      >
        <div className="blog-card__media">
          {featuredImage?.url ? (
            <Image
              src={featuredImage.url}
              alt={featuredImage.alt || title}
              fill
              className="object-cover"
              sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
              No image
            </div>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="blog-card__body">
        {(typeof readingTime === 'number' || hasDate) && (
          <p className="blog-card__meta">
            {typeof readingTime === 'number' ? <span>{readingTime} min read</span> : null}
            {typeof readingTime === 'number' && hasDate ? <span> • </span> : null}
            {hasDate ? <time dateTime={publishedAtISO!}>{publishedAtUK}</time> : null}
          </p>
        )}

        <Link href={href} className="focus-ring">
          <h3 className="blog-card__title">{title}</h3>
        </Link>

        {excerpt && <p className="blog-card__excerpt">{excerpt}</p>}
      </div>

      {/* Footer */}
      <div className="blog-card__footer">
        <Link href={href} className="blog-card__cta focus-ring">
          Read case study →
        </Link>
      </div>
    </article>
  )
}
