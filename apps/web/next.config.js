/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    domains: ["www.google.com", "media.discordapp.net", "upload.wikimedia.org"],
  },
};

module.exports = nextConfig;
