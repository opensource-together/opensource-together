import type { ProjectQueryParams } from "../services/project.service";

export const projectKeys = {
  all: ["projects"] as const,
  lists: () => [...projectKeys.all, "list"] as const,
  infiniteList: (params: Omit<ProjectQueryParams, "page">) =>
    [...projectKeys.lists(), "infinite", params] as const,
  details: () => [...projectKeys.all, "detail"] as const,
  detail: (projectId: string) => [...projectKeys.details(), projectId] as const,
  repositorySummary: (projectId: string) =>
    [...projectKeys.detail(projectId), "repository-summary"] as const,
};

export const projectMutationKeys = {
  create: () => ["projects", "create"] as const,
  update: () => ["projects", "update"] as const,
  delete: () => ["projects", "delete"] as const,
  togglePublished: () => ["projects", "toggle-published"] as const,
  updateLogo: () => ["projects", "update-logo"] as const,
  addCover: () => ["projects", "add-cover"] as const,
  deleteImage: () => ["projects", "delete-image"] as const,
  claim: () => ["projects", "claim"] as const,
  bookmark: () => ["projects", "bookmark"] as const,
  removeBookmark: () => ["projects", "remove-bookmark"] as const,
};
