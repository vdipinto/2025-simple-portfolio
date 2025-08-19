// src/components/sections/footer/FooterServices.tsx

import Link from "next/link";

const services = [
    { name: "Sanity Website Development", href: "/services/sanity-website-development" },
    { name: "Next.js App Development", href: "/services/nextjs-app-development" },
    { name: "WordPress Website Development", href: "/services/wordpress-website-development" },
];

export default function FooterServices() {
    return (
        <div>
            <h2 className="font-mono font-medium text-xs tracking-[2px] text-black dark:text-zinc-400 uppercase mb-2">
                Services
            </h2>
            <ul className="space-y-1">
                {services.map((service) => (
                    <li key={service.href}>
                        <Link
                            href={service.href}
                            prefetch={false}   // 👈 stops auto-fetching route bundles
                            className="text-sm text-zinc-600 dark:text-zinc-400 hover:underline hover:text-zinc-900 dark:hover:text-white transition-colors"
                          >
                            {service.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
