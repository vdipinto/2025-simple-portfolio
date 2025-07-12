import { prisma } from "@/lib/db";

export async function getProjectBySlug(slug: string) {
  return prisma.project.findUnique({
    where: { slug },
    include: {
      featuredImage: true,
      seoImage: true,
      tags: true,
      category: true,
      images: {
        include: { image: true },
        orderBy: { position: "asc" },
      },
    },
  });
}