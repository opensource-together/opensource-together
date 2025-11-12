import { addCacheBusting } from "@/shared/lib/utils/add-cache-busting";

/**
 * Hook to get an image URL with automatic cache-busting based on updatedAt
 * Uses the project's updatedAt timestamp to generate cache-busting parameter
 * This ensures the browser reloads the image when it's updated, even after page refresh
 *
 * @param imageUrl - The image URL from the project
 * @param updatedAt - The entity's updatedAt date (from API)
 * @returns The image URL with cache-busting parameter based on updatedAt
 */
export function useCacheBustingImage(
  imageUrl: string | null | undefined,
  updatedAt?: Date | string | null
): string | null | undefined {
  if (!imageUrl) return null;

  const timestamp = updatedAt ? new Date(updatedAt).getTime() : undefined;

  return addCacheBusting(imageUrl, timestamp);
}
