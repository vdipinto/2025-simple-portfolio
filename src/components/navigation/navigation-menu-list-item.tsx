"use client";

import * as React from "react";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

interface NavigationMenuListItemProps
  extends React.ComponentPropsWithoutRef<"a"> {
  title: string;
}

const NavigationMenuListItem = React.forwardRef<HTMLAnchorElement, NavigationMenuListItemProps>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
NavigationMenuListItem.displayName = "NavigationMenuListItem";

export { NavigationMenuListItem };
