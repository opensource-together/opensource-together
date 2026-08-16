import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

import {
  bookmarkProject,
  claimProject,
  createProject,
  deleteProject,
  deleteProjectImage,
  getProjectDetails,
  getProjects,
  type PaginatedProjectsResponse,
  type ProjectQueryParams,
  removeProjectBookmark,
  updateProject,
  updateProjectCover,
  updateProjectLogo,
  updateProjectPublishedStatus,
} from "../services/project.service";
import type { Project } from "../types/project.type";
import type {
  ProjectSchema,
  UpdateProjectData,
} from "../validations/project.schema";
import {
  formatMissingFieldsMessage,
  validateProjectForPublishing,
} from "../validations/publish-toggle.validation";

/**
 * Get projects in a paginated way in infinite scroll mode.
 * @param params - Filters (except page, which is controlled by useInfiniteQuery)
 * @param options - Options React Query (e.g., enabled)
 */
export function useInfiniteProjects(
  params: Omit<ProjectQueryParams, "page"> = {},
  options?: {
    enabled?: boolean;
    maxTotalItems?: number;
  }
) {
  const per_page = params.per_page ?? 20;
  const queryParams = { ...params, per_page };
  const maxPageLimit =
    options?.maxTotalItems && options.maxTotalItems > 0
      ? Math.ceil(options.maxTotalItems / per_page)
      : undefined;

  return useInfiniteQuery<PaginatedProjectsResponse>({
    queryKey: ["projects-infinite", queryParams],
    queryFn: async ({ pageParam }) =>
      getProjects({
        ...queryParams,
        page: typeof pageParam === "number" ? pageParam : 1,
      }),
    initialPageParam: 1,
    enabled: options?.enabled ?? true,
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      if (!pagination) return undefined;
      const canHaveMoreByServer = pagination.currentPage < pagination.lastPage;
      const canHaveMoreByLimit = maxPageLimit
        ? pagination.currentPage < maxPageLimit
        : true;
      return canHaveMoreByServer && canHaveMoreByLimit
        ? pagination.currentPage + 1
        : undefined;
    },
  });
}

/**
 * Fetches the details of a specific project by ID.
 *
 * @param projectId - The ID of the project to retrieve.
 * @returns A React Query result containing the project details.
 */
export function useProject(projectId: string) {
  return useQuery<Project>({
    queryKey: ["project", projectId],
    queryFn: () => getProjectDetails(projectId),
    enabled: !!projectId,
  });
}

/**
 * Handles the creation of a new project.
 * Returns the standard TanStack Query mutation result.
 */
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProjectSchema) => createProject(data),
    onSuccess: async (project) => {
      const ownerId = project.owner?.id;

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["user", "me", "projects"],
        }),
        ...(ownerId
          ? [
              queryClient.invalidateQueries({
                queryKey: ["user", ownerId, "projects"],
              }),
            ]
          : []),
        queryClient.invalidateQueries({ queryKey: ["user"], exact: false }),
        queryClient.invalidateQueries({ queryKey: ["projects-infinite"] }),
        queryClient.invalidateQueries({
          queryKey: ["project", project.id],
        }),
      ]);
    },
  });
}

/**
 * Handles the update of an existing project.
 * Returns the standard TanStack Query mutation result.
 */
export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updateData,
    }: {
      id: string;
      updateData: UpdateProjectData;
    }) => updateProject(id, updateData),
    onSuccess: async (project, variables) => {
      const targetId = project?.publicId || variables.id;
      const ownerId = project?.owner?.id;

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["user", "me", "projects"],
        }),
        ...(ownerId
          ? [
              queryClient.invalidateQueries({
                queryKey: ["user", ownerId, "projects"],
              }),
            ]
          : []),
        queryClient.invalidateQueries({ queryKey: ["user"], exact: false }),
        queryClient.invalidateQueries({ queryKey: ["projects-infinite"] }),
        queryClient.invalidateQueries({ queryKey: ["project", targetId] }),
      ]);
    },
  });
}

/**
 * Handles the deletion of a project.
 * Returns the standard TanStack Query mutation result.
 */
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => deleteProject(projectId),
    onSuccess: async (_, projectId) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["user", "me", "projects"],
        }),
        queryClient.invalidateQueries({ queryKey: ["user"], exact: false }),
        queryClient.invalidateQueries({ queryKey: ["projects-infinite"] }),
        queryClient.invalidateQueries({ queryKey: ["project", projectId] }),
      ]);
    },
  });
}

/**
 * Toggles the published state of a project.
 */
