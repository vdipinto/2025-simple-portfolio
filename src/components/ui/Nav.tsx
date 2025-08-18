"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Logo from "@/components/ui/Logo";
import { ModeToggle } from "@/components/ui/toggle-mode";
import UserMenu from "@/components/ui/UserMenu";
import MobileNav from "@/components/ui/mobile-nav";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { NavigationMenuListItem } from "@/components/navigation/navigation-menu-list-item";

const services = [
  {
    title: "Sanity Website Development",
    href: "/services/sanity-website-development",
    description:
      "Building fast and flexible websites with Sanity.io as a headless CMS.",
    points: [
      "Custom schemas & content models",
      "Easy-to-use page builder for editors",
      "Shopify integration for eCommerce",
      "Scalable CMS setup",
    ],
  },
  {
    title: "Next.js App Development",
    href: "/services/nextjs-app-development",
    description:
      "Developing scalable fullstack applications using Next.js and modern tooling.",
    points: [
      "Fullstack API routes",
      "SSR & SSG for performance",
      "Optimized for SEO",
      "Incremental Static Regeneration (ISR) for fresh content",
    ],
  },
  {
    title: "WordPress Website Development",
    href: "/services/wordpress-website-development",
    description:
      "Creating custom WordPress websites with modern designs and best practices.",
    points: [
      "Custom themes & plugins",
      "Headless WordPress setups",
      "Performance optimizations",
      "Redis & CDN caching for speed",
    ],
  },
];

const navLinkOverride = "rounded-none px-5 py-2";

export default function Nav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

  return (
    <nav className="relative w-full h-20 flex items-center justify-between">
      {/* Logo */}
      <Logo />

      {/* Desktop Nav */}
      <div className="flex-1 hidden lg:flex justify-center">
        <NavigationMenu>
          <NavigationMenuList className="h-20">
            {/* Services with dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={cn(
                  navigationMenuTriggerStyle(),
                  navLinkOverride,
                  "h-20 leading-none",
                  pathname.startsWith("/services") && "text-primary",
                  "data-[state=open]:text-primary"
                )}
              >
                Services
              </NavigationMenuTrigger>

              {/* Full-width dropdown */}
              <NavigationMenuContent className="w-full px-0 py-8">
                {/* Full-bleed wrapper: spans the entire viewport width */}
                <div className="w-screen relative left-1/2 -translate-x-1/2">
                  <ul
                    className="
                      grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
                      items-stretch auto-rows-fr
                      gap-y-8 lg:gap-x-12 px-6
                    "
                  >
                    {services.map((s) => (
                      <NavigationMenuListItem
                        key={s.title}
                        title={s.title}
                        href={s.href}
                        description={s.description}
                        points={s.points}
                        ctaLabel="View Service"
                      />
                    ))}
                  </ul>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Blog */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/blog"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    navLinkOverride,
                    "h-20 leading-none flex items-center",
                    isActive("/blog") && "text-primary"
                  )}
                >
                  Blog
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Projects */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/projects"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    navLinkOverride,
                    "h-20 leading-none flex items-center",
                    isActive("/projects") && "text-primary"
                  )}
                >
                  Projects
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* About */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/about"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    navLinkOverride,
                    "h-20 leading-none flex items-center",
                    isActive("/about") && "text-primary"
                  )}
                >
                  About
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Right controls */}
      <div className="hidden lg:flex h-full items-center">
        <div className="h-full border-x border-zinc-200 dark:border-zinc-800 flex items-center px-3">
          <Button asChild size="lg" className="bg-cta-gradient text-lg sm:text-xl text-black py-6">
            <Link href="/contact">
              HIRE ME
              <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </div>
        <ModeToggle />
        <UserMenu />
      </div>

      {/* Mobile Nav */}
      <div className="lg:hidden h-full">
        <MobileNav />
      </div>
    </nav>
  );
}
