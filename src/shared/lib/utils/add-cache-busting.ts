/**
 * Adds a cache-busting parameter to a URL to force browser reload
 * @param url - The URL to add cache-busting to
 * @param version - Optional version number (defaults to current timestamp)
 * @returns The URL with cache-busting parameter
 *
 * @example
 * addCacheBusting('https://example.com/image.png')
 * // => 'https://example.com/image.png?v=1234567890'
 *
 * addCacheBusting('https://example.com/image.png?v=old', 999)
 * // => 'https://example.com/image.png?v=999'
 */
export function addCacheBusting(
  url: string | null | undefined,
  version?: number
): string | null {
  if (!url) return null;

  const versionParam = version ?? Date.now();
  const baseUrl = url.split("?")[0].split("#")[0];
  const separator = baseUrl.includes("?") ? "&" : "?";

  return `${baseUrl}${separator}v=${versionParam}`;
}
