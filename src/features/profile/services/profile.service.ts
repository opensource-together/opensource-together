import { API_BASE_URL } from "@/config/config";
import type { Project } from "@/features/projects/types/project.type";
import type {
  PaginatedResponse,
  PaginationParams,
} from "@/shared/types/pagination.type";

import type { Profile } from "../types/profile.type";
import type { UpdateProfileInput } from "../validations/profile.schema";

export interface UserProjectsQueryParams extends PaginationParams {
  published?: boolean;
}

export interface PaginatedUserProjectsResponse
  extends PaginatedResponse<Project> {}

export interface UserBookmarksQueryParams extends PaginationParams {}

export interface PaginatedUserBookmarksResponse
  extends PaginatedResponse<Project> {}

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

export const updateProfile = async (
  id: string,
  params: UpdateProfileInput
): Promise<Profile> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(params),
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

export const updateProfileBanner = async (
  id: string,
  bannerFile: File
): Promise<Pick<Profile, "banner">> => {
  try {
    const formData = new FormData();
    formData.append("file", bannerFile);

    const response = await fetch(`${API_BASE_URL}/users/${id}/banner`, {
      method: "PATCH",
      credentials: "include",
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to upload banner");
    }
    const apiResponse = await response.json();
    return apiResponse.data;
  } catch (error) {
    console.error("Error updating profile banner:", error);
    throw error;
  }
};

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
