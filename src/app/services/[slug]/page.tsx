// src/app/services/[slug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// Static list of services
const services = [
  { slug: "sanity-website-development", title: "Sanity Website Development", description: "…" },
  { slug: "nextjs-app-development", title: "Next.js App Development", description: "…" },
  { slug: "wordpress-website-development", title: "WordPress Website Development", description: "…" },
];

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

// Metadata generator must await `params`
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.description,
  };
}

// Page component should also await `params`
export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return notFound();

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">{service.title}</h1>
      <p className="text-zinc-700 dark:text-zinc-300">{service.description}</p>
    </main>
  );
}
