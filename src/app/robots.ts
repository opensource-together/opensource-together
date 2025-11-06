import type { MetadataRoute } from "next";

import { FRONTEND_URL } from "@/config/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/",
        "/profile/me/",
        "/projects/*/edit",
        "/projects/create/",
        "/onboarding/",
      ],
    },
    sitemap: `${FRONTEND_URL}/sitemap.xml`,
  };
}
