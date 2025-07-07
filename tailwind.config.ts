// tailwind.config.ts
import { withUt } from "uploadthing/tw";
import type { Config } from "tailwindcss";


/**
 * Tailwind configuration
 *
 *  • withUt() → keeps UploadThing’s preset
 *  • plugin() → lets us add strongly-typed custom utilities/components
 */
const config: Config = withUt({
  darkMode: ["class"],

  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@uploadthing/react/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      /* ───────────────────────────  Colours  ─────────────────────────── */
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },

      /* ───────────────────────────  Radii  ─────────────────────────── */
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      /* ─────────────────────────  Typography  ──────────────────────── */
      typography: (theme: (path: string) => string) => ({
        /**
         * Adds `.prose-invert` styles that look good in dark mode
         * and use 90 % opacity on paragraphs.
         */
        invert: {
          css: {
            '--tw-prose-body': theme('colors.zinc.100'),
            '--tw-prose-headings': theme('colors.zinc.100'),
            '--tw-prose-lead': theme('colors.zinc.300'),
            '--tw-prose-links': theme('colors.zinc.100'),
            '--tw-prose-bold': theme('colors.zinc.100'),
            '--tw-prose-counters': theme('colors.zinc.300'),
            '--tw-prose-bullets': theme('colors.zinc.300'),
            '--tw-prose-hr': theme('colors.zinc.700'),
            '--tw-prose-quotes': theme('colors.zinc.100'),
            '--tw-prose-quote-borders': theme('colors.zinc.700'),
            '--tw-prose-captions': theme('colors.zinc.500'),
            '--tw-prose-code': theme('colors.zinc.100'),
            '--tw-prose-pre-code': theme('colors.zinc.100'),
            '--tw-prose-pre-bg': theme('colors.zinc.800'),
            '--tw-prose-th-borders': theme('colors.zinc.600'),
            '--tw-prose-td-borders': theme('colors.zinc.700'),
          },
        },
      }),

      /* ───────────────────────────  Fonts  ─────────────────────────── */
      fontFamily: {
        sans: ["var(--font-public-sans)", "sans-serif"],
        heading: ["var(--font-space-grotesk)", "sans-serif"],
      },
    },
  },

  /* ───────────────────────────  Plugins  ─────────────────────────── */
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwindcss-animate"),
  ],
});

export default config;
