// src/components/sections/ServiceCards.tsx  ← server component (no "use client")
import ServiceCard from "@/components/ui/ServiceCard";

type ServiceCardItem = {
  title: string;
  description: string;
  href: string;
};

const serviceCards: ServiceCardItem[] = [
  { title: "Sanity CMS",  description: "Flexible and powerful content platform for modern websites.", href: "/services/sanity-website-development" },
  { title: "WordPress",   description: "Most popular CMS for building websites.",                     href: "/services/wordpress-website-development" },
  { title: "Next.js",     description: "React framework for production websites and apps.",           href: "/services/nextjs-app-development" },
  { title: "Prisma.io",   description: "Type-safe DB access that’s fast, reliable, and flexible.",    href: "/services/prisma-connect-moderns-applications-to-databases" },
];

export default function ServiceCards() {
  return (
    <>
      <section className="w-full mx-auto px-4 border-t border-b border-x border-zinc-200 dark:border-zinc-800">
        <div className="border-x border-zinc-200 dark:border-zinc-800 relative -mt-px -mb-px">
          <div className="w-full border-y border-y-zinc-200 dark:border-y-zinc-800 py-6 -my-px">
            <h2 className="text-center font-mono text-[10px] tracking-[2px] text-zinc-600 dark:text-zinc-400 uppercase">
              Technologies I Work With
            </h2>
          </div>
        </div>
      </section>

      <section className="w-full mx-auto px-4 border-t border-b border-x border-zinc-200 dark:border-zinc-800">
        <div className="border-x border-zinc-200 dark:border-zinc-800 relative grid grid-cols-1 lg:grid-cols-[1fr_2fr]">
          {/* Left */}
          <div className="lg:border-r lg:border-b-0 border-b border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="p-4 py-8 md:p-8">
              <div className="prose prose-slate dark:prose-invert text-base md:text-lg max-w-3xl">
                <h2 className="text-[25px] tracking-[2px] uppercase">Powering Every Project</h2>
                <p>I build using a carefully selected stack of headless CMSs, frameworks, and tools that I trust and use every day.</p>
                <p>Sanity, WordPress, Next.js, and Prisma allow me to create websites and applications that are fast, flexible, and easy to manage.</p>
                <p>These technologies have helped me scale projects, deliver smooth editorial experiences, and build platforms ready to grow with your business.</p>
              </div>
            </div>

            {/* Decorative lines — CSS only, no JS */}
            <div
              aria-hidden
              className="h-full min-h-[300px] relative"
            >
              <div
                className="
                  absolute inset-0 pointer-events-none
                  [background-image:repeating-linear-gradient(to_bottom,var(--line-color)_0_1px,transparent_1px_12px)]
                  [--line-color:theme(colors.zinc.200)]
                  dark:[--line-color:theme(colors.zinc.800)]
                "
              />
            </div>
          </div>

          {/* Right: Service cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 [content-visibility:auto] [contain-intrinsic-size:800px]">
            {serviceCards.map((card, idx) => (
              <ServiceCard
                key={card.href}
                number={idx + 1}
                title={card.title}
                description={card.description}
                href={card.href}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
