import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { getQueryClient } from "@/lib/queryClient";

import { useToastMutation } from "@/hooks/useToastMutation";

import {
  createProject,
  getProjectDetails,
  getProjects,
  updateProject,
} from "../services/projectAPI";
import { Project } from "../types/projectTypes";
import { UpdateProjectData } from "../validations/project.api.schema";

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
      onSuccess: (project) => {
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        router.push(`/projects/${project.id}`);
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
 * Hook to update a project
 * @param projectId id of the project to update
 * @returns updateProject, isUpdating, isUpdateError
 */
export function useUpdateProject() {
  const router = useRouter();
  const queryClient = getQueryClient();

  const mutation = useToastMutation({
    loadingMessage: "Mise à jour du projet en cours...",
    successMessage: "Projet mis à jour avec succès",
    errorMessage: "Erreur lors de la mise à jour du projet",
    mutationFn: (params: UpdateProjectData) => updateProject(params),
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
