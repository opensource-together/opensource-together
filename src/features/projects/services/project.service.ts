import { API_BASE_URL } from "@/config/config";

import {
  safeDeleteMedia,
  safeReplaceMedia,
  safeUploadMedia,
} from "@/shared/services/media.service";

import { ProjectFormData, provider } from "../stores/project-create.store";
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
 * @param method - Method of creation ('scratch' or 'github').
 * @returns A promise that resolves to the created project.
 */
export const createProject = async (
  storeData: ProjectFormData,
  imageFile?: File,
  method: provider = "scratch"
): Promise<Project> => {
  let imageUrl: string | null = null;
  const coverImageUrls: string[] = [];

  try {
    if (imageFile) {
      imageUrl = await safeUploadMedia(imageFile);
      if (!imageUrl) {
        throw new Error("Failed to upload image");
      }
    }

    if (storeData.coverImages && storeData.coverImages.length > 0) {
      const uploadPromises = storeData.coverImages.map((file) =>
        safeUploadMedia(file)
      );
      const results = await Promise.all(uploadPromises);

      results.forEach((url) => {
        if (url) coverImageUrls.push(url);
      });
    }

    const apiData = {
      ...transformProjectForApi(storeData),
      image: imageUrl || storeData.image,
      coverImages: coverImageUrls,
    };

    const validatedData = createProjectApiSchema.parse(apiData);

    const url =
      method === "github"
        ? `${API_BASE_URL}/projects?method=github`
        : `${API_BASE_URL}/projects?method=scratch`;

    const response = await fetch(url, {
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
    if (imageUrl) {
      await safeDeleteMedia(imageUrl);
    }
    for (const coverImageUrl of coverImageUrls) {
      await safeDeleteMedia(coverImageUrl);
    }
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
  shouldDeleteImage?: boolean,
  newCoverFiles: File[] = [],
  removedCoverImages: string[] = []
): Promise<Project> => {
  try {
    const validatedParams = UpdateProjectSchema.parse(params);
    const { data, projectId } = validatedParams;

    const currentProject = await getProjectDetails(projectId);

    let imageUrl: string | undefined = currentProject.image;
    let coverImages: string[] = currentProject.coverImages || [];

    if (shouldDeleteImage && currentProject.image) {
      await safeDeleteMedia(currentProject.image);
      imageUrl = undefined;
    } else if (newImageFile) {
      if (currentProject.image) {
        const newImageUrl = await safeReplaceMedia(
          currentProject.image,
          newImageFile
        );
        imageUrl = newImageUrl || undefined;
      } else {
        const newImageUrl = await safeUploadMedia(newImageFile);
        imageUrl = newImageUrl || undefined;
      }
    }

    if (removedCoverImages.length > 0) {
      const toDeleteSet = new Set(removedCoverImages);
      await Promise.all(removedCoverImages.map((url) => safeDeleteMedia(url)));
      coverImages = coverImages.filter((url) => !toDeleteSet.has(url));
    }

    if (newCoverFiles.length > 0) {
      const uploaded = await Promise.all(
        newCoverFiles.map((f) => safeUploadMedia(f))
      );
      const uploadedUrls = uploaded.filter((u): u is string => Boolean(u));
      coverImages = [...coverImages, ...uploadedUrls].slice(0, 4);
    }

    const apiPayload = transformProjectForApiUpdate({
      ...data,
      image: imageUrl,
      coverImages,
    });

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

    if (project.image) {
      await safeDeleteMedia(project.image);
    }
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};
