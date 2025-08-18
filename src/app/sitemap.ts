// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { prisma } from "@/lib/db";

// ⬇️ MUST be a literal, not an expression
export const revalidate = 86400; // 24h

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const urls: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/case-studies`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/services`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
  ];

  try {
    const [posts, projects] = await Promise.all([
      prisma.post.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true, publishedAt: true, createdAt: true },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.project.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true, publishedAt: true, createdAt: true },
        orderBy: { publishedAt: "desc" },
      }),
    ]);

    urls.push(
      ...posts.map((p) => ({
        url: `${SITE_URL}/blog/${p.slug}`,
        lastModified: p.updatedAt ?? p.publishedAt ?? p.createdAt ?? now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...projects.map((c) => ({
        url: `${SITE_URL}/case-studies/${c.slug}`,
        lastModified: c.updatedAt ?? c.publishedAt ?? c.createdAt ?? now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    );
  } catch (err) {
    console.error("sitemap: failed to fetch dynamic URLs", err);
  }

  return urls;
}
