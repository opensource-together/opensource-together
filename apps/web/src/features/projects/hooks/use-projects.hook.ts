import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useToastMutation } from "@/shared/hooks/use-toast-mutation";
import { getQueryClient } from "@/shared/lib/query-client";

import {
  createProject,
  getProjectDetails,
  getProjects,
  updateProject,
} from "../services/project.service";
import { Project } from "../types/project.type";

/**
 * Hook to get the list of projects
 * @returns projects
 */
export function useProjects() {
  return useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: getProjects,
  });
}

/**
 * Hook to fetch project details by projectId
 * @param projectId id of the project to fetch
 * @returns project
 */
export function useProject(projectId: string) {
  return useQuery<Project>({
    queryKey: ["project", projectId],
    queryFn: () => getProjectDetails(projectId),
    enabled: !!projectId,
  });
}

/**
 * Hook to create a project
 * @returns createProject, isCreating, isCreateError
 */
export function useCreateProject() {
  const router = useRouter();
  const queryClient = getQueryClient();

  const mutation = useToastMutation({
    mutationFn: createProject,
    loadingMessage: "Création du projet en cours...",
    successMessage: "Projet créé avec succès",
    errorMessage: "Erreur lors de la création du projet",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        router.push("/projects/create/success");
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
 * Hook to update a project (redirects after success)
 * @param projectId id of the project to update
 * @returns updateProject, isUpdating, isUpdateError
 */
export function useUpdateProject() {
  const router = useRouter();
  const queryClient = getQueryClient();

  const mutation = useToastMutation({
    mutationFn: updateProject,
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
 * Hook to update a project inline (no redirect, for edit mode)
 * @param onSuccess callback called after successful update
 * @returns updateProject, isUpdating, isUpdateError
 */
export function useUpdateProjectInline(onSuccess?: () => void) {
  const queryClient = getQueryClient();

  const mutation = useToastMutation({
    mutationFn: updateProject,
    loadingMessage: "Mise à jour du projet en cours...",
    successMessage: "Projet mis à jour avec succès",
    errorMessage: "Erreur lors de la mise à jour du projet",
    options: {
      onSuccess: (project) => {
        queryClient.invalidateQueries({ queryKey: ["project", project.id] });
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        onSuccess?.();
      },
    },
  });

  return {
    updateProject: mutation.mutate,
    isUpdating: mutation.isPending,
    isUpdateError: mutation.isError,
  };
}
