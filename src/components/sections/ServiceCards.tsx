// src/components/sections/FeatureCardsIcon.tsx (you can keep the filename or rename the file too)
"use client";

import { useEffect, useState, useRef } from "react";
import ServiceCard from "@/components/ui/ServiceCard";

type ServiceCardItem = {
  title: string;
  description: string;
  href: string;
};

const serviceCards: ServiceCardItem[] = [
  {
    title: "Sanity CMS",
    description: "Flexible and powerful content platform for modern websites.",
    href: "/services/sanity",
  },
  {
    title: "WordPress",
    description: "Most popular CMS for building websites.",
    href: "/services/wordpress",
  },
  {
    title: "Next.js",
    description: "React framework for production websites and apps.",
    href: "/services/nextjs",
  },
  {
    title: "Prisma.io",
    description:
      "I use Prisma to connect modern applications to databases in a way that’s fast, reliable, and flexible.",
    href: "/services/prisma",
  },
];

export default function ServiceCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<number[]>([]);

  useEffect(() => {
    const updateLines = () => {
      if (!containerRef.current) return;
      const containerHeight = containerRef.current.offsetHeight;
      const numberOfLines = 40;
      const newPositions: number[] = [];

      for (let i = 0; i < numberOfLines; i++) {
        const t = i / (numberOfLines - 1);
        const eased = t * t;
        const pos = eased * containerHeight;
        newPositions.push(pos);
      }
      setPositions(newPositions);
    };

    updateLines();
    window.addEventListener("resize", updateLines);
    return () => window.removeEventListener("resize", updateLines);
  }, []);

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
                <p>
                  I build using a carefully selected stack of headless CMSs, frameworks, and tools that I trust and use every day.
                </p>
                <p>
                  Sanity, WordPress, Next.js, and Prisma allow me to create websites and applications that are fast, flexible, and easy to manage.
                </p>
                <p>
                  These technologies have helped me scale projects, deliver smooth editorial experiences, and build platforms ready to grow with your business.
                </p>
              </div>
            </div>

            <div className="h-full relative overflow-hidden min-h-[300px]" ref={containerRef}>
              <div className="absolute inset-0 pointer-events-none z-[1]">
                {positions.map((pos, index) => (
                  <div
                    key={index}
                    className="absolute left-0 right-0 h-px bg-zinc-200 dark:bg-zinc-800 opacity-100"
                    style={{ transform: `translateY(${pos}px) translateY(-50%)` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Service cards (replaces FeatureCard grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
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
