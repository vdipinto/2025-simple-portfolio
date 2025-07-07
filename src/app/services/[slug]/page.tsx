import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import TiptapRenderer from "@/components/editor/TiptapRenderer";
import Image from "next/image";

// ✅ Only generate static pages for these slugs
const serviceSlugs = [
  "sanity-website-development",
  "nextjs-app-development",
  "wordpress-website-development",
];

// ✅ Generate static routes
export async function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

// ✅ Fix type so we can await `params`
type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;

  const page = await prisma.page.findUnique({
    where: { slug },
    include: { seoImage: true },
  });

  if (!page) return {};

  return {
    title: page.seoTitle ?? page.title,
    description: page.seoDescription ?? "",
  };
}

export default async function ServicePage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;

  if (!serviceSlugs.includes(slug)) return notFound();

  const page = await prisma.page.findUnique({
    where: { slug },
    include: { featuredImage: true },
  });

  if (!page) return notFound();

  return (
    <main className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      <h1 className="text-3xl font-bold">{page.title}</h1>

      {page.featuredImage?.url && (
        <Image
          src={page.featuredImage.url}
          alt={page.title}
          width={800}
          height={400}
          className="rounded-lg object-cover w-full h-auto"
        />
      )}

      <TiptapRenderer
        content={page.content as any}
        className="prose dark:prose-invert max-w-none"
      />
    </main>
  );
}
