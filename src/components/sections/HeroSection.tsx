// app/components/HeroSection.tsx  (server component – no "use client")
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-background text-foreground h-[80vh]">
      {/* GRID overlay */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid" />

      {/* Soft bokeh blobs — hidden on small to reduce paint work */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 hidden md:block md:blur-3xl">
        <span className="absolute left-1/3 top-16 h-48 w-48 rounded-full bg-pink-500/25" />
        <span className="absolute right-1/4 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-sky-500/20" />
        <span className="absolute bottom-10 left-1/4 h-40 w-40 rounded-full bg-orange-400/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-28 sm:py-36 lg:py-44 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
          <span className="bg-gradient-to-r from-pink-500 via-orange-400 to-sky-400 bg-clip-text text-transparent">
            Vito Dipinto
          </span>{" - "}
          Web Developer
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground">
          Front-end developer who loves crafting beautiful web experiences — I’m open to new opportunities and enjoy sharing what I learn on my blog.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {/* View Work (internal route) – no prefetch to avoid pulling that page's JS at TTI */}
          <Link
            href="/case-studies"
            prefetch={false}
            className="inline-flex items-center gap-2 rounded-2xl bg-cta-gradient px-5 py-3 text-black text-lg sm:text-xl shadow-sm transition-transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-offset-2"
            aria-label="View work (case studies)"
          >
            View Work
            {/* tiny inline SVG instead of lucide-react import */}
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4">
              <path d="M5 12h12m0 0-5-5m5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>

          {/* See My CV (external link uses <a>, not next/link) */}
          <a
            href="/Vito-Dipinto.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-lg sm:text-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
            aria-label="Open CV in a new tab (PDF)"
          >
            See My CV
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4">
              <path d="M5 12h12m0 0-5-5m5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
