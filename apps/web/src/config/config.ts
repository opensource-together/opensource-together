const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL ?? "";

if (!baseUrl) {
  console.warn("⚠️ NEXT_PUBLIC_API_URL is not defined! API calls will fail.");
}

if (!frontendUrl) {
  console.warn(
    "⚠️ NEXT_PUBLIC_FRONTEND_URL is not defined! Frontend will not work."
  );
}

export const API_BASE_URL: string = baseUrl;
export const FRONTEND_URL: string = frontendUrl;
