import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProject } from "../services/updateProjectAPI";
import { ProjectFormData } from "../schema/project.schema";
import { useRouter } from "next/navigation";
import { useProject } from "./useProjects";

/**
 * Hook pour gérer l'édition d'un projet existant
 * @param projectId Identifiant du projet à éditer
 * @returns Fonctions et états pour gérer l'édition
 */
export function useUpdateProject(projectId: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // Récupération des données du projet
  const { data: project, isLoading, isError, error } = useProject(projectId);
  
  // Mutation pour mettre à jour le projet
  const mutation = useMutation({
    mutationFn: (payload: ProjectFormData) => updateProject(projectId, payload),
    onSuccess: (data) => {
      // Invalider uniquement la query concernée
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      
      // Redirection vers la page du projet mis à jour
      if (data.id) {
        router.replace(`/projects/${data.id}`);
      } else {
        console.error("Redirection impossible - ID du projet manquant");
      }
    },
    onError: (error: Error) => {
      console.error("Erreur lors de la mise à jour du projet:", error);
    },
  });

  return {
    project,
    updateProject: (data: ProjectFormData) => mutation.mutate(data),
    isLoading: isLoading || mutation.isPending,
    isUpdating: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: isError || mutation.isError,
    error: error || mutation.error
  };
} 