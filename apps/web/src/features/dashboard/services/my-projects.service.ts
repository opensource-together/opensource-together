import { API_BASE_URL } from "@/config/config";

import { MyProjectType } from "../types/my-projects.type";

/**
 * Fetches the list of projects for the current user.
 *
 * @returns A promise that resolves to an array of projects.
 */
export const getMyProjects = async (): Promise<MyProjectType[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/me/projects`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch my projects");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching my projects:", error);
    throw error;
  }
};

/**
 * Fetches the details of a specific project for the current user.
 *
 * @param id - The ID of the project to fetch.
 * @returns A promise that resolves to the project details.
 */
export const getMyProjectDetails = async (
  id: string
): Promise<MyProjectType> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/me/projects/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch my project");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching my project:", error);
    throw error;
  }
};
