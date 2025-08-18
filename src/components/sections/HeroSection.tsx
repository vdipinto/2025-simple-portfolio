"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative isolate overflow-hidden bg-background text-foreground h-[80vh]">
      {/* GRID overlay (auto light/dark aware) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid"
      />

      {/* Soft bokeh blobs */}
      <div aria-hidden="true" className="absolute inset-0 blur-3xl">
        <span className="absolute left-1/3 top-16 h-48 w-48 rounded-full bg-pink-500/25" />
        <span className="absolute right-1/4 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-sky-500/20" />
        <span className="absolute bottom-10 left-1/4 h-40 w-40 rounded-full bg-orange-400/20" />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-5xl px-6 py-28 sm:py-36 lg:py-44">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-pink-500 via-orange-400 to-sky-400 bg-clip-text text-transparent">
              Vito Dipinto
            </span>{" - "}
            Web Developer
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground">
            Front-end developer who loves crafting beautiful web experiences
            — I’m open to new opportunities and enjoy sharing what I learn on my blog.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {/* View Work (internal route) */}
            <Button
              size="lg"
              asChild
              className="bg-cta-gradient text-lg sm:text-xl text-black py-6"
            >
              <Link href="/projects">
                View Work <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>

            {/* See My CV (open PDF in new tab) */}
            <Button size="lg" asChild className="py-6 text-lg sm:text-xl">
              <a
                href="/Vito-Dipinto.pdf"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open CV in a new tab (PDF)"
              >
                See My CV <ArrowRight className="ml-2 size-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
