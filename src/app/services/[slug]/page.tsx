import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import type { JSONContent } from "@tiptap/react";
import PostContent from "@/components/blog/PostContent";
import Image from "next/image";

export async function generateMetadata(props: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = props.params;

  const page = await prisma.page.findFirst({
    where: { slug, type: "SERVICES" },
    include: { seoImage: true },
  });

  if (!page) return {};

  return {
    title: page.seoTitle ?? page.title,
    description: page.seoDescription ?? "",
    openGraph: {
      images: page.seoImage?.url
        ? [{ url: page.seoImage.url.replace("xsocd3chi5.ufs.sh", "utfs.io") }]
        : [],
    },
  };
}

type Props = {
  params: { slug: string };
};

export default async function ServicesPage({ params }: Props) {
  const { slug } = params;

  const page = await prisma.page.findFirst({
    where: { slug, type: "SERVICES" },
    include: { featuredImage: true },
  });

  if (!page) return notFound();

  const imageUrl = page.featuredImage?.url?.replace(
    "xsocd3chi5.ufs.sh",
    "utfs.io"
  );

  return (
    <main className="max-w-3xl mx-auto p-6">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={page.featuredImage?.alt ?? page.title}
          width={800}
          height={400}
          className="rounded-lg object-cover w-full h-auto mb-6"
        />
      )}

      <h1 className="text-4xl font-bold mb-6">{page.title}</h1>
      <PostContent content={page.content as JSONContent} />
    </main>
  );
}
