import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { useToastMutation } from "@/shared/hooks/use-toast-mutation";
import { getQueryClient } from "@/shared/lib/query-client";

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
  options?: { enabled?: boolean; maxTotalItems?: number }
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
 *
 * @returns An object containing:
 * - createProjectAsync: function to trigger the project creation
 * - isCreating: boolean indicating if the creation is in progress
 * - isCreateError: boolean indicating if an error occurred
 */
export function useCreateProject() {
  const router = useRouter();
  const queryClient = getQueryClient();

  const mutation = useToastMutation({
    mutationFn: (data: ProjectSchema) => createProject(data),
    loadingMessage: "Creating project in progress...",
    successMessage: "Project created successfully",
    errorMessage: "Error while creating project",
    options: {
      onSuccess: (project) => {
        const ownerId = project.owner?.id;

        queryClient.invalidateQueries({
          queryKey: ["user", "me", "projects"],
        });

        if (ownerId) {
          queryClient.invalidateQueries({
            queryKey: ["user", ownerId, "projects"],
          });
        }

        queryClient.invalidateQueries({ queryKey: ["user"], exact: false });
        queryClient.invalidateQueries({ queryKey: ["projects-infinite"] });
        queryClient.invalidateQueries({ queryKey: ["project", project.id] });
        router.push(`/projects/create/success?projectId=${project.id}`);
      },
    },
  });

  return {
    createProjectAsync: mutation.mutateAsync,
    isCreating: mutation.isPending,
    isCreateError: mutation.isError,
  };
}

/**
 * Handles the update of an existing project.
 *
 * @returns An object containing:
 * - updateProject: function to trigger the project update
 * - isUpdating: boolean indicating if the update is in progress
 * - isUpdateError: boolean indicating if an error occurred
 */
export function useUpdateProject() {
  const router = useRouter();
  const queryClient = getQueryClient();

  const mutation = useToastMutation({
    mutationFn: ({
      id,
      updateData,
    }: {
      id: string;
      updateData: UpdateProjectData;
    }) => updateProject(id, updateData),
    loadingMessage: "Updating project in progress...",
    successMessage: "Project updated successfully",
    errorMessage: "Error while updating project",
    options: {
      onSuccess: (project, variables) => {
        const targetId = project?.publicId || variables?.id;
        const ownerId = project?.owner?.id;

        if (targetId) {
          queryClient.invalidateQueries({
            queryKey: ["user", "me", "projects"],
          });

          if (ownerId) {
            queryClient.invalidateQueries({
              queryKey: ["user", ownerId, "projects"],
            });
          }

          queryClient.invalidateQueries({ queryKey: ["user"], exact: false });
          queryClient.invalidateQueries({ queryKey: ["projects-infinite"] });
          queryClient.invalidateQueries({ queryKey: ["project", targetId] });
          router.push(`/projects/${targetId}`);
        }
      },
    },
  });

  return {
    updateProject: mutation.mutate,
    isUpdating: mutation.isPending,
    isUpdateError: mutation.isError,
  };
}

/**
 * Handles the deletion of a project.
 *
 * @returns An object containing:
 * - deleteProject: function to trigger the project deletion
 * - isDeleting: boolean indicating if the deletion is in progress
 * - isDeleteError: boolean indicating if an error occurred
 */
export function useDeleteProject() {
  const router = useRouter();
  const queryClient = getQueryClient();

  const mutation = useToastMutation({
    mutationFn: (projectId: string) => deleteProject(projectId),
    loadingMessage: "Deleting project in progress...",
    successMessage: "Project deleted successfully",
    errorMessage: "Error while deleting project",
    options: {
      onSuccess: (_, projectId) => {
        queryClient.invalidateQueries({
          queryKey: ["user", "me", "projects"],
        });

        queryClient.invalidateQueries({ queryKey: ["user"], exact: false });
        queryClient.invalidateQueries({ queryKey: ["projects-infinite"] });
        queryClient.invalidateQueries({ queryKey: ["project", projectId] });
        router.push("/dashboard/my-projects");
      },
    },
  });

  return {
    deleteProject: mutation.mutate,
    isDeleting: mutation.isPending,
    isDeleteError: mutation.isError,
  };
}

/**
 * Toggles the published state of a project.
 */
export function useToggleProjectPublished() {
  const queryClient = getQueryClient();

  const mutation = useToastMutation({
    mutationFn: ({
      project,
      published,
    }: {
      project: Project;
      published: boolean;
    }) => {
      return updateProjectPublishedStatus(project.id || "", project, published);
    },
    loadingMessage: "Updating project visibility...",
    successMessage: "Project visibility updated",
    errorMessage: "Failed to update project visibility",
    options: {
      onSuccess: (_, variables) => {
        const targetId = variables.project.id || "";
        const ownerId = variables.project.owner?.id;

        if (targetId) {
          queryClient.invalidateQueries({ queryKey: ["project", targetId] });
        }

        queryClient.invalidateQueries({
          queryKey: ["user", "me", "projects"],
        });

        if (ownerId) {
          queryClient.invalidateQueries({
            queryKey: ["user", ownerId, "projects"],
          });
        }

        queryClient.invalidateQueries({ queryKey: ["user"], exact: false });
        queryClient.invalidateQueries({ queryKey: ["projects-infinite"] });
      },
    },
  });

  const toggleProjectPublished = (
    variables: { project: Project; published: boolean },
    options?: any
  ) => {
    if (variables.published) {
      const validation = validateProjectForPublishing(variables.project);
      if (!validation.isValid) {
        toast.error(formatMissingFieldsMessage(validation.missingFields));
        return;
      }
    }

    mutation.mutate(variables, options);
  };

  return {
    toggleProjectPublished,
    toggleProjectPublishedAsync: mutation.mutateAsync,
    isTogglingPublished: mutation.isPending,
  };
}

