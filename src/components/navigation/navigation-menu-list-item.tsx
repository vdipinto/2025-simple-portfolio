"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

type Props = {
  title: string;
  href: string;
  description?: React.ReactNode;
  points?: string[];
  ctaHref?: string;
  ctaLabel?: string;
  className?: string;
};

export function NavigationMenuListItem({
  title,
  href,
  description,
  points,
  ctaHref,
  ctaLabel = "View Service",
  className,
}: Props) {
  const finalCtaHref = ctaHref ?? href;

  return (
    <li className={cn("h-full", className)}>
      {/* Single bordered card filling the grid cell */}
      <div
        className={cn(
          "h-full min-h-[260px] rounded-lg border border-zinc-200 dark:border-zinc-800 p-4",
          "hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors",
          "flex flex-col"
        )}
      >
        {/* Title + description (no inner link wrapper box) */}
        <div>
          <Link
            href={href}
            className="font-medium text-base text-foreground hover:underline"
          >
            {title}
          </Link>
          {description ? (
            <p className="mt-1 text-sm leading-snug text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>

        {/* Bullets */}
        {points?.length ? (
          <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground space-y-1">
            {points.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        ) : null}

        {/* CTA pinned to bottom */}
        {finalCtaHref ? (
          <div className="mt-auto pt-4">
            <Button
              size="default"
              asChild
              className="bg-cta-gradient text-lg sm:text-base text-black"
            >
              <Link href={finalCtaHref}>
                {ctaLabel} <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        ) : null}
      </div>
    </li>
  );
}
