export const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_URL ?? "";

if (!API_BASE_URL) {
  console.warn("⚠️ NEXT_PUBLIC_API_URL is not defined! API calls will fail.");
}
