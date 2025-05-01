"use client";

import { useEffect, useState, useRef } from "react";
import { FeatureCard, FeatureCardProps } from "@/components/feature-cards/FeatureCard"; // ✅ fixed
import { NextJsLogoIcon } from "@/components/icons/NextJsLogoIcon";
import { SanityIcon } from "@/components/icons/SanityIcon";
import { WordPressIcon } from "@/components/icons/WordPressIcon";
import { PrismaIcon } from "@/components/icons/PrismaIcon";

const featureCards: FeatureCardProps[] = [
    {
        title: "Sanity CMS",
        description: "Flexible and powerful content platform for modern websites.",
        Icon: SanityIcon,
        href: "/services/sanity",
        iconSizeClass: "w-40 h-40", // 👈 You can add this
    },
    {
        title: "WordPress",
        description: "Most popular CMS for building websites.",
        Icon: WordPressIcon,
        href: "/services/wordpress",
        iconSizeClass: "w-40 h-40", // 👈 Maybe smaller for WordPress
    },
    {
        title: "Next.js",
        description: "React framework for production websites and apps.",
        Icon: NextJsLogoIcon,
        href: "/services/nextjs",
        iconSizeClass: "w-62 h-62", // 👈 Bigger if you want
    },
    {
        title: "Prisma.io",
        description: `I use Prisma to connect modern applications to databases in a way that’s fast, reliable, and flexible.
      Prisma's type-safe ORM helps me build powerful backends quickly, ensuring better performance, fewer errors, and a smoother development process.
      Combined with tools like Next.js and Sanity, it helps me deliver dynamic, scalable platforms built to grow with your business.`,
        Icon: PrismaIcon,
        href: "/services/prisma",
        iconSizeClass: "w-62 h-62",
    },
];


export default function FeatureCardsIcon() {
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
                        <h2 className="text-center font-mono text-[10px] tracking-[2px] text-zinc-600 dark:text-zinc-400 uppercase">Technologies I Work With</h2>
                    </div>
                </div>
            </section>
            <section className="w-full mx-auto px-4 border-t border-b border-x border-zinc-200 dark:border-zinc-800">
                <div className="border-x border-zinc-200 dark:border-zinc-800 relative grid grid-cols-1 lg:grid-cols-[1fr_2fr]">
                    {/* Left */}
                    <div className="lg:border-r lg:border-b-0 border-b border-zinc-200 dark:border-zinc-800 overflow-hidden">
                        <div className="p-4 py-8 md:p-8">
                            <div className="prose prose-slate dark:prose-invert text-base md:text-lg max-w-3xl">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                        {featureCards.map((card, index) => (
                            <FeatureCard
                                key={index}
                                title={card.title}
                                description={card.description}
                                href={card.href}
                                Icon={card.Icon}
                                iconSizeClass={card.iconSizeClass} // ✅ important
                            />
                        ))}
                    </div>
                </div>
            </section>
        </>

    );
}
