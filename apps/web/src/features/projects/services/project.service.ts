import { API_BASE_URL } from "@/config/config";

import {
  changeMedia,
  deleteMedia,
  extractMediaKey,
  uploadMedia,
} from "@/shared/services/media.service";

import { ProjectFormData } from "../stores/project-create.store";
import { Project } from "../types/project.type";
import {
  UpdateProjectData,
  UpdateProjectSchema,
  createProjectApiSchema,
  updateProjectApiSchema,
} from "../validations/project.schema";
import {
  transformProjectForApi,
  transformProjectForApiUpdate,
} from "./project-transform.service";

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
 * Creates a new project with optional image upload.
 *
 * @param storeData - The data for the new project.
 * @param imageFile - Optional image file to upload.
 * @returns A promise that resolves to the created project.
 */
export const createProject = async (
  storeData: ProjectFormData,
  imageFile?: File
): Promise<Project> => {
  try {
    let imageUrl: string | undefined;

    // Upload image if provided
    if (imageFile) {
      const mediaResponse = await uploadMedia(imageFile);
      imageUrl = mediaResponse.url;
    }

    // Transform store data to API format
    const apiData = transformProjectForApi({
      ...storeData,
      image: imageUrl || storeData.image,
    });

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
      // If project creation fails and we uploaded an image, clean it up
      if (imageUrl) {
        try {
          const imageKey = extractMediaKey(imageUrl);
          await deleteMedia(imageKey);
        } catch (cleanupError) {
          console.warn("Failed to cleanup uploaded image:", cleanupError);
        }
      }

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
 * Updates an existing project with optional image handling.
 *
 * @param params - The data for the updated project.
 * @param newImageFile - Optional new image file to upload.
 * @param shouldDeleteImage - Whether to delete the current image.
 * @returns A promise that resolves to the updated project.
 */
export const updateProject = async (
  params: UpdateProjectData,
  newImageFile?: File,
  shouldDeleteImage?: boolean
): Promise<Project> => {
  try {
    // Validate input parameters
    const validatedParams = UpdateProjectSchema.parse(params);
    const { data, projectId } = validatedParams;

    // Get current project to access current image
    const currentProject = await getProjectDetails(projectId);
    let imageUrl: string | undefined = currentProject.image;

    // Handle image operations
    if (shouldDeleteImage && currentProject.image) {
      // Delete current image
      const currentImageKey = extractMediaKey(currentProject.image);
      await deleteMedia(currentImageKey);
      imageUrl = undefined;
    } else if (newImageFile) {
      if (currentProject.image) {
        // Change existing image
        const currentImageKey = extractMediaKey(currentProject.image);
        const mediaResponse = await changeMedia(currentImageKey, newImageFile);
        imageUrl = mediaResponse.url;
      } else {
        // Upload new image
        const mediaResponse = await uploadMedia(newImageFile);
        imageUrl = mediaResponse.url;
      }
    }

    // Transform data to API format
    const apiPayload = transformProjectForApiUpdate({
      ...data,
      image: imageUrl,
    });

    // Validate the API payload
    const validatedData = updateProjectApiSchema.parse(apiPayload);

    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(validatedData),
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
 * Deletes a project by its ID and cleans up associated media.
 *
 * @param projectId - The ID of the project to delete.
 * @returns A promise that resolves to void.
 */
export const deleteProject = async (projectId: string): Promise<void> => {
  try {
    // Get project details to access image before deletion
    const project = await getProjectDetails(projectId);

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

    // Clean up associated image after successful project deletion
    if (project.image) {
      try {
        const imageKey = extractMediaKey(project.image);
        await deleteMedia(imageKey);
      } catch (mediaError) {
        // Log but don't throw - project is already deleted
        console.warn("Failed to delete project image:", mediaError);
      }
    }

    // No need to return anything for DELETE
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};
