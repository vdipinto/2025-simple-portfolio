import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xsocd3chi5.ufs.sh", // 👈 Your app's UploadThing subdomain
        pathname: "/f/*",              // 👈 Matches the image path pattern
      },
    ],
  },
};

export default nextConfig;
