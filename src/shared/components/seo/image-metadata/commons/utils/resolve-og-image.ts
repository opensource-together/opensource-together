const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunk = 0x8000;

  for (let i = 0; i < bytes.length; i += chunk) {
    const slice = bytes.subarray(i, i + chunk);
    binary += String.fromCharCode(...slice);
  }

  return btoa(binary);
};

export async function resolveOgImageSource(
  source: string | null | undefined,
  fallbackLabel: string,
  options?: { size?: number }
): Promise<string> {
  const size = options?.size ?? 300;
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    fallbackLabel
  )}&background=f8fafc&color=0f172a&bold=true&size=${size}`;

  if (!source) return fallback;

  try {
    const response = await fetch(source, {
      method: "GET",
      cache: "force-cache",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) {
      throw new Error("Source is not an image");
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = arrayBufferToBase64(arrayBuffer);
    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    console.warn("Failed to resolve OG image source:", error);
    return fallback;
  }
}
