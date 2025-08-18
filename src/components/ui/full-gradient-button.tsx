// src/components/ui/full-gradient-button.tsx
"use client";

import Link from "next/link";
import clsx from "clsx";

type Size = "sm" | "md" | "lg" | "xl";

interface FullGradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  external?: boolean;
  size?: Size;
  fullWidth?: boolean;
}

const sizeClasses: Record<Size, string> = {
  sm: "h-10 px-4 text-base",
  md: "h-12 px-6 text-lg",
  lg: "h-14 px-8 text-xl",
  xl: "h-16 px-10 text-2xl min-w-[220px]",
};

const baseClasses = [
  "relative inline-flex items-center justify-center font-bold",
  "rounded-md overflow-hidden",

  // 🌈 centralized gradient (always same colors)
  "bg-cta-gradient",

  // subtle shadow
  "shadow-[0_4px_12px_rgba(0,0,0,0.08)]",

  // text + interactions
  "text-zinc-900",
  "hover:shadow-[0_6px_18px_rgba(0,0,0,0.12)]",
  "transition-all duration-200",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  "disabled:opacity-50 disabled:pointer-events-none",
];

export default function FullGradientButton({
  className,
  href,
  external = false,
  size = "xl",
  fullWidth = false,
  children,
  ...props
}: FullGradientButtonProps) {
  const classes = clsx(
    baseClasses,
    sizeClasses[size],
    fullWidth && "w-full",
    className
  );

  if (href) {
    return (
      <Link
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={classes}
      >
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
