import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";

export default async function FeaturedProject() {
  const post = await prisma.post.findFirst({
    where: {
      published: true,
      title: {
        contains: "how I built my portfolio website",
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      slug: true,
      title: true,
      publishedAt: true,
      readingTime: true,
      featuredImage: true,
    },
  });

  if (!post) {
    return (
      <section className="w-full mx-auto px-4 border-b border-x border-zinc-200 dark:border-zinc-800">
        <div className="border-x border-zinc-200 dark:border-zinc-800 -mt-px -mb-px">
          <div className="w-full border-y border-y-zinc-200 dark:border-y-zinc-800 py-6 -my-px">
            <h2 className="text-center font-mono text-[10px] tracking-[2px] text-zinc-600 dark:text-zinc-400 uppercase">
              Featured Post
            </h2>
          </div>
        </div>

        <div className="px-6 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Post not found.
        </div>
      </section>
    );
  }

  return (
    <section className="w-full mx-auto px-4 border-b border-x border-zinc-200 dark:border-zinc-800">
      <div className="border-x border-zinc-200 dark:border-zinc-800 -mt-px -mb-px">
        <div className="w-full border-y border-y-zinc-200 dark:border-y-zinc-800 py-6 -my-px">
          <h2 className="text-center font-mono text-[10px] tracking-[2px] text-zinc-600 dark:text-zinc-400 uppercase">
            Featured Post
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-x border-zinc-200 dark:border-zinc-800">
        <div className="w-full h-full">
          <Image
            src={post.featuredImage?.url || "/images/fallback.jpeg"}
            alt={post.title}
            width={800}
            height={600}
            className="w-full h-full object-cover"
          />

        </div>

        <Link
          href={`/blog/${post.slug}`}
          className="group flex flex-col justify-center p-6
    border-x border-b border-zinc-200 dark:border-zinc-800
    hover:bg-zinc-50  dark:hover:bg-zinc-900
    hover:border-zinc-200 dark:hover:border-zinc-800      /* keep border on hover */
    transition-colors duration-200"
        >
          <h3 className="text-[24px] leading-[34px] font-medium group-hover:underline">
            {post.title}
          </h3>

          {(post.readingTime || post.publishedAt) && (
            <div className="flex items-center gap-x-2 tracking-wider uppercase text-zinc-500 text-[12px] leading-[18px] mt-2">
              {post.readingTime && <span>{post.readingTime} min read</span>}
              {post.readingTime && post.publishedAt && <span>•</span>}
              {post.publishedAt && (
                <time dateTime={new Date(post.publishedAt).toISOString().split("T")[0]}>
                  {format(new Date(post.publishedAt), "MMMM d, yyyy")}
                </time>
              )}
            </div>
          )}
        </Link>
      </div>
    </section>
  );
}
