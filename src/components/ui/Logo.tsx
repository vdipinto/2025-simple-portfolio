"use client";

import Link from "next/link";
import LogoIcon from "@/components/icons/LogoIcon";

const Logo = () => {
  return (
    <div className="w-[200px] sm:w-[240px] md:w-[280px] lg:w-[320px] flex items-center justify-center border-e border-zinc-200 dark:border-zinc-800 h-full">
      <Link
        href="/"
        className="h-full flex items-center justify-center px-1 sm:px-4 transition-colors hover:bg-primary/5"
      >
        <LogoIcon />
      </Link>
    </div>
  );
};

export default Logo;
