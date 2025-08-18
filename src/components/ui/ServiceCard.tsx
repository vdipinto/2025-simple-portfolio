"use client";

import StretchedLink from "@/components/ui/StretchedLink";
import { ViewCTA } from "@/components/ui/seeMore";

type Props = {
  title: string;
  description?: string;
  href?: string;
  number?: number;
  /** Flexible CTA variant, e.g. "tech" | "service" | "more" | "pricing" | ... */
  ctaVariant?: string;
  /** If provided, overrides the variant text entirely */
  ctaLabel?: string;
};

export default function ServiceCard({
  title,
  description = "",
  href,
  number,
  ctaVariant = "more",
  ctaLabel,
}: Props) {
  const numberLabel =
    typeof number === "number" ? `${String(number).padStart(2, "0")}.` : null;

  return (
    <div
      className={[
        "group relative overflow-hidden",
        "rounded-[24px]",
        number === 2 ? "bg-cta-gradient" : "bg-transparent",
        "border border-black/10 dark:border-white/10",
        "shadow-sm",
        "h-[400px]",
      ].join(" ")}
      aria-label={`${title} – ${description}`}
    >
      {/* Stretched link makes whole card clickable */}
      {href && (
        <StretchedLink
          href={href}
          ariaLabel={`${title} – read more`}
          className="cursor-pointer"
        />
      )}

      {/* Large background number */}
      {numberLabel && (
        <div
          className="pointer-events-none select-none absolute left-4 z-0
                     text-[200px] leading-none font-semibold
                     text-black/10 dark:text-white/10"
          aria-hidden="true"
        >
          {numberLabel}
        </div>
      )}

      {/* Content */}
      <div className="absolute inset-0 p-6 sm:p-8 flex items-end z-20">
        <div>
          <h3 className="text-xl sm:text-2xl font-medium tracking-tight 
                         text-black/90 dark:text-white group-hover:underline">
            {title}
          </h3>

          {description && (
            <p className="mt-2 max-w-[46ch] text-sm sm:text-base 
                          text-black/70 dark:text-zinc-300">
              {description}
            </p>
          )}

          {/* CTA (arrow animates on card hover) */}
          <div className="mt-4">
            <ViewCTA as="span" variant={ctaVariant} label={ctaLabel} />
          </div>
        </div>
      </div>
    </div>
  );
}
