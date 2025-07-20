import { API_BASE_URL } from "@/config/config";

export interface MediaUploadResponse {
  url: string;
}

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
export const changeMedia = async (
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
  return mediaUrl.split("/").pop() || "";
};
