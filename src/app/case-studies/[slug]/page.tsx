import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/queries/project";
import type { Metadata } from "next";
import type { JSONContent } from "@tiptap/react";
import PostContent from "@/components/blog/PostContent";
import Image from "next/image";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);

  if (!project) return {};

  const imageUrl = project.seoImage?.url?.replace("xsocd3chi5.ufs.sh", "utfs.io");

  return {
    title: project.seoTitle ?? project.title,
    description: project.seoDescription ?? "",
    openGraph: {
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
  };
}

interface Props {
  params: { slug: string };
}

export default async function ProjectPage({ params }: Props) {
  const project = await getProjectBySlug(params.slug);

  if (!project) return notFound();

  const imageUrl = project.featuredImage?.url?.replace("xsocd3chi5.ufs.sh", "utfs.io");

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={project.featuredImage?.alt ?? project.title}
          width={800}
          height={400}
          className="rounded-lg object-cover w-full h-auto mb-6"
        />
      )}

      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
      <p className="text-zinc-600 mb-6">{project.seoDescription}</p>

      {/* Tiptap content renderer */}
      <PostContent content={project.content as JSONContent} />
    </main>
  );
}
