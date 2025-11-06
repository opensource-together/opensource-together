import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OpenSource Together",
    short_name: "OST",
    description:
      "Platform that helps developers find the right open-source projects to learn, grow, and contribute",
    start_url: "/",
    lang: "en-US",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2b7fff",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/ost-logo.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/ost-logo.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
    ],
  };
}
