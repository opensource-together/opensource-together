import { API_BASE_URL } from "@/config/config";

import logger from "@/shared/logger";

export interface MediaUploadResponse {
  url: string;
}

// ===== PUBLIC CALLS API =====

/**
 * Upload a new image to R2 storage
 * @param file - The image file to upload
 * @returns Promise with the uploaded image URL
 */
export const uploadMedia = async (file: File): Promise<MediaUploadResponse> => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${API_BASE_URL}/media/upload/image/public`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to upload media");
    }

    return response.json();
  } catch (error) {
    logger.error("Error uploading media:", error);
    throw error;
  }
};

/**
 * Change an existing image in R2 storage
 * @param oldKey - The key of the existing image to replace
 * @param newFile - The new image file
 * @returns Promise with the new image URL
 */
export const replaceMedia = async (
  oldKey: string,
  newFile: File
): Promise<MediaUploadResponse> => {
  try {
    const formData = new FormData();
    formData.append("image", newFile);

    const response = await fetch(
      `${API_BASE_URL}/media/change/image/public/${oldKey}`,
      {
        method: "PATCH",
        body: formData,
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to change media");
    }

    return response.json();
  } catch (error) {
    logger.error("Error changing media:", error);
    throw error;
  }
};

/**
 * Delete an image from R2 storage
 * @param key - The key of the image to delete
 * @returns Promise that resolves when the image is deleted
 */
export const deleteMedia = async (key: string): Promise<void> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/media/delete/image/public/${key}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete media");
    }
  } catch (error) {
    logger.error("Error deleting media:", error);
    throw error;
  }
};

/**
 * Extract the key from a media URL
 * @param mediaUrl - The full URL of the media
 * @returns The key (filename) extracted from the URL
 */
export const extractMediaKey = (mediaUrl: string): string => {
  return mediaUrl.split("/").pop() || "";
};

// ===== SAFE WRAPPERS =====
// These functions are used to wrap the public calls and provide a safe way to handle media operations.
// They will handle the case where the image is not found or the upload fails.
// They will also handle the case where the image is not found or the upload fails.

/**
 * Upload a new image (safe by default)
 * @param file - The image file to upload
 * @returns Promise with the uploaded image URL, or null if upload failed
 */
export const safeUploadMedia = async (file: File): Promise<string | null> => {
  try {
    const response = await uploadMedia(file);
    return response.url;
  } catch (error) {
    logger.error("Error uploading media:", error);
    return null;
  }
};

/**
 * Replace an existing image with a new one (safe by default)
 * @param currentImageUrl - The URL of the current image to replace
 * @param newFile - The new image file
 * @returns Promise with the new image URL, or null if replace failed
 */
export const safeReplaceMedia = async (
  currentImageUrl: string,
  newFile: File
): Promise<string | null> => {
  if (!currentImageUrl) {
    logger.warn("No current image URL provided for replacement");
    return null;
  }

  const currentImageKey = extractMediaKey(currentImageUrl);

  try {
    // Try to change existing image
    const response = await replaceMedia(currentImageKey, newFile);
    return response.url;
  } catch (error) {
    logger.warn("Failed to change image, falling back to upload:", error);

    try {
      // Fallback: upload new image and clean old one
      const response = await uploadMedia(newFile);
      await deleteMedia(currentImageKey).catch(() => {
        // Silent fail - old image cleanup is best effort
      });
      return response.url;
    } catch (uploadError) {
      logger.error("Failed to upload replacement image:", uploadError);
      return null;
    }
  }
};

/**
 * Delete an image (safe by default)
 * @param imageUrl - The URL of the image to delete
 * @returns Promise that resolves when deletion is complete (or silently fails)
 */
export const safeDeleteMedia = async (imageUrl: string): Promise<void> => {
  if (!imageUrl) return;

  const key = extractMediaKey(imageUrl);
  if (!key) return;

  try {
    await deleteMedia(key);
  } catch (error) {
    logger.warn(`Failed to delete image "${imageUrl}":`, error);
    // Silent fail - deletion is safe by default
  }
};
