function resolveApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    return "/api";
  }
  const origin = process.env.NEXT_PUBLIC_FRONTEND_URL;
  return `${origin}/api`;
}

const baseUrl = resolveApiBaseUrl();
const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL ?? "";

if (!frontendUrl) {
  console.warn(
    "⚠️ NEXT_PUBLIC_FRONTEND_URL is not defined! Frontend will not work."
  );
}

export const API_BASE_URL: string = baseUrl;
export const FRONTEND_URL: string = frontendUrl;
