/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    domains: [
      "www.google.com",
      "media.discordapp.net",
      "upload.wikimedia.org",
      "pbs.twimg.com",
      "avatars.githubusercontent.com",
      "pub-9015c9fc95574da98f6e7b9d4555ae24.r2.dev",
    ],
  },
};

module.exports = nextConfig;
