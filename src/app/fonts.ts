import { Space_Grotesk, Public_Sans } from "next/font/google";

// Headings (used in hero/H1) — preload this one
export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],            // no latin-ext unless you actually need it
  weight: ["400", "700"],        // the weight you use for headings (adjust if needed)
  display: "optional",           // fastest paint: fallback shows immediately, may skip swap if late
  preload: true,                 // only the LCP font should be preloaded
  variable: "--font-space-grotesk",
  adjustFontFallback: true,
});

// Body UI — do NOT preload
export const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],        // keep this tight (add "600" only if you truly use it)
  display: "swap",
  preload: false,                // let it load after paint
  variable: "--font-public-sans",
  adjustFontFallback: true,
});