export function useToggleProjectPublished() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      project,
      published,
    }: {
      project: Project;
      published: boolean;
    }) => {
      if (published) {
        const validation = validateProjectForPublishing(project);
        if (!validation.isValid) {
          throw new Error(formatMissingFieldsMessage(validation.missingFields));
        }
      }

      return updateProjectPublishedStatus(project.id || "", project, published);
    },
    onSuccess: async (_, variables) => {
      const targetId = variables.project.id || "";
      const ownerId = variables.project.owner?.id;

      await Promise.all([
        ...(targetId
          ? [
              queryClient.invalidateQueries({
                queryKey: ["project", targetId],
              }),
            ]
          : []),
        queryClient.invalidateQueries({
          queryKey: ["user", "me", "projects"],
        }),
        ...(ownerId
          ? [
              queryClient.invalidateQueries({
                queryKey: ["user", ownerId, "projects"],
              }),
            ]
          : []),
        queryClient.invalidateQueries({ queryKey: ["user"], exact: false }),
        queryClient.invalidateQueries({ queryKey: ["projects-infinite"] }),
      ]);
    },
  });
}

/**
 * Handles the update of the logo of a project.
 * Returns the standard TanStack Query mutation result.
 */
export function useUpdateProjectLogo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      logoFile,
    }: {
      projectId: string;
      logoFile: File;
    }) => updateProjectLogo(projectId, logoFile),

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["project", variables.projectId],
        }),
        queryClient.invalidateQueries({ queryKey: ["projects-infinite"] }),
        queryClient.invalidateQueries({
          queryKey: ["user", "me", "projects"],
        }),
      ]);
    },
  });
}

/**
 * Handles the update of the cover image of a project.
 * Returns the standard TanStack Query mutation result.
 */
export function useUpdateProjectCover() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      coverFile,
    }: {
      projectId: string;
      coverFile: File;
    }) => updateProjectCover(projectId, coverFile),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["projects-infinite"] }),
        queryClient.invalidateQueries({
          queryKey: ["project", variables.projectId],
        }),
      ]);
    },
  });
}

interface UseProjectBookmarkOptions {
  projectId: string;
  initialIsBookmarked?: boolean;
}

export function useProjectBookmark({
  projectId,
  initialIsBookmarked = false,
}: UseProjectBookmarkOptions) {
  const queryClient = useQueryClient();
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);

  useEffect(() => {
    setIsBookmarked(initialIsBookmarked);
  }, [initialIsBookmarked]);

  const bookmarkMutation = useMutation({
    mutationFn: (projectId: string) => bookmarkProject(projectId),
    onSuccess: async () => {
      setIsBookmarked(true);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["project", projectId] }),
        queryClient.invalidateQueries({
          queryKey: ["user", "me", "bookmarks"],
        }),
      ]);
    },
  });

  const removeBookmarkMutation = useMutation({
    mutationFn: (projectId: string) => removeProjectBookmark(projectId),
    onSuccess: async () => {
      setIsBookmarked(false);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["project", projectId] }),
        queryClient.invalidateQueries({
          queryKey: ["user", "me", "bookmarks"],
        }),
      ]);
    },
  });

  const toggleBookmarkAsync = useCallback(async () => {
    if (
      !projectId ||
      bookmarkMutation.isPending ||
      removeBookmarkMutation.isPending
    ) {
      return false;
    }

    if (isBookmarked) {
      await removeBookmarkMutation.mutateAsync(projectId);
    } else {
      await bookmarkMutation.mutateAsync(projectId);
    }
    return true;
  }, [
    bookmarkMutation.isPending,
    bookmarkMutation.mutateAsync,
    isBookmarked,
    projectId,
    removeBookmarkMutation.isPending,
    removeBookmarkMutation.mutateAsync,
  ]);

  const isBookmarking =
    bookmarkMutation.isPending || removeBookmarkMutation.isPending;

  return {
    toggleBookmarkAsync,
    isBookmarked,
    isBookmarking,
  };
}

/**
 * Handles deletion of a specific project cover image by URL.
 * Returns the standard TanStack Query mutation result.
 */
export function useDeleteProjectImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      imageUrl,
    }: {
      projectId: string;
      imageUrl: string;
    }) => deleteProjectImage(projectId, imageUrl),
    onSuccess: async (_project, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["projects-infinite"] }),
        queryClient.invalidateQueries({
          queryKey: ["project", variables.projectId],
        }),
      ]);
    },
  });
}

/**
 * Handles claiming project ownership.
 */
export function useClaimProject(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation<Project, Error, void>({
    mutationFn: () => claimProject(projectId),
    onSuccess: async (project) => {
      const targetId = project?.publicId || projectId;
      queryClient.setQueryData(["project", targetId], project);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["project", targetId] }),
        queryClient.invalidateQueries({ queryKey: ["projects-infinite"] }),
        queryClient.invalidateQueries({
          queryKey: ["user", "me", "projects"],
        }),
      ]);
    },
  });
}
