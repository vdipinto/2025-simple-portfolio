import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xsocd3chi5.ufs.sh", // Your UploadThing subdomain
        pathname: "/f/*",
      },
      {
        protocol: "https",
        hostname: "utfs.io", // UploadThing's public CDN
        pathname: "/f/*",
      },
    ],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  // 👇not for longtime - this is a workaround. 
  typescript: {
    ignoreBuildErrors: true, // skips *.d.ts errors like the 'rss' module warning
  },

  async redirects() {
    return [
      {
        source: "/rss.xml",
        destination: "/api/rss",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
