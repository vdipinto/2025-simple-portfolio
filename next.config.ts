// next.config.ts
import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // ✅ add this so .css.map files are emitted in .next/static/css
  productionBrowserSourceMaps: true,

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "xsocd3chi5.ufs.sh", pathname: "/f/*" },
      { protocol: "https", hostname: "utfs.io", pathname: "/f/*" },
    ],
  },

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true }, // temp

  async redirects() {
    return [{ source: "/rss.xml", destination: "/api/rss", permanent: true }];
  },

  experimental: {
    // optimizePackageImports: ["lucide-react", "date-fns"], // optional
  },
};

export default withAnalyzer(nextConfig);
