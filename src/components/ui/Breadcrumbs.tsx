import Link from "next/link";

interface Breadcrumb {
  label: string;
  href: string;
  active?: boolean;
}

// Helper to format slugs nicely
const formatSlug = (slug: string) => {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export function Breadcrumbs({ breadcrumbs }: { breadcrumbs: Breadcrumb[] }) {
  if (!breadcrumbs || breadcrumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-background px-6 py-4">
      <ol className="flex flex-wrap clsx items-center text-sm md:text-base text-muted-foreground dark:text-muted-foreground">
        {breadcrumbs.map((breadcrumb, index) => (
          <li
            key={breadcrumb.href}
            aria-current={breadcrumb.active ? "page" : undefined}
            className="flex items-center"
          >
            {breadcrumb.active ? (
              <span className="font-semibold text-foreground">{formatSlug(breadcrumb.label)}</span>
            ) : (
              <Link
                href={breadcrumb.href}
                className="hover:text-primary transition-colors"
              >
                {formatSlug(breadcrumb.label)}
              </Link>
            )}
            {index < breadcrumbs.length - 1 && (
              <span className="mx-2 text-muted-foreground">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
