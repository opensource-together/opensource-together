import "server-only";

/** `caches.default` only exists on Cloudflare Workers; returns null elsewhere (e.g. `next dev`). */
export function getEdgeCache(): Cache | null {
  const caches = globalThis.caches as
    | (CacheStorage & { default?: Cache })
    | undefined;
  return caches?.default ?? null;
}
