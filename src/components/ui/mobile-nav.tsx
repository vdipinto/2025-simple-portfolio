"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiBars3 } from "react-icons/hi2";

const links = [
  { name: "home", href: "/" },
  { name: "services", href: "/services" },
  { name: "resume", href: "/resume" },
  { name: "work", href: "/work" },
  { name: "contact", href: "/contact" },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger className="flex items-center justify-center h-full aspect-square border-l border-zinc-200 dark:border-zinc-800">
        <HiBars3 className="text-[32px]" />
      </SheetTrigger>

      <SheetContent side="left" className="flex flex-col">
        {/* Logo */}
        <div className="mt-32 mb-40 text-center text-2xl">
          <Link href="/" onClick={() => console.log("navigate")}>
            <h1 className="text-4xl font-semibold">
              Vito<span className="text-primary">.</span>
            </h1>
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col items-center justify-center gap-8">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`uppercase font-medium transition-all ${
                  isActive
                    ? "text-primary border-b-2 border-primary dark:text-primary dark:border-primary"
                    : "hover:text-primary dark:hover:text-primary"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
