
import { prisma } from "@/lib/db"
import Link from "next/link"
import { format } from 'date-fns'


export default async function LatestBlogPosts() {
    const posts = await prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        take: 3,
    });

    if (posts.length === 0) {
        return null;
    }

    return (
        <>
            {/* Title Section */}
            <section className="w-full mx-auto px-4 border-b border-x border-zinc-200 dark:border-zinc-800">
                <div className="border-x border-zinc-200 dark:border-zinc-800 relative -mt-px -mb-px">
                    <div className="w-full border-y border-y-zinc-200 dark:border-y-zinc-800 py-6 -my-px">
                        <h2 className="text-center font-mono text-[10px] tracking-[2px] text-zinc-600 dark:text-zinc-400 uppercase">
                            Latest Posts
                        </h2>
                    </div>
                </div>
            </section>
            {/* Cards Section */}
            <section className="w-full mx-auto px-4 border-b border-x border-zinc-200 dark:border-zinc-800">
                <div className="flex flex-wrap">
                {posts.map((post, index) => (
  <div
    key={post.id}
    className={`
      w-full sm:w-1/2 md:w-1/3
      border-x border-zinc-200 dark:border-zinc-800
      ${index !== 0 ? 'border-t-0' : ''}
      ${index !== posts.length - 1 ? 'border-b' : ''}
    `}
  >
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden flex-grow p-6 gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-200 h-full"
    >
      <h3 className="text-[24px] leading-[34px] font-medium group-hover:underline">
        {post.title}
      </h3>

      {(post.readingTime || post.publishedAt) && (
        <div className="flex items-center gap-x-2 tracking-wider uppercase text-zinc-500 text-[12px] leading-[18px]">
          {post.readingTime && <span>{post.readingTime} min read</span>}
          {post.readingTime && post.publishedAt && <span>•</span>}
          {post.publishedAt && (
            <time dateTime={new Date(post.publishedAt).toISOString().split('T')[0]}>
              {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
            </time>
          )}
        </div>
      )}
    </Link>
  </div>
))}

                </div>
            </section>
        </>
    );
}
