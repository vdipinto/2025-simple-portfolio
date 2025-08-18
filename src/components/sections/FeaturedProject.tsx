/* --- src/components/sections/FeaturedProject.tsx ---------------------- */
import { prisma } from "@/lib/db";
import Image from "next/image";
import { format } from "date-fns";
import StretchedLink from "@/components/ui/StretchedLink";
import { ViewCTA } from "@/components/ui/seeMore"; // adjust import casing if needed

export default async function FeaturedProject() {
  const project = await prisma.project.findFirst({
    where: { published: true, publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
    include: { featuredImage: true },
  });

  if (!project) return null;

  return (
    <section className="w-full mx-auto px-4 border-b border-x border-zinc-200 dark:border-zinc-800">
      {/* Section header */}
      <div className="border-x border-zinc-200 dark:border-zinc-800 -mt-px -mb-px">
        <div className="w-full border-y border-y-zinc-200 dark:border-y-zinc-800 py-6 -my-px">
          <h2 className="text-center font-mono text-[10px] tracking-[2px] text-zinc-600 dark:text-zinc-400 uppercase">
            Featured Project
          </h2>
        </div>
      </div>

      {/* Card: text left, image right */}
      <div className="relative group grid grid-cols-1 md:grid-cols-2 gap-0 border-x border-zinc-200 dark:border-zinc-800">
        {/* Stretched link covers entire card */}
        <StretchedLink
          href={`/projects/${project.slug}`}
          ariaLabel={`${project.title} – view project`}
          className="cursor-pointer z-30"
        />

        {/* Left: text */}
        <div
          className="order-1 flex flex-col justify-center p-6 
                     border-x border-b border-zinc-200 dark:border-zinc-800
                     transition-colors duration-200"
        >
          <h3 className="text-[24px] leading-[34px] font-medium group-hover:underline">
            {project.title}
          </h3>

          {project.publishedAt && (
            <div className="mt-2 tracking-wider uppercase text-zinc-500 text-[12px] leading-[18px]">
              <time dateTime={project.publishedAt.toISOString().split("T")[0]}>
                {format(project.publishedAt, "MMMM d, yyyy")}
              </time>
            </div>
          )}

          {/* CTA (arrow animates with group-hover) */}
          <div className="mt-4 z-20">
            <ViewCTA as="span" variant="project" />
          </div>
        </div>

        {/* Right: image */}
        <div className="order-2 w-full h-full overflow-hidden">
          <Image
            src={project.featuredImage?.url || "/images/fallback.jpeg"}
            alt={project.title}
            width={1200}
            height={800}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            priority
          />
        </div>
      </div>
    </section>
  );
}
