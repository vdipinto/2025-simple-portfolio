"use client";

import Link from "next/link";
import clsx from "clsx";

type Props = {
  href?: string;
  /** Preset type or any custom string */
  variant?: string;
  /** If provided, overrides the variant text entirely */
  label?: string;
  className?: string;
  ariaLabel?: string;

  /**
   * Render mode:
   * - "a"    => interactive link (default)
   * - "span" => non-interactive (for use inside stretched-link cards to avoid nested <a>)
   */
  as?: "a" | "span";
};

const VARIANT_TO_LABEL: Record<string, string> = {
  tech: "View Tech",
  service: "View Service",
  more: "View More",
};

export function ViewCTA({
  href = "#",
  variant = "more",
  label,
  className,
  ariaLabel,
  as = "a",
}: Props) {
  const text =
    label ??
    VARIANT_TO_LABEL[variant] ??
    (variant ? `View ${variant[0].toUpperCase()}${variant.slice(1)}` : "View More");

  const computedAria = ariaLabel ?? text;

  const baseClasses = clsx(
    "inline-flex items-center text-sm",
    "text-zinc-600 dark:text-zinc-300",
    "transition-colors",
    "hover:text-zinc-700 dark:hover:text-zinc-200",
    // also respond when the parent card has .group and is hovered
    "group-hover:text-zinc-700 dark:group-hover:text-zinc-200",
    className
  );

  const pill = (
    <span
      className={clsx(
        "ml-2 inline-flex size-[30px] items-center justify-center rounded-full",
        "bg-zinc-100 dark:bg-zinc-900",
        "border border-zinc-200 dark:border-zinc-700",
        "transition-all duration-200",
        // change border on self hover and parent group hover
        "hover:border-zinc-300 dark:hover:border-zinc-600",
        "group-hover:border-zinc-300 dark:group-hover:border-zinc-600"
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className={clsx(
          "size-4",
          "text-zinc-500 dark:text-zinc-400",
          "transition-all duration-200",
          // rotate/mutate on self hover ...
          "hover:text-zinc-700 dark:hover:text-zinc-200 hover:rotate-45",
          // ... and on parent card hover (when CTA is a <span>)
          "group-hover:text-zinc-700 dark:group-hover:text-zinc-200 group-hover:rotate-45"
        )}
        aria-hidden="true"
      >
        <path d="M7 17L17 7" />
        <path d="M7 7h10v10" />
      </svg>
    </span>
  );

  if (as === "span") {
    // Non-interactive: won't create a nested <a> inside stretched-link cards
    return (
      <span className={clsx(baseClasses, "pointer-events-none")} aria-label={computedAria}>
        <span>{text}</span>
        {pill}
      </span>
    );
  }

  // Interactive link version
  return (
    <Link href={href} className={baseClasses} aria-label={computedAria}>
      <span>{text}</span>
      {pill}
    </Link>
  );
}

export default ViewCTA;
