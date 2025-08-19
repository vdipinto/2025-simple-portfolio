// src/components/ui/Logo.tsx  (server component — no "use client")
import Link from "next/link";
import OkinawaLogo from "@/components/icons/OkinawaLogo";

export default function Logo() {
  return (
    <Link
      href="/"
      prefetch={false}                 // avoids prefetching the home route
      aria-label="Go to homepage"
      className="h-full inline-flex items-center border-e border-zinc-200 dark:border-zinc-800 px-1 sm:px-4"
    >
      <OkinawaLogo className="h-20 w-auto text-black dark:text-white" />
    </Link>
  );
}