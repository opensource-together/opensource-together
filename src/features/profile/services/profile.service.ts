import { API_BASE_URL } from "@/config/config";

import { Profile } from "../types/profile.type";
import { ProfileSchema } from "../validations/profile.schema";

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
 * @returns A promise that resolves to the updated profile.
 */
export const updateProfile = async (
  id: string,
  params: ProfileSchema
): Promise<Profile> => {
  try {
    const { image: _omitImage, ...payload } = params;
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update profile");
    }

    const apiResponse = await response.json();
    return apiResponse.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const updateProfileLogo = async (
  id: string,
  avatarFile: File
): Promise<Pick<Profile, "image">> => {
  const formData = new FormData();
  formData.append("file", avatarFile);

  const response = await fetch(`${API_BASE_URL}/users/${id}/logo`, {
    method: "PATCH",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to upload avatar");
  }

  const apiResponse = await response.json();
  return apiResponse?.data;
};
