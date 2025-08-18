/* --- src/components/sections/LatestBlogPosts.tsx ----------------------- */
import { prisma } from "@/lib/db";
import { format } from "date-fns";
import StretchedLink from "@/components/ui/StretchedLink";
import { ViewCTA } from "@/components/ui/seeMore";

export default async function LatestBlogPosts() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 3,
    include: { featuredImage: true },
  });

  if (posts.length === 0) return null;

  // ----------------------------------------------------------------------
  // 1 post — use the SAME card style as the 2–3 posts grid.
  // Keep an empty right column to mirror the later layout, no image.
  // ----------------------------------------------------------------------
  if (posts.length === 1) {
    const post = posts[0];
    return (
      <>
        {/* Section header */}
        <section className="w-full mx-auto px-4 border-b border-x border-zinc-200 dark:border-zinc-800">
          <div className="border-x border-zinc-200 dark:border-zinc-800 -mt-px -mb-px">
            <div className="w-full border-y border-y-zinc-200 dark:border-y-zinc-800 py-6 -my-px">
              <h2 className="text-center font-mono text-[10px] tracking-[2px] text-zinc-600 dark:text-zinc-400 uppercase">
                Featured Post
              </h2>
            </div>
          </div>
        </section>

        {/* Two-column shell; left is a single card, right is intentionally empty */}
        <section className="w-full mx-auto px-4 border-b border-x border-zinc-200 dark:border-zinc-800">
          <div className="border-x border-zinc-200 dark:border-zinc-800 grid grid-cols-1 lg:grid-cols-[1fr_2fr]">
            {/* LEFT: the same card style as in the multi-post grid */}
            <div className="relative">
              <div
                className="relative group flex flex-col justify-center
                           min-h-[350px] p-6 border border-zinc-200 dark:border-zinc-800
                           hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                {/* Stretched link */}
                <StretchedLink
                  href={`/blog/${post.slug}`}
                  ariaLabel={`${post.title} – read more`}
                />

                <h3 className="text-[24px] leading-[34px] font-medium group-hover:underline">
                  {post.title}
                </h3>

                {(post.readingTime || post.publishedAt) && (
                  <div className="flex items-center gap-x-2 tracking-wider uppercase text-zinc-500 text-[12px] leading-[18px] mt-2">
                    {post.readingTime && <span>{post.readingTime} min read</span>}
                    {post.readingTime && post.publishedAt && <span>•</span>}
                    {post.publishedAt && (
                      <time dateTime={post.publishedAt.toISOString().split("T")[0]}>
                        {format(post.publishedAt, "MMMM d, yyyy")}
                      </time>
                    )}
                  </div>
                )}

                {/* CTA */}
                <div className="mt-4 z-20">
                  <ViewCTA as="span" variant="more" />
                </div>
              </div>
            </div>

            {/* RIGHT: intentionally empty to match the split layout */}
            <div className="hidden lg:block" aria-hidden />
          </div>
        </section>
      </>
    );
  }

  // ----------------------------------------------------------------------
  // 2–3 posts grid
  // ----------------------------------------------------------------------
  const mdCols = posts.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3";

  return (
    <>
      {/* Section header */}
      <section className="w-full px-4 border-b border-x border-zinc-200 dark:border-zinc-800">
        <div className="border-x border-zinc-200 dark:border-zinc-800 -mt-px -mb-px">
          <div className="w-full border-y border-y-zinc-200 dark:border-y-zinc-800 py-6 -my-px">
            <h2 className="text-center font-mono text-[10px] tracking-[2px] text-zinc-600 dark:text-zinc-400 uppercase">
              Latest Posts
            </h2>
          </div>
        </div>
      </section>

      {/* Grid cards */}
      <section className="w-full px-4 border-x border-zinc-200 dark:border-zinc-800">
        <div className={`grid grid-cols-1 ${mdCols}`}>
          {posts.map((post) => (
            <div
              key={post.id}
              className="relative group flex flex-col justify-center
                         min-h-[350px] p-6 border border-zinc-200 dark:border-zinc-800
                         hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              {/* Stretched link */}
              <StretchedLink
                href={`/blog/${post.slug}`}
                ariaLabel={`${post.title} – read more`}
              />

              <h3 className="text-[24px] leading-[34px] font-medium group-hover:underline">
                {post.title}
              </h3>

              {(post.readingTime || post.publishedAt) && (
                <div className="flex items-center gap-x-2 tracking-wider uppercase text-zinc-500 text-[12px] leading-[18px] mt-2">
                  {post.readingTime && <span>{post.readingTime} min read</span>}
                  {post.readingTime && post.publishedAt && <span>•</span>}
                  {post.publishedAt && (
                    <time dateTime={post.publishedAt.toISOString().split("T")[0]}>
                      {format(post.publishedAt, "MMMM d, yyyy")}
                    </time>
                  )}
                </div>
              )}

              {/* CTA */}
              <div className="mt-4 z-20">
                <ViewCTA as="span" variant="more" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
