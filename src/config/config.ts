const publicApiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
const serverApiUrl = process.env.INTERNAL_SERVER_API_URL ?? publicApiUrl;
const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL ?? "";

const isServer = typeof window === "undefined";

const resolvedApiUrl = isServer ? serverApiUrl : publicApiUrl;

const normalizeApiUrl = (url: string): string => {
  if (!url) return url;
  return url.replace(/\/+$/, "");
};

const normalizedApiUrl = normalizeApiUrl(resolvedApiUrl);

if (!normalizedApiUrl) {
  const missingEnv = isServer
    ? "INTERNAL_SERVER_API_URL"
    : "NEXT_PUBLIC_API_URL";
  console.warn(`⚠️ ${missingEnv} is not defined! API calls will fail.`);
}

if (!frontendUrl) {
  console.warn(
    "⚠️ NEXT_PUBLIC_FRONTEND_URL is not defined! Frontend will not work."
  );
}

export const API_BASE_URL: string = normalizedApiUrl;
export const FRONTEND_URL: string = frontendUrl;
