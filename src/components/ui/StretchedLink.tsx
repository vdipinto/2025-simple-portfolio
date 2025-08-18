// src/components/ui/StretchedLink.tsx
"use client";

import Link from "next/link";

type Props = {
  href: string;
  ariaLabel: string;
  className?: string;
};

/**
 * A "stretched link" that covers its parent container.
 * Place it inside a `relative group` parent to make the whole card clickable.
 */
export default function StretchedLink({ href, ariaLabel, className }: Props) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={`absolute inset-0 z-30 cursor-pointer ${className ?? ""}`}
    />
  );
}
