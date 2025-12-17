import { API_BASE_URL } from "@/config/config";
import type { Project } from "@/features/projects/types/project.type";
import type {
  PaginatedResponse,
  PaginationParams,
} from "@/shared/types/pagination.type";

import type { Profile } from "../types/profile.type";
import type { ProfileSchema } from "../validations/profile.schema";

export interface UserProjectsQueryParams extends PaginationParams {
  published?: boolean;
}

export interface PaginatedUserProjectsResponse
  extends PaginatedResponse<Project> {}

export interface UserBookmarksQueryParams extends PaginationParams {}

export interface PaginatedUserBookmarksResponse
  extends PaginatedResponse<Project> {}

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
      credentials: "include",
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

/**
 * Updates the profile logo/avatar of a user.
 *
 * @param id - The user ID to update.
 * @param avatarFile - The avatar file to upload.
 * @returns A promise that resolves to the updated image data.
 */
export const updateProfileLogo = async (
  id: string,
  avatarFile: File
): Promise<Pick<Profile, "image">> => {
  try {
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
    return apiResponse.data;
  } catch (error) {
    console.error("Error updating profile logo:", error);
    throw error;
  }
};

/**
 * Gets the projects for a specific user by their ID.
 *
 * @param userId - The user ID to fetch projects for.
 * @param params - Optional query parameters for pagination and filtering.
 * @returns A promise that resolves to the paginated projects data.
 */
export const getUserProjects = async (
  userId: string,
  params?: UserProjectsQueryParams
): Promise<PaginatedUserProjectsResponse> => {
  try {
    const queryParams = new URLSearchParams(
      Object.entries(params ?? {})
        .filter(([_, v]) => v !== undefined && v !== null)
        .map(([k, v]) => [k, String(v)])
    );
    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/users/${userId}/projects${queryString ? `?${queryString}` : ""}`;
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch user projects");
    }

    const apiResponse = await response.json();
    return apiResponse;
  } catch (error) {
    console.error("Error fetching user projects:", error);
    throw error;
  }
};

export const getUserBookmarks = async (
  params?: UserBookmarksQueryParams
): Promise<PaginatedUserBookmarksResponse> => {
  try {
    const queryParams = new URLSearchParams(
      Object.entries(params ?? {})
        .filter(([_, v]) => v !== undefined && v !== null)
        .map(([k, v]) => [k, String(v)])
    );
    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/users/me/bookmarks${
      queryString ? `?${queryString}` : ""
    }`;
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch user bookmarks");
    }

    const apiResponse = await response.json();
    return apiResponse;
  } catch (error) {
    console.error("Error fetching user bookmarks:", error);
    throw error;
  }
};
