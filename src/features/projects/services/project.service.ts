import { API_BASE_URL } from "@/config/config";

import { mockProjectsResponse } from "../mocks/project.mock";
import { Project } from "../types/project.type";
import {
  ProjectSchema,
  UpdateProjectData,
} from "../validations/project.schema";

/**
 * Fetches the list of all projects.
 *
 * @returns A promise that resolves to an array of projects.
 */
export const getProjects = async (): Promise<Project[]> => {
  try {
    // const response = await fetch(`${API_BASE_URL}/projects`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });

    // if (!response.ok) {
    //   const error = await response.json();
    //   throw new Error(error.message || "Error fetching projects");
    // }

    // return response.json();
    return mockProjectsResponse;
  } catch (error) {
    console.error("Error while sending the request to the API:", error);
    throw error;
  }
};

/**
 * Fetches the details of a specific project by its ID.
 *
 * @param projectId - The ID of the project to retrieve.
 * @returns A promise that resolves to the project details.
 */
export const getProjectDetails = async (
  projectId: string
): Promise<Project> => {
  try {
    // const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });

    // if (!response.ok) {
    //   const error = await response.json();
    //   throw new Error(error.message || "Error fetching project details");
    // }

    // return response.json();
    return mockProjectsResponse.find((project) => project.id === projectId)!;
  } catch (error) {
    console.error("Error fetching project details:", error);
    throw error;
  }
};

/**
 * Creates a new project.
 *
 * @param projectData - The project data.
 * @returns A promise that resolves to the created project.
 */
export const createProject = async (
  projectData: ProjectSchema
): Promise<Project> => {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(projectData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error creating project");
  }

  return response.json();
};

/**
 * Updates an existing project with optional image handling.
 *
 * @param projectId - The ID of the project to update.
 * @returns A promise that resolves to the updated project.
 */
export const updateProject = async (
  projectData: UpdateProjectData
): Promise<Project> => {
  const response = await fetch(
    `${API_BASE_URL}/projects/${projectData.projectId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(projectData.data),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error updating project");
  }

  return response.json();
};

/**
 * Deletes a project by its ID and cleans up associated media.
 *
 * @param projectId - The ID of the project to delete.
 * @returns A promise that resolves to void.
 */
export const deleteProject = async (projectId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || "Erreur lors de la suppression du projet"
      );
    }
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};
