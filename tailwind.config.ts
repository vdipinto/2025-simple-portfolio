// tailwind.config.ts
import { withUt } from "uploadthing/tw";
import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

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
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		typography: '(theme: (path: string) => string) => ({\n        /**\n         * Adds `.prose-invert` styles that look good in dark mode\n         * and use 90 % opacity on paragraphs.\n         */\n        invert: {\n          css: {\n            "--tw-prose-body": theme("colors.zinc.100"),\n            "--tw-prose-headings": theme("colors.zinc.100"),\n            "--tw-prose-lead": theme("colors.zinc.300"),\n            "--tw-prose-links": theme("colors.zinc.100"),\n            "--tw-prose-bold": theme("colors.zinc.100"),\n            "--tw-prose-counters": theme("colors.zinc.300"),\n            "--tw-prose-bullets": theme("colors.zinc.300"),\n            "--tw-prose-hr": theme("colors.zinc.700"),\n            "--tw-prose-quotes": theme("colors.zinc.100"),\n            "--tw-prose-quote-borders": theme("colors.zinc.700"),\n            "--tw-prose-captions": theme("colors.zinc.500"),\n            "--tw-prose-code": theme("colors.zinc.100"),\n            "--tw-prose-pre-code": theme("colors.zinc.100"),\n            "--tw-prose-pre-bg": theme("colors.zinc.800"),\n            "--tw-prose-th-borders": theme("colors.zinc.600"),\n            "--tw-prose-td-borders": theme("colors.zinc.700"),\n          },\n        },\n      })',
  		fontFamily: {
  			sans: [
  				'var(--font-public-sans)',
  				'sans-serif'
  			],
  			heading: [
  				'var(--font-space-grotesk)',
  				'sans-serif'
  			]
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },

  /* ───────────────────────────  Plugins  ─────────────────────────── */
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwindcss-animate"),

    // Custom utilities: adaptive grid background
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".bg-grid": {
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.08) 1px, transparent 1px)",
          backgroundSize: "5vw 5vw",
          backgroundPosition: "0 0, 0 0",
        },
        ".dark .bg-grid": {
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
        },

      ".bg-cta-gradient": {
      backgroundImage:
        "linear-gradient(135deg, " +
        "hsl(var(--cta-1) / 0.9) 0%, " +
        "hsl(var(--cta-2) / 0.9) 45%, " +
        "hsl(var(--cta-3) / 0.9) 100%)",
    },
    ".cta-glow": {
      boxShadow:
        "0 0 12px rgba(100, 180, 255, 0.45), 0 0 24px rgba(100, 180, 255, 0.25)",
    },

      });
    }),
  ],
});

export default config;
