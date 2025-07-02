import FooterSocial from "./FooterSocial";
import FooterBrand from "./FooterBrand";
import FooterServices from "./FooterServices";
import FooterExtras from "./FooterExtras";

export default function Footer() {
  return (
    <footer>
      <div className="w-full mx-auto px-4 border border-zinc-200 dark:border-zinc-800">
        <div className="border-x border-zinc-200 dark:border-zinc-800 px-4 py-8 text-sm text-zinc-600 dark:text-zinc-400">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <FooterBrand />
            <FooterServices />
            <FooterSocial />
          </div>
        </div>
      </div>
      <FooterExtras />
      {/* Centered Footer Notice */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 py-6 text-center text-xs text-zinc-600 dark:text-zinc-400">
          <p className="font-mono tracking-wide uppercase">VITO DIPINTO</p>
          <p>© 2025 All Rights Reserved.</p>
        </div>
    </footer>
  );
}
