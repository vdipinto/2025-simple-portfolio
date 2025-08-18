"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cn } from "@/lib/utils";

/* Root — NO 'relative' here so the viewport anchors to the outer wrapper */
const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn("z-10 flex max-w-max flex-1 items-center justify-center", className)}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
));
NavigationMenu.displayName = "NavigationMenu";

/* List */
const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn("group flex flex-1 list-none items-center justify-center space-x-1", className)}
    {...props}
  />
));
NavigationMenuList.displayName = "NavigationMenuList";

/* Item passthrough */
const NavigationMenuItem = NavigationMenuPrimitive.Item;

/* Trigger */
export const navigationMenuTriggerStyle = (...classes: (string | false | undefined)[]) =>
  cn(
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "bg-background hover:bg-accent hover:text-accent-foreground",
    "h-10 px-4 py-2",
    classes.filter(Boolean).join(" ")
  );

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), "group", className)}
    {...props}
  >
    {children}
    <ChevronDown
      className={cn("ml-1 h-4 w-4 transition-transform duration-100 ease-out",
        "group-data-[state=open]:rotate-180")}
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = "NavigationMenuTrigger";

/* Content — your grid stays in Nav.tsx */
const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      "w-full min-h-[var(--menu-h)] px-6 py-8",
      "motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out",
      "duration-100 ease-out",
      className
    )}
    {...props}
  >
    {children}
  </NavigationMenuPrimitive.Content>
));
NavigationMenuContent.displayName = "NavigationMenuContent";

/* Link passthrough */
const NavigationMenuLink = NavigationMenuPrimitive.Link;

/* Viewport — ABSOLUTE to the outer wrapper, full-bleed and centered */
const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div
    className={cn(
      "[--menu-h:390px]",
      "absolute inset-x-0 top-full z-[60] w-full"
    )}
  >
    <NavigationMenuPrimitive.Viewport
      ref={ref}
      className={cn(
        "w-full h-[var(--menu-h)] overflow-hidden",
        "border-t bg-popover text-popover-foreground shadow-lg",
        "rounded-none",
        "motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out duration-100 ease-out",
        className
      )}
      {...props}
    />
  </div>
));
NavigationMenuViewport.displayName = "NavigationMenuViewport";

/* Indicator (optional) */
const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      "top-full z-10 flex h-1.5 items-end justify-center overflow-hidden",
      "motion-safe:data-[state=visible]:animate-in motion-safe:data-[state=hidden]:animate-out",
      className
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 bg-border" />
  </NavigationMenuPrimitive.Indicator>
));
NavigationMenuIndicator.displayName = "NavigationMenuIndicator";

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
};
