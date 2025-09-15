import { API_BASE_URL } from "@/config/config";

export interface MediaUploadResponse {
  url: string;
  key: string;
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

    const response = await fetch(`${API_BASE_URL}/media/image/public`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to upload media");
    }

    return response.json();
  } catch (error) {
    console.error("Error uploading media:", error);
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
      `${API_BASE_URL}/media/image/public/${encodeURIComponent(oldKey)}`,
      {
        method: "PUT",
        body: formData,
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to change media");
    }

    return response.json();
  } catch (error) {
    console.error("Error changing media:", error);
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
      `${API_BASE_URL}/media/image/public/${encodeURIComponent(key)}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete media");
    }
  } catch (error) {
    console.error("Error deleting media:", error);
    throw error;
  }
};

/**
 * Extract the key from a media URL
 * @param mediaUrl - The full URL of the media
 * @returns The key (filename) extracted from the URL
 */
export const extractMediaKey = (mediaUrl: string): string => {
  if (!mediaUrl) return "";
  const url = new URL(mediaUrl);
  return url.pathname.substring(1);
};

// ===== SAFE WRAPPERS =====

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
    console.error("Error uploading media:", error);
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
    console.warn("No current image URL provided for replacement");
    return null;
  }

  const currentImageKey = extractMediaKey(currentImageUrl);

  try {
    // Try to change existing image
    const response = await replaceMedia(currentImageKey, newFile);
    return response.url;
  } catch (error) {
    console.warn("Failed to change image, falling back to upload:", error);

    try {
      const response = await uploadMedia(newFile);
      await deleteMedia(currentImageKey).catch(() => {});
      return response.url;
    } catch (uploadError) {
      console.error("Failed to upload replacement image:", uploadError);
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
    console.warn(`Failed to delete image "${imageUrl}":`, error);
  }
};
