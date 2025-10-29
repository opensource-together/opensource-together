import { API_BASE_URL } from "@/config/config";

import {
  PaginatedResponse,
  PaginationParams,
} from "@/shared/types/pagination.type";

import { Project } from "../types/project.type";
import {
  ProjectSchema,
  UpdateProjectData,
} from "../validations/project.schema";
import { transformProjectForPublishedToggle } from "../validations/publish-toggle.validation";

export interface ProjectQueryParams extends PaginationParams {
  techStacks?: string | string[];
  categories?: string | string[];
  orderBy?: "createdAt" | "title";
  orderDirection?: "asc" | "desc";
}

export interface PaginatedProjectsResponse extends PaginatedResponse<Project> {}

/**
 * Fetches the list of all projects.
 *
 * @param params - Optional query parameters to filter projects.
 * @returns A promise that resolves to the projects data.
 */
export const getProjects = async (
  params?: ProjectQueryParams
): Promise<PaginatedProjectsResponse> => {
  try {
    const queryParams = new URLSearchParams(
      Object.entries(params ?? {})
        .filter(([_, v]) => v !== undefined && v !== null)
        .map(([k, v]) => [k, String(v)])
    );
    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/projects${queryString ? `?${queryString}` : ""}`;
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error fetching projects");
    }

    const apiResponse = await response.json();
    return apiResponse;
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
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error fetching project details");
    }

    const apiResponse = await response.json();
    return apiResponse?.data;
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

  const apiResponse = await response.json();
  return apiResponse?.data || apiResponse;
};

/**
 * Updates an existing project with optional image handling.
 *
 * @param projectId - The ID of the project to update.
 * @returns A promise that resolves to the updated project.
 */
export const updateProject = async (
  projectId: string,
  projectData: UpdateProjectData
): Promise<Project> => {
  const {
    logoUrl: _omitLogoUrl,
    imagesUrls: _omitImagesUrls,
    ...payload
  } = projectData;
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

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
      throw new Error(error.message || "Error while deleting project");
    }
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

export const updateProjectPublishedStatus = async (
  projectId: string,
  project: Project,
  published: boolean
): Promise<Project> => {
  const payload = transformProjectForPublishedToggle(project, published);
  return updateProject(projectId, payload);
};

/**
 * Updates the logo of a project.
 *
 * @param projectId - The ID of the project to update.
 * @param logoFile - The logo file to upload.
 * @returns A promise that resolves to the updated project.
 */
export const updateProjectLogo = async (
  projectId: string,
  logoFile: File
): Promise<Project> => {
  const formData = new FormData();
  formData.append("file", logoFile);

  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/logo`, {
    method: "PATCH",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error updating project logo");
  }

  return response.json();
};

/**
 * Updates the cover image of a project.
 *
 * @param projectId - The ID of the project to update.
 * @param coverFile - The cover file to upload.
 * @returns A promise that resolves to the updated project.
 */
export const updateProjectCover = async (
  projectId: string,
  coverFile: File
): Promise<Project> => {
  const formData = new FormData();
  formData.append("file", coverFile);

  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/images`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error updating project cover");
  }

  return response.json();
};

/**
 * Deletes a specific cover image from a project by its URL.
 *
 * @param projectId - The ID or publicId of the project.
 * @param imageUrl - The public URL of the image to delete.
 * @returns A promise that resolves to the updated project.
 */
export const deleteProjectImage = async (
  projectId: string,
  imageUrl: string
): Promise<Project> => {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/images`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: imageUrl }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error deleting project image");
  }

  return response.json();
};
