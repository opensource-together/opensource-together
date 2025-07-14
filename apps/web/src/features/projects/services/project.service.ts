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
 * Get the list of projects
 */
export const getProjects = async (): Promise<Project[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
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
 * Get project details by project ID
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
      credentials: "include",
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
 * Create a new project via API
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
 * Update a project
 * @param params update project parameters containing data and projectId
 * @returns the updated project
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
      projectRoles:
        data.projectRoles?.map((role) => ({
          title: role.title,
          description: role.description,
          techStacks: role.techStack || [],
        })) || [],
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
 * Delete a project by ID
 * @param projectId ID of the project to delete
 * @returns Promise<void>
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
