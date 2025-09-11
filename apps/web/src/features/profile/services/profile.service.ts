import { API_BASE_URL } from "@/config/config";

import {
  safeDeleteMedia,
  safeReplaceMedia,
  safeUploadMedia,
} from "@/shared/services/media.service";

import { Profile } from "../types/profile.type";
import {
  ProfileSchema,
  UpdateProfileSchema,
} from "../validations/profile.schema";

/**
 * Gets a public user by ID.
 *
 * @param id - The user ID to fetch.
 * @returns A promise that resolves to the user data.
 */
export const getUserById = async (id: string): Promise<Profile> => {
  try {
    const response = await fetch(`${API_BASE_URL}/profiles/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch user");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

/**
 * Updates the profile of the current user.
 *
 * @param params - The data for the updated profile.
 * @param avatarFile - Optional file to upload as the avatar.
 * @param shouldDeleteAvatar - Optional flag to delete the current avatar.
 * @returns A promise that resolves to the updated profile.
 */
export const updateProfile = async (
  params: ProfileSchema,
  avatarFile?: File,
  shouldDeleteAvatar?: boolean
): Promise<Profile> => {
  try {
    const validatedData = UpdateProfileSchema.parse(params);

    let avatarUrl: string | undefined = validatedData.avatarUrl;

    if (shouldDeleteAvatar && params.avatarUrl) {
      await safeDeleteMedia(params.avatarUrl);
      avatarUrl = undefined;
    } else if (avatarFile) {
      if (params.avatarUrl) {
        const newAvatarUrl = await safeReplaceMedia(
          params.avatarUrl,
          avatarFile
        );
        avatarUrl = newAvatarUrl || undefined;
      } else {
        const newAvatarUrl = await safeUploadMedia(avatarFile);
        avatarUrl = newAvatarUrl || undefined;
      }
    }

    const response = await fetch(`${API_BASE_URL}/profiles`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        ...validatedData,
        avatarUrl,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update profile");
    }

    return response.json();
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
