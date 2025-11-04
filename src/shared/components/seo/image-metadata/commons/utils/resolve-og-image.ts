const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  // Edge runtime compatible base64 encoding (btoa is not available in Edge)
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 0x8000;

  for (let i = 0; i < bytes.length; i += chunk) {
    const slice = bytes.subarray(i, i + chunk);
    // Convert bytes to binary string chunk by chunk to avoid stack overflow
    for (let j = 0; j < slice.length; j++) {
      binary += String.fromCharCode(slice[j]);
    }
  }

  // Use btoa if available (Node.js), otherwise use manual encoding
  if (typeof btoa !== "undefined") {
    return btoa(binary);
  }

  // Manual base64 encoding for Edge runtime
  const base64Chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let result = "";
  let i = 0;

  while (i < binary.length) {
    const a = binary.charCodeAt(i++);
    const b = i < binary.length ? binary.charCodeAt(i++) : 0;
    const c = i < binary.length ? binary.charCodeAt(i++) : 0;

    const bitmap = (a << 16) | (b << 8) | c;

    result +=
      base64Chars.charAt((bitmap >> 18) & 63) +
      base64Chars.charAt((bitmap >> 12) & 63) +
      (i - 2 < binary.length ? base64Chars.charAt((bitmap >> 6) & 63) : "=") +
      (i - 1 < binary.length ? base64Chars.charAt(bitmap & 63) : "=");
  }

  return result;
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
