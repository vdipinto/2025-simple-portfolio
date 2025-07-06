import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import TiptapRenderer from "@/components/editor/TiptapRenderer";
import Image from "next/image";

// Only show these services
const serviceSlugs = [
  "sanity-website-development",
  "nextjs-app-development",
  "wordpress-website-development",
];

export async function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const page = await prisma.page.findUnique({
    where: { slug },
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
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!serviceSlugs.includes(slug)) return notFound();

  const page = await prisma.page.findUnique({
    where: { slug },
    include: { featuredImage: true }, // ✅ include the image
  });

  if (!page) return notFound();

  return (
    <main className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      <h1 className="text-3xl font-bold">{page.title}</h1>

      {/* ✅ Featured image */}
      {page.featuredImage?.url && (
        <Image
          src={page.featuredImage.url}
          alt={page.title}
          width={800}
          height={400}
          className="rounded-lg object-cover w-full h-auto"
        />
      )}

      {/* ✅ Render tiptap content */}
      <div className="prose dark:prose-invert">
        <TiptapRenderer content={page.content as any} />
      </div>
    </main>
  );
}
