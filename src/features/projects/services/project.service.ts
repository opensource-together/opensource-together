import { API_BASE_URL } from "@/config/config";

import type {
  PaginatedResponse,
  PaginationParams,
} from "@/shared/types/pagination.type";

import type { Project } from "../types/project.type";
import type {
  CreateProjectInput,
  UpdateProjectInput,
} from "../validations/project.schema";
import { transformProjectForPublishedToggle } from "../validations/publish-toggle.validation";

export interface ProjectQueryParams extends PaginationParams {
  published?: boolean;
  techStacks?: string | string[];
  categories?: string | string[];
  orderBy?: "createdAt" | "title" | "trending";
  orderDirection?: "asc" | "desc";
}

export interface PaginatedProjectsResponse extends PaginatedResponse<Project> {}

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

export const createProject = async (
  projectData: CreateProjectInput
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

export const updateProject = async (
  projectId: string,
  projectData: UpdateProjectInput
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

  const apiResponse = await response.json();
  return apiResponse?.data || apiResponse;
};

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

  const apiResponse = await response.json();
  return apiResponse?.data || apiResponse;
};

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

  const apiResponse = await response.json();
  return apiResponse?.data || apiResponse;
};

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

  const apiResponse = await response.json();
  return apiResponse?.data || apiResponse;
};

export const claimProject = async (projectId: string): Promise<Project> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/projects/${projectId}/claims`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error while claiming project");
    }

    const apiResponse = await response.json();
    return apiResponse?.data || apiResponse;
  } catch (error) {
    console.error("Error claiming project:", error);
    throw error;
  }
};

export const bookmarkProject = async (projectId: string): Promise<Project> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/projects/${projectId}/bookmarks`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error while bookmarking project");
    }

    const apiResponse = await response.json();
    return apiResponse?.data || apiResponse;
  } catch (error) {
    console.error("Error bookmarking project:", error);
    throw error;
  }
};

export const removeProjectBookmark = async (
  projectId: string
): Promise<void> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/projects/${projectId}/bookmarks`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error while removing bookmark");
    }
  } catch (error) {
    console.error("Error removing bookmark:", error);
    throw error;
  }
};
