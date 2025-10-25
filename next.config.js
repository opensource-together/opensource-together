/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    domains: [
      "pbs.twimg.com",
      "avatars.githubusercontent.com",
      "cdn.jsdelivr.net",
      "s3-staging.opensource-together.com",
    ],
  },
};

module.exports = nextConfig;
