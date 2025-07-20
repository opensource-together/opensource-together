import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useToastMutation } from "@/shared/hooks/use-toast-mutation";
import { getQueryClient } from "@/shared/lib/query-client";

import {
  createProject,
  deleteProject,
  getProjectDetails,
  getProjects,
  updateProject,
} from "../services/project.service";
import { ProjectFormData } from "../stores/project-create.store";
import { Project } from "../types/project.type";
import { UpdateProjectData } from "../validations/project.schema";

/**
 * Fetches the list of all projects.
 *
 * @returns A React Query result containing the list of projects.
 */
export function useProjects() {
  return useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: getProjects,
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
 * - createProject: function to trigger the project creation
 * - isCreating: boolean indicating if the creation is in progress
 * - isCreateError: boolean indicating if an error occurred
 */
export function useCreateProject() {
  const router = useRouter();
  const queryClient = getQueryClient();

  const mutation = useToastMutation({
    mutationFn: ({
      projectData,
      imageFile,
    }: {
      projectData: ProjectFormData;
      imageFile?: File;
    }) => createProject(projectData, imageFile),
    loadingMessage: "Création du projet en cours...",
    successMessage: "Projet créé avec succès",
    errorMessage: "Erreur lors de la création du projet",
    options: {
      onSuccess: (project) => {
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        router.push(`/projects/create/success?projectId=${project.id}`);
      },
    },
  });

  return {
    createProject: mutation.mutate,
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
      updateData,
      newImageFile,
      shouldDeleteImage,
    }: {
      updateData: UpdateProjectData;
      newImageFile?: File;
      shouldDeleteImage?: boolean;
    }) => updateProject(updateData, newImageFile, shouldDeleteImage),
    loadingMessage: "Mise à jour du projet en cours...",
    successMessage: "Projet mis à jour avec succès",
    errorMessage: "Erreur lors de la mise à jour du projet",
    options: {
      onSuccess: (project) => {
        queryClient.invalidateQueries({ queryKey: ["project", project.id] });
        router.push(`/projects/${project.id}`);
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
    loadingMessage: "Suppression du projet en cours...",
    successMessage: "Projet supprimé avec succès",
    errorMessage: "Erreur lors de la suppression du projet",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        router.push("/projects");
      },
    },
  });

  return {
    deleteProject: mutation.mutate,
    isDeleting: mutation.isPending,
    isDeleteError: mutation.isError,
  };
}
