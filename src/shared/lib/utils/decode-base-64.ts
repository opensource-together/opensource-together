import { Buffer } from "buffer";

export function decodeBase64Safe(input?: string | null): string | undefined {
  if (!input) return undefined;
  try {
    const normalized = input.replace(/\s+/g, "");
    if (typeof window !== "undefined" && typeof window.atob === "function") {
      const decoded = decodeURIComponent(
        Array.prototype.map
          .call(
            window.atob(normalized),
            (c: string) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
          )
          .join("")
      );
      return decoded;
    }
    // SSR fallback
    return Buffer.from(normalized, "base64").toString("utf-8");
  } catch {
    return input ?? undefined;
  }
}
