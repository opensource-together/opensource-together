import { ImageResponse } from "next/og";
import type { ReactElement } from "react";

const FONT_BASE_URL = `${process.env.NEXT_PUBLIC_METADATA_ASSETS_S3_BUCKET}/fonts`;

const fontVariants = [
  { name: "Geist-Thin.ttf", weight: 100 },
  { name: "Geist-ExtraLight.ttf", weight: 200 },
  { name: "Geist-Light.ttf", weight: 300 },
  { name: "Geist-Regular.ttf", weight: 400 },
  { name: "Geist-Medium.ttf", weight: 500 },
  { name: "Geist-SemiBold.ttf", weight: 600 },
  { name: "Geist-Bold.ttf", weight: 700 },
  { name: "Geist-ExtraBold.ttf", weight: 800 },
  { name: "Geist-Black.ttf", weight: 900 },
];

export async function Generator({ children }: { children: ReactElement }) {
  const fonts = await Promise.all(
    fontVariants.map(async (variant) => {
      const url = `${FONT_BASE_URL}/${variant.name}`;

      try {
        const res = await fetch(url, {
          cache: "no-store",
        });

        if (!res.ok) {
          console.warn(
            `Failed to fetch font ${variant.name} (${url}): ${res.status}`
          );
          return null;
        }

        const fontData = await res.arrayBuffer();

        return {
          name: "Geist",
          data: fontData,
          style: "normal" as const,
          weight: variant.weight as
            | 100
            | 200
            | 300
            | 400
            | 500
            | 600
            | 700
            | 800
            | 900,
        };
      } catch (error) {
        console.warn(`Failed to load font ${variant.name}:`, error);
        return null;
      }
    })
  );

  const loadedFonts = fonts.filter(
    (font): font is NonNullable<typeof font> => font !== null
  );

  return new ImageResponse(children, {
    width: 1200,
    height: 630,
    ...(loadedFonts.length > 0 ? { fonts: loadedFonts } : {}),
  });
}
