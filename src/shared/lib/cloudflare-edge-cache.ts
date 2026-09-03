import "server-only";

/**
 * Returns the Cloudflare edge cache (`caches.default`) when running on
 * Cloudflare Workers, or `null` elsewhere (e.g. `next dev` on Node.js).
 */
export function getEdgeCache(): Cache | null {
  const caches = globalThis.caches as
    | (CacheStorage & { default?: Cache })
    | undefined;
  return caches?.default ?? null;
}
