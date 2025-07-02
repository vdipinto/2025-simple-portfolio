/* --- LatestBlogPosts.tsx ---------------------------------------------- */
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { format } from 'date-fns';

export default async function LatestBlogPosts() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });

  if (posts.length === 0) return null;

  // choose the correct md:grid-cols-* utility
  const mdCols =
    posts.length === 1 ? 'md:grid-cols-1'
    : posts.length === 2 ? 'md:grid-cols-2'
    : 'md:grid-cols-3';      // 3-in-a-row from the md breakpoint up

  return (
    <>
      {/* Section header -------------------------------------------------- */}
      <section className="w-full px-4 border-b border-x border-zinc-200 dark:border-zinc-800">
        <div className="border-x border-zinc-200 dark:border-zinc-800 -mt-px -mb-px">
          <div className="w-full border-y border-y-zinc-200 dark:border-y-zinc-800 py-6 -my-px">
            <h2 className="text-center font-mono text-[10px] tracking-[2px] text-zinc-600 dark:text-zinc-400 uppercase">
              Latest Posts
            </h2>
          </div>
        </div>
      </section>

      {/* Posts grid ------------------------------------------------------ */}
      <section className="w-full px-4 border-x border-zinc-200 dark:border-zinc-800">
        <div className={`grid grid-cols-1 ${mdCols}`}>
          {posts.map(post => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col justify-center
                         min-h-[350px] p-6 border border-zinc-200 dark:border-zinc-800
                         hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              <h3 className="text-[24px] leading-[34px] font-medium group-hover:underline">
                {post.title}
              </h3>

              {(post.readingTime || post.publishedAt) && (
                <div className="flex items-center gap-x-2 tracking-wider uppercase text-zinc-500 text-[12px] leading-[18px] mt-2">
                  {post.readingTime && <span>{post.readingTime} min read</span>}
                  {post.readingTime && post.publishedAt && <span>•</span>}
                  {post.publishedAt && (
                    <time dateTime={post.publishedAt.toISOString().split('T')[0]}>
                      {format(post.publishedAt, 'MMMM d, yyyy')}
                    </time>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
