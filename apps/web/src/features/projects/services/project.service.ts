import { API_BASE_URL } from "@/config/config";

import { ProjectFormData } from "../stores/project-create.store";
import { Project } from "../types/project.type";
import { createProjectApiSchema } from "../validations/project-stepper.schema";
import {
  UpdateProjectData,
  UpdateProjectSchema,
} from "../validations/project.schema";
import { transformProjectForApi } from "./project-transform.service";

/**
 * Fetches the list of all projects.
 *
 * @returns A promise that resolves to an array of projects.
 */
export const getProjects = async (): Promise<Project[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error fetching projects");
    }

    return response.json();
    // Mock data - commented out for now
    // return Promise.resolve(mockProjects);
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
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error fetching project details");
    }

    return response.json();

    // Mock data - commented out for now
    // return Promise.resolve(
    //   mockProjects.find((p) => p.id === projectId) || mockProjects[0]
    // );
  } catch (error) {
    console.error("Error fetching project details:", error);
    throw error;
  }
};

/**
 * Creates a new project.
 *
 * @param storeData - The data for the new project.
 * @returns A promise that resolves to the created project.
 */
export const createProject = async (
  storeData: ProjectFormData
): Promise<Project> => {
  try {
    // Transform store data to API format
    const apiData = transformProjectForApi(storeData);

    const validatedData = createProjectApiSchema.parse(apiData);

    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error creating project");
    }

    return response.json();
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

/**
 * Updates an existing project.
 *
 * @param params - The data for the updated project.
 * @returns A promise that resolves to the updated project.
 */
export const updateProject = async (
  params: UpdateProjectData
): Promise<Project> => {
  try {
    // Validate input parameters
    const validatedParams = UpdateProjectSchema.parse(params);
    const { data, projectId } = validatedParams;

    // Transform data to API format
    const apiPayload = {
      title: data.title,
      description: data.shortDescription,
      shortDescription: data.shortDescription,
      externalLinks: data.externalLinks
        ? Object.entries(data.externalLinks)
            .filter(([_, url]) => typeof url === "string" && url.trim())
            .map(([type, url]) => ({
              type: type === "website" ? "other" : type,
              url: url as string,
            }))
        : [],
      techStacks: data.techStack || [],
      categories: data.categories || [],
      keyFeatures: data.keyFeatures?.map((feature) => feature.feature) || [],
      projectGoals: data.projectGoals?.map((goal) => goal.goal) || [],
    };

    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(apiPayload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error updating project");
    }

    return response.json();
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

/**
 * Deletes a project by its ID.
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

    // No need to return anything for DELETE
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};
