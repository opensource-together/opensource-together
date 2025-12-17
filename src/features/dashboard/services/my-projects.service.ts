import { API_BASE_URL } from "@/config/config";
import type { Project } from "@/features/projects/types/project.type";
import type {
  PaginatedResponse,
  PaginationParams,
} from "@/shared/types/pagination.type";

export interface ProjectQueryParams extends PaginationParams {
  published?: boolean;
}

export interface PaginatedProjectsResponse extends PaginatedResponse<Project> {}

/**
 * Fetches the list of projects for the current user.
 *
 * @param params - Optional query parameters to filter user projects.
 * @returns A promise that resolves to an array of projects.
 */
export const getMyProjects = async (
  params?: ProjectQueryParams
): Promise<PaginatedProjectsResponse> => {
  try {
    const queryParams = new URLSearchParams(
      Object.entries(params ?? {})
        .filter(([_, v]) => v !== undefined && v !== null)
        .map(([k, v]) => [k, String(v)])
    );
    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/users/me/projects${queryString ? `?${queryString}` : ""}`;
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch my projects");
    }
    const apiResponse = await response.json();
    return apiResponse;
  } catch (error) {
    console.error("Error fetching my projects:", error);
    throw error;
  }
};
