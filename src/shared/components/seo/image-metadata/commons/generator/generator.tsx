import "server-only";

import { ImageResponse } from "next/og";
import type { ReactElement } from "react";

import { getEdgeCache } from "@/shared/lib/cloudflare-edge-cache";

const FONT_BASE_URL = `${process.env.NEXT_PUBLIC_METADATA_ASSETS_S3_BUCKET}/fonts`;

const FONT_CACHE_TTL_SECONDS = 60 * 60 * 24 * 30;

interface SatoriFont {
  name: string;
  data: ArrayBuffer;
  style: "normal";
  weight: 400 | 500;
}

// Only the weights used by the OG metadata components (400/500).
const fontVariants: { name: string; weight: 400 | 500 }[] = [
  { name: "Geist-Regular.ttf", weight: 400 },
  { name: "Geist-Medium.ttf", weight: 500 },
];

async function loadFont(variant: {
  name: string;
  weight: 400 | 500;
}): Promise<SatoriFont | null> {
  const url = `${FONT_BASE_URL}/${variant.name}`;

  try {
    const cache = getEdgeCache();
    const cacheKey = new Request(url);

    if (cache) {
      const hit = await cache.match(cacheKey);
      if (hit) {
        return {
          name: "Geist",
          data: await hit.arrayBuffer(),
          style: "normal",
          weight: variant.weight,
        };
      }
    }

    const res = await fetch(url);

    if (!res.ok) {
      console.warn(
        `Failed to fetch font ${variant.name} (${url}): ${res.status}`
      );
      return null;
    }

    const fontData = await res.arrayBuffer();

    if (cache) {
      await cache.put(
        cacheKey,
        new Response(fontData, {
          headers: {
            "Content-Type": "font/ttf",
            "Cache-Control": `public, max-age=${FONT_CACHE_TTL_SECONDS}`,
          },
        })
      );
    }

    return {
      name: "Geist",
      data: fontData,
      style: "normal",
      weight: variant.weight,
    };
  } catch (error) {
    console.warn(`Failed to load font ${variant.name}:`, error);
    return null;
  }
}

export async function Generator({ children }: { children: ReactElement }) {
  const loadedFonts = (await Promise.all(fontVariants.map(loadFont))).filter(
    (font): font is SatoriFont => font !== null
  );

  return new ImageResponse(children, {
    width: 1200,
    height: 630,
    ...(loadedFonts.length > 0 ? { fonts: loadedFonts } : {}),
  });
}
