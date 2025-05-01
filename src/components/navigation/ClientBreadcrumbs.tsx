"use client";

import { usePathname } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export default function ClientBreadcrumbs() {
  const pathname = usePathname(); // Example: "/blog" or "/blog/my-post"

  // Don't show breadcrumbs on the homepage
  if (pathname === "/") {
    return null;
  }

  // Split pathname into parts: "/blog/my-post" -> ["blog", "my-post"]
  const pathnames = pathname.split("/").filter(Boolean);

  const breadcrumbs = [
    { label: "Home", href: "/", active: pathnames.length === 0 },
    ...pathnames.map((segment, index) => ({
      label: formatSegment(segment),
      href: "/" + pathnames.slice(0, index + 1).join("/"),
      active: index === pathnames.length - 1, // Last segment is active
    })),
  ];

  return <Breadcrumbs breadcrumbs={breadcrumbs} />;
}

// Optional: Helper function to format segment nicely
function formatSegment(segment: string) {
  return segment
    .replace(/-/g, " ")         // replace hyphens with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // capitalize first letter
}
