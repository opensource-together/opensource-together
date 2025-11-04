import { ImageResponse } from "next/og";
import { ReactElement } from "react";

const FONT_BASE_URL =
  "https://raw.githubusercontent.com/opensource-together/opensource-together/develop/public/fonts/Geist/static";

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
  console.log("[Generator] Starting image generation");

  try {
    console.log("[Generator] Loading fonts...");
    const fontPromises = fontVariants.map(async (variant) => {
      const url = `${FONT_BASE_URL}/${variant.name}`;

      try {
        const res = await fetch(url, {
          cache: "no-store",
        });

        if (!res.ok) {
          console.warn(
            `[Generator] Failed to fetch font ${variant.name} (${url}): ${res.status}`
          );
          return null;
        }

        const fontData = await res.arrayBuffer();
        console.log(`[Generator] Font ${variant.name} loaded successfully`);

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
        console.warn(`[Generator] Failed to load font ${variant.name}:`, error);
        return null;
      }
    });

    const fonts = await Promise.allSettled(fontPromises).then((results) =>
      results.map((result) =>
        result.status === "fulfilled" ? result.value : null
      )
    );

    const loadedFonts = fonts.filter(
      (font): font is NonNullable<typeof font> => font !== null
    );

    console.log(
      `[Generator] Loaded ${loadedFonts.length} fonts out of ${fontVariants.length}`
    );

    console.log("[Generator] Creating ImageResponse...");
    const imageResponse = new ImageResponse(children, {
      width: 1200,
      height: 630,
      ...(loadedFonts.length > 0 ? { fonts: loadedFonts } : {}),
    });

    console.log("[Generator] ImageResponse created successfully");
    return imageResponse;
  } catch (error) {
    console.error("[Generator] Failed to generate ImageResponse:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : typeof error,
    });
    throw error;
  }
}
