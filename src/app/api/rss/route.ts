import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const Feed = (await import("rss")).default;
    const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";

    const posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    });

    const feed = new Feed({
      title: "Vito Dipinto — Web Developer",
      description: "Articles and insights on web development by Vito Dipinto.",
      id: siteUrl,
      link: siteUrl,
      language: "en",
      favicon: `${siteUrl}/favicon.ico`,
      copyright: `All rights reserved ${new Date().getFullYear()}, Vito Dipinto`,
      feedLinks: {
        atom: `${siteUrl}/api/rss`, // 👈 this line adds the <atom:link>
      },
    });
    

    posts.forEach((post) => {
      feed.item({
        title: post.title,
        link: `${siteUrl}/blog/${post.slug}`,
        date: post.publishedAt ?? post.createdAt,
        // description: post.excerpt || "", // only if available
      });
    });

    return new NextResponse(feed.xml({ indent: true }), {
      headers: {
        "Content-Type": "application/rss+xml",
      },
    });
  } catch (error) {
    console.error("RSS feed generation failed:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
