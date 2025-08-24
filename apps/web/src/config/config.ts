const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

export const API_BASE_URL: string = baseUrl;

if (!baseUrl) {
  console.warn("⚠️ NEXT_PUBLIC_API_URL is not defined! API calls will fail.");
}
