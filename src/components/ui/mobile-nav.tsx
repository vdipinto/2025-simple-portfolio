"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { ArrowRight } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import OkinawaLogo from "@/components/icons/OkinawaLogo";

// Top-level links (excluding Services which we render as an accordion)
const restLinks = [
  { name: "Blog", href: "/blog" },
  { name: "Case studies", href: "/case-studies" },
  { name: "About", href: "/about" },
];

const services = [
  { title: "Sanity Website Development", href: "/services/sanity-website-development" },
  { title: "Next.js App Development", href: "/services/nextjs-app-development" },
  { title: "WordPress Website Development", href: "/services/wordpress-website-development" },
];

export default function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the drawer when the route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = useCallback(
    (href: string) =>
      href === "/"
        ? pathname === "/"
        : pathname === href || pathname.startsWith(href + "/"),
    [pathname]
  );

  const handleNavigate = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        className="flex items-center justify-center h-full aspect-square border-l border-zinc-200 dark:border-zinc-800"
      >
        {open ? <HiXMark className="text-[48px]" /> : <HiBars3 className="text-[32px]" />}
      </SheetTrigger>

      <SheetContent side="left" className="flex flex-col w-[88vw] max-w-[380px] p-0">
        {/* Header row: logo + custom close button (aligned) */}
        <div className="px-6 pt-8 pb-8 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <Link href="/" onClick={handleNavigate} className="block">
            {/* Adjust h-12 / h-14 if you want it bigger/smaller */}
            <OkinawaLogo className="h-16 w-auto text-foreground" />
          </Link>

          <SheetClose
            aria-label="Close navigation menu"
            className="p-2 -mr-2 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <HiXMark className="text-[48px]" />
            <span className="sr-only">Close</span>
          </SheetClose>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-6">
          <ul className="space-y-1">
            {/* 1) Home */}
            <li>
              <Link
                href="/"
                onClick={handleNavigate}
                className={[
                  "block rounded-md px-4 py-3 text-base font-medium transition-colors",
                  isActive("/")
                    ? "text-primary bg-primary/10 dark:bg-primary/10"
                    : "hover:bg-zinc-100 dark:hover:bg-zinc-900",
                ].join(" ")}
              >
                Home
              </Link>
            </li>

            {/* 2) Services (accordion) */}
            <li>
              <Accordion
                type="single"
                collapsible
                defaultValue={isActive("/services") ? "services" : undefined}
              >
                <AccordionItem value="services" className="border-none">
                  <AccordionTrigger className="rounded-md px-4 py-3 text-base font-medium hover:no-underline hover:bg-zinc-100 dark:hover:bg-zinc-900">
                    Services
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="mt-1 space-y-1">
                      {services.map((s) => (
                        <li key={s.href}>
                          <Link
                            href={s.href}
                            onClick={handleNavigate}
                            className={[
                              "block rounded-md px-4 py-3 text-sm transition-colors",
                              isActive(s.href)
                                ? "text-primary bg-primary/10 dark:bg-primary/10"
                                : "text-foreground/80 hover:bg-zinc-100 dark:hover:bg-zinc-900",
                            ].join(" ")}
                          >
                            {s.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </li>

            {/* 3) The rest (Blog, Projects, About) */}
            {restLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={handleNavigate}
                  className={[
                    "block rounded-md px-4 py-3 text-base font-medium transition-colors",
                    isActive(l.href)
                      ? "text-primary bg-primary/10 dark:bg-primary/10"
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-900",
                  ].join(" ")}
                >
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer actions */}
        <div className="px-6 pb-8 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <Button asChild size="lg" className="w-full justify-center gap-2">
            <Link href="/contact" onClick={handleNavigate}>
              HIRE ME
              <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
