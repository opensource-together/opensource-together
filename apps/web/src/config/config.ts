import logger from "@/shared/logger";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

// Add /v1 prefix if not already present
export const API_BASE_URL: string = baseUrl.endsWith("/v1")
  ? baseUrl
  : `${baseUrl}/v1`;

if (!baseUrl) {
  logger.warn("⚠️ NEXT_PUBLIC_API_URL is not defined! API calls will fail.");
}
