import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  devIndicators: false,
  // Cloudflare Workers have no sharp: /_next/image would just proxy originals
  // through the worker on every request (CPU + no edge caching).
  // Serve original assets directly so they are cached by the browser/CDN.
  images: {
    unoptimized: true,
    qualities: [25, 50, 75, 85, 100],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
      },
      {
        protocol: "https",
        hostname: "s3-staging.opensource-together.com",
      },
      {
        protocol: "https",
        hostname: "s3.opensource-together.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
    ],
  },
};

module.exports = nextConfig;
