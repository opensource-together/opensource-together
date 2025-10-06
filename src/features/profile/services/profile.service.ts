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
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch user");
    }

    const apiResponse = await response.json();
    return apiResponse.data;
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
  id: string,
  params: ProfileSchema,
  avatarFile?: File,
  shouldDeleteAvatar?: boolean
): Promise<Profile> => {
  try {
    const validatedData = UpdateProfileSchema.parse(params);

    let image: string | undefined = validatedData.image;

    if (shouldDeleteAvatar && params.image) {
      await safeDeleteMedia(params.image);
      image = undefined;
    } else if (avatarFile) {
      if (params.image) {
        const newAvatarUrl = await safeReplaceMedia(params.image, avatarFile);
        image = newAvatarUrl || undefined;
      } else {
        const newAvatarUrl = await safeUploadMedia(avatarFile);
        image = newAvatarUrl || undefined;
      }
    }

    const {
      name,
      bio,
      jobTitle,
      userTechStacks,
      githubUrl,
      gitlabUrl,
      discordUrl,
      twitterUrl,
      linkedinUrl,
      websiteUrl,
    } = validatedData;

    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        // TODO: Let this be handled by the backend when we will have the image
        // ...validatedData,
        // image,
        name,
        bio,
        jobTitle,
        githubUrl,
        gitlabUrl,
        discordUrl,
        twitterUrl,
        linkedinUrl,
        websiteUrl,
        userTechStacks,
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
