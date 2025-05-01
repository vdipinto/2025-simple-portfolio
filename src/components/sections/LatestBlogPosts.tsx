
import { prisma } from "@/lib/db"
import { calculateReadingTime } from "@/lib/calculate-reading-time"
import Link from "next/link"
import type { TiptapContent } from "@/lib/types" // 👈 make sure you import this!

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
                            className={`bg-card text-card-foreground shadow hover:shadow-lg
        h-full overflow-hidden transition rounded-none flex flex-col p-6
        w-full sm:w-1/2 md:w-1/3
        border-x border-zinc-200 dark:border-zinc-800
        ${index !== 0 ? 'border-t-0' : ''}
        ${index !== posts.length - 1 ? 'border-b' : ''}`}
                        >
                            <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                            <p className="text-muted-foreground text-sm mb-4">
                                {calculateReadingTime(post.content as TiptapContent)} min read
                            </p>
                            <Link href={`/blog/${post.slug}`} className="text-primary underline text-sm mt-auto">
                                Read more →
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

        </>
    );
}
