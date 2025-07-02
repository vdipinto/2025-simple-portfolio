import { FaGithub } from "react-icons/fa";
import { RiRssLine } from "react-icons/ri";
import Link from "next/link";

const extras = [
  {
    href: "https://github.com/vdipinto/",
    label: "GitHub",
    icon: FaGithub,
  },
  {
    href: "/rss.xml",
    label: "RSS",
    icon: RiRssLine,
  },
];

export default function FooterExtras() {
  return (
    <section className="w-full mx-auto px-4 border-b border-x border-zinc-200 dark:border-zinc-800">
      <div className="border-x border-zinc-200 dark:border-zinc-800 relative -mt-px -mb-px">
        <div className="w-full border-y border-y-zinc-200 dark:border-y-zinc-800 py-6 -my-px px-4">
          <ul className="space-y-1">
            {extras.map(({ href, label, icon: Icon }) => (
              <li key={label}>
                <Link
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span className="group-hover:underline underline-offset-2 decoration-zinc-400 dark:decoration-zinc-500">
                    {label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