/**
 * Handles the update of the logo of a project.
 *
 * @returns An object containing:
 * - updateProjectLogo: function to trigger the project logo update
 * - isUpdatingLogo: boolean indicating if the update is in progress
 * - isUpdateErrorLogo: boolean indicating if an error occurred
 */
export function useUpdateProjectLogo() {
  const queryClient = getQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      projectId,
      logoFile,
    }: {
      projectId: string;
      logoFile: File;
    }) => updateProjectLogo(projectId, logoFile),

    onSuccess: (projectId) => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects-infinite"] });
      queryClient.invalidateQueries({
        queryKey: ["user", "me", "projects"],
      });
    },
  });

  return {
    updateProjectLogo: mutation.mutate,
    isUpdateErrorLogo: mutation.isError,
  };
}

/**
 * Handles the update of the cover image of a project.
 *
 * @returns An object containing:
 * - updateProjectCover: function to trigger the project cover update
 * - isUpdateErrorCover: boolean indicating if an error occurred
 */
export function useUpdateProjectCover() {
  const queryClient = getQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      projectId,
      coverFile,
    }: {
      projectId: string;
      coverFile: File;
    }) => updateProjectCover(projectId, coverFile),
    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({ queryKey: ["projects-infinite"] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
  });

  return {
    updateProjectCover: mutation.mutate,
    isUpdateErrorCover: mutation.isError,
  };
}

interface UseProjectBookmarkOptions {
  projectId: string;
  initialIsBookmarked?: boolean;
}

export function useProjectBookmark({
  projectId,
  initialIsBookmarked = false,
}: UseProjectBookmarkOptions) {
  const queryClient = getQueryClient();
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);

  useEffect(() => {
    setIsBookmarked(initialIsBookmarked);
  }, [initialIsBookmarked]);

  const bookmarkMutation = useToastMutation({
    mutationFn: (projectId: string) => bookmarkProject(projectId),
    loadingMessage: "Adding bookmark...",
    successMessage: "Project bookmarked",
    errorMessage: "Failed to bookmark project",
    options: {
      onSuccess: () => {
        setIsBookmarked(true);
        queryClient.invalidateQueries({ queryKey: ["project", projectId] });
        queryClient.invalidateQueries({
          queryKey: ["user", "me", "bookmarks"],
        });
      },
    },
  });

  const removeBookmarkMutation = useToastMutation({
    mutationFn: (projectId: string) => removeProjectBookmark(projectId),
    loadingMessage: "Removing bookmark...",
    successMessage: "Bookmark removed",
    errorMessage: "Failed to remove bookmark",
    options: {
      onSuccess: () => {
        setIsBookmarked(false);
        queryClient.invalidateQueries({ queryKey: ["project", projectId] });
        queryClient.invalidateQueries({
          queryKey: ["user", "me", "bookmarks"],
        });
      },
    },
  });

  const { mutate: addBookmarkMutate, isPending: isAddingBookmark } =
    bookmarkMutation;
  const { mutate: removeBookmarkMutate, isPending: isRemovingBookmark } =
    removeBookmarkMutation;

  const toggleBookmark = useCallback(() => {
    if (!projectId || isAddingBookmark || isRemovingBookmark) {
      return;
    }

    if (isBookmarked) {
      removeBookmarkMutate(projectId);
    } else {
      addBookmarkMutate(projectId);
    }
  }, [
    addBookmarkMutate,
    isBookmarked,
    isAddingBookmark,
    projectId,
    removeBookmarkMutate,
    isRemovingBookmark,
  ]);

  const isBookmarking = isAddingBookmark || isRemovingBookmark;

  return {
    toggleBookmark,
    isBookmarked,
    isBookmarking,
  };
}

/**
 * Handles deletion of a specific project cover image by URL.
 *
 * @returns An object containing:
 * - deleteProjectImage: function to trigger the project cover image deletion
 * - isDeleteProjectImageError: boolean indicating if an error occurred
 */
export function useDeleteProjectImage() {
  const queryClient = getQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      projectId,
      imageUrl,
    }: {
      projectId: string;
      imageUrl: string;
    }) => deleteProjectImage(projectId, imageUrl),
    onSuccess: (_project, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects-infinite"] });
      if (variables?.projectId) {
        queryClient.invalidateQueries({
          queryKey: ["project", variables.projectId],
        });
      }
    },
  });

  return {
    deleteProjectImage: mutation.mutate,
    isDeleteProjectImageError: mutation.isError,
  };
}

/**
 * Handles claiming a project ownership.
 */
export function useClaimProject(projectId: string) {
  const queryClient = getQueryClient();

  const mutation = useToastMutation<Project, Error, void>({
    mutationFn: () => claimProject(projectId),
    loadingMessage: "Claiming project...",
    successMessage: "Project claimed successfully",
    errorMessage: "Failed to claim project",
    options: {
      onSuccess: (project) => {
        const targetId = project?.publicId || projectId;
        if (targetId) {
          queryClient.setQueryData(["project", targetId], project);
          queryClient.invalidateQueries({ queryKey: ["project", targetId] });
        }
        queryClient.invalidateQueries({ queryKey: ["projects-infinite"] });
        queryClient.invalidateQueries({
          queryKey: ["user", "me", "projects"],
        });
      },
    },
  });

  return {
    claimProject: mutation.mutate,
    claimProjectAsync: mutation.mutateAsync,
    isClaiming: mutation.isPending,
    isClaimError: mutation.isError,
  };
}
