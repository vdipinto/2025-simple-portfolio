"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Logo from "@/components/ui/Logo";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./toggle-mode";
import UserMenu from "@/components/ui/UserMenu";
import MobileNav from "@/components/ui/mobile-nav"
import { ArrowRightCircleIcon } from "@heroicons/react/24/solid";

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
    description: "Building fast and flexible websites with Sanity.io as a headless CMS.",
  },
  {
    title: "Next.js App Development",
    href: "/services/nextjs-app-development",
    description: "Developing scalable fullstack applications using Next.js and modern tooling.",
  },
  {
    title: "WordPress Website Development",
    href: "/services/wordpress-website-development",
    description: "Creating custom WordPress websites with modern designs and best practices.",
  },
];

const Nav = () => {
  const pathname = usePathname();

  return (
    <nav className="relative w-full h-full flex items-center justify-between">
      {/* Logo */}
      <Logo />

      {/* Wrapper div for NavigationMenu */}
      <div className="flex-1 flex justify-center hidden lg:flex">
        <NavigationMenu>
          <NavigationMenuList>

            {/* Services with Submenu */}
            <NavigationMenuItem asChild>
              <li className="flex h-16">
                <NavigationMenuTrigger
                  className={cn(
                    "h-full flex items-center justify-center",
                    pathname.startsWith("/services") && "text-primary"
                  )}
                >
                  Services
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[300px] gap-3 p-4">
                    {services.map((service) => (
                      <NavigationMenuListItem
                        key={service.title}
                        title={service.title}
                        href={service.href}
                      >
                        {service.description}
                      </NavigationMenuListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </li>
            </NavigationMenuItem>

            {/* Blog - No submenu */}
            <NavigationMenuItem asChild>
              <li className="flex h-16">
                <Link href="/blog" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "h-full flex items-center justify-center",
                      pathname === "/blog" && "text-primary"
                    )}
                  >
                    Blog
                  </NavigationMenuLink>
                </Link>
              </li>
            </NavigationMenuItem>

            {/* About - No submenu */}
            <NavigationMenuItem asChild>
              <li className="flex h-16">
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "h-full flex items-center justify-center",
                      pathname === "/about" && "text-primary"
                    )}
                  >
                    About
                  </NavigationMenuLink>
                </Link>
              </li>
            </NavigationMenuItem>

          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="flex h-full items-center hidden lg:flex">


        <Link href="/contact" className="h-full border-x border-zinc-200 dark:border-zinc-800">
          <Button
            asChild
            variant="ghost"
            className="h-full min-w-[220px] bg-transparent rounded-none text-2xl font-bold gap-2 [&_svg]:size-7"
          >
            <span className="flex items-center justify-center gap-2">
              Hire me
              <ArrowRightCircleIcon />
            </span>
          </Button>
        </Link>

        <ModeToggle />
        <UserMenu />
      </div>

      {/* Mobile Nav */}
      <div className="h-full lg:hidden">
        <MobileNav />
      </div>

    </nav>
  );
};

export default Nav;
