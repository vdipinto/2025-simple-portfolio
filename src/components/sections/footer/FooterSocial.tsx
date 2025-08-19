// src/components/sections/footer/FooterSocial.tsx
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // 👈 the new “X” icon

const socialLinks = [
  { href: "https://twitter.com", label: "X", icon: FaXTwitter },
  { href: "https://instagram.com", label: "Instagram", icon: FaInstagram },
  { href: "https://linkedin.com", label: "LinkedIn", icon: FaLinkedin },
];

export default function FooterSocial() {
  return (
    <div>
      <h2 className="font-mono font-medium text-xs tracking-[2px] text-black dark:text-zinc-400 uppercase mb-2">
        Social
      </h2>

      <ul className="space-y-1">
        {socialLinks.map(({ href, label, icon: Icon }) => (
          <li key={label}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:underline hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <Icon className="w-4 h-4" />
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}