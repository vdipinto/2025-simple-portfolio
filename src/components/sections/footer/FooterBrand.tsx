// src/components/sections/footer/FooterBrand.tsx
import Link from "next/link";

const brandLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export default function FooterBrand() {
  return (
    <div>
      <h2 className="font-mono font-medium text-xs tracking-[2px] text-black dark:text-zinc-400 uppercase mb-2">
        Vito Dipinto
      </h2>
      <ul className="space-y-1">
        {brandLinks.map(({ href, label }) => (
          <li key={label}>
            <Link
              href={href}
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:underline hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
