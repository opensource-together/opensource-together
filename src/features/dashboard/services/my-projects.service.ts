import { API_BASE_URL } from "@/config/config";

import { Project } from "@/features/projects/types/project.type";

/**
 * Fetches the list of projects for the current user.
 *
 * @returns A promise that resolves to an array of projects.
 */
export const getMyProjects = async (): Promise<Project[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/me/projects`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch my projects");
    }
    const apiResponse = await response.json();
    return apiResponse.data;
  } catch (error) {
    console.error("Error fetching my projects:", error);
    throw error;
  }
};
