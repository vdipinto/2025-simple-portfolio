import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xsocd3chi5.ufs.sh", // 👈 UploadThing subdomain
        pathname: "/f/*",              // 👈 Match image paths
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ Prevents build failures due to ESLint
  },
};

export default nextConfig;
