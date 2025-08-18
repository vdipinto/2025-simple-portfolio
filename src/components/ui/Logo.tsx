"use client";

import Link from "next/link";
import OkinawaLogo from "@/components/icons/OkinawaLogo";

const Logo = () => {
  return (
    <Link
      href="/"
      className="h-full inline-flex items-center border-e border-zinc-200 dark:border-zinc-800 px-1 sm:px-4"
    >
      <OkinawaLogo className="h-20 w-auto text-black dark:text-white" />
    </Link>
  );
};

export default Logo;
