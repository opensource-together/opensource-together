import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useToastMutation } from "@/shared/hooks/use-toast-mutation";
import { getQueryClient } from "@/shared/lib/query-client";

import {
  createProject,
  deleteProject,
  deleteProjectImage,
  getProjectDetails,
  getProjects,
  updateProject,
  updateProjectCover,
  updateProjectLogo,
} from "../services/project.service";
import { Project } from "../types/project.type";
import {
  ProjectSchema,
  UpdateProjectData,
} from "../validations/project.schema";

/**
 * Fetches the list of all projects.
 *
 * @param options - Optional query options
 * @returns A React Query result containing the list of projects.
 */
export function useProjects(options?: { enabled?: boolean }) {
  return useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: getProjects,
    enabled: options?.enabled,
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
        queryClient.invalidateQueries({ queryKey: ["user", "me", "projects"] });
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
        if (targetId) {
          queryClient.invalidateQueries({
            queryKey: ["user", "me", "projects"],
          });
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
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user", "me", "projects"] });
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

    onSuccess: (project, variables) => {
      const targetId = variables?.projectId;
      if (targetId) {
        const versionSuffix = `?t=${Date.now()}`;
        const baseUrl = (project?.logoUrl || "").split("?")[0];
        const versionedLogo = baseUrl ? `${baseUrl}${versionSuffix}` : null;

        const updateProjectLogoUrl = (
          old: Project | undefined
        ): Project | undefined =>
          old ? { ...old, logoUrl: versionedLogo } : old;

        queryClient.setQueryData(["project", targetId], updateProjectLogoUrl);
        queryClient.invalidateQueries({ queryKey: ["project", targetId] });
      }
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  return {
    updateProjectCover: mutation.mutate,
    isUpdateErrorCover: mutation.isError,
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
      queryClient.invalidateQueries({ queryKey: ["projects"] });
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
