import {
  type ApiRequestContext,
  apiData,
  apiRequest,
  withQueryParams,
} from "@/shared/lib/api-client";
import type {
  PaginatedResponse,
  PaginationParams,
} from "@/shared/types/pagination.type";

import type { Project } from "../types/project.type";
import type {
  CreateProjectInput,
  UpdateProjectInput,
} from "../validations/project.schema";

export interface ProjectQueryParams extends PaginationParams {
  published?: boolean;
  techStacks?: string | string[];
  categories?: string | string[];
  orderBy?: "createdAt" | "title" | "trending";
  orderDirection?: "asc" | "desc";
}

export interface UserProjectsQueryParams extends PaginationParams {
  published?: boolean;
}

export type UserBookmarksQueryParams = PaginationParams;

export type PaginatedProjectsResponse = PaginatedResponse<Project>;

export function getProjects(
  params?: ProjectQueryParams,
  context: ApiRequestContext = {}
): Promise<PaginatedProjectsResponse> {
  return apiRequest<PaginatedProjectsResponse>(
    withQueryParams("/projects", params),
    context
  );
}

export function getProject(
  projectId: string,
  context: ApiRequestContext = {}
): Promise<Project> {
  return apiData<Project>(`/projects/${projectId}`, context);
}

export function getUserProjects(
  userId: string,
  params?: UserProjectsQueryParams,
  context: ApiRequestContext = {}
): Promise<PaginatedProjectsResponse> {
  return apiRequest<PaginatedProjectsResponse>(
    withQueryParams(`/users/${userId}/projects`, params),
    context
  );
}

export function getCurrentUserProjects(
  params?: UserProjectsQueryParams,
  context: ApiRequestContext = {}
): Promise<PaginatedProjectsResponse> {
  return getUserProjects("me", params, context);
}

export function getCurrentUserBookmarks(
  params?: UserBookmarksQueryParams,
  context: ApiRequestContext = {}
): Promise<PaginatedProjectsResponse> {
  return apiRequest<PaginatedProjectsResponse>(
    withQueryParams("/users/me/bookmarks", params),
    context
  );
}

export function createProject(input: CreateProjectInput): Promise<Project> {
  return apiData<Project>("/projects", {
    method: "POST",
    json: input,
  });
}

export function updateProject(
  projectId: string,
  input: UpdateProjectInput
): Promise<Project> {
  const {
    logoUrl: _omitLogoUrl,
    imagesUrls: _omitImagesUrls,
    ...payload
  } = input;

  return apiData<Project>(`/projects/${projectId}`, {
    method: "PATCH",
    json: payload,
  });
}

export function deleteProject(projectId: string): Promise<void> {
  return apiRequest<void>(`/projects/${projectId}`, {
    method: "DELETE",
  });
}

export function uploadProjectLogo(
  projectId: string,
  file: File
): Promise<Project> {
  const formData = new FormData();
  formData.append("file", file);

  return apiData<Project>(`/projects/${projectId}/logo`, {
    method: "PATCH",
    body: formData,
  });
}

export function addProjectImage(
  projectId: string,
  file: File
): Promise<Project> {
  const formData = new FormData();
  formData.append("file", file);

  return apiData<Project>(`/projects/${projectId}/images`, {
    method: "POST",
    body: formData,
  });
}

export function deleteProjectImage(
  projectId: string,
  imageUrl: string
): Promise<Project> {
  return apiData<Project>(`/projects/${projectId}/images`, {
    method: "DELETE",
    json: { url: imageUrl },
  });
}

export function claimProject(projectId: string): Promise<Project> {
  return apiData<Project>(`/projects/${projectId}/claims`, {
    method: "POST",
  });
}

export function addProjectBookmark(projectId: string): Promise<Project> {
  return apiData<Project>(`/projects/${projectId}/bookmarks`, {
    method: "POST",
  });
}

export function deleteProjectBookmark(projectId: string): Promise<void> {
  return apiRequest<void>(`/projects/${projectId}/bookmarks`, {
    method: "DELETE",
  });
}
