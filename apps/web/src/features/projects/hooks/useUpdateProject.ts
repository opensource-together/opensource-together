import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProject } from "../services/updateProjectAPI";
import { ProjectFormData } from "../schema/project.schema";
import { useRouter } from "next/navigation";
import { useProject } from "./useProjects";

/**
 * Hook pour gérer l'édition d'un projet existant
 * Combine le chargement des données et la mise à jour
 * @param projectId Identifiant du projet à éditer
 * @returns Fonctions et états pour gérer l'édition
 */
export function useUpdateProject(projectId: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // Récupération des données du projet
  const { 
    data: project, 
    isLoading: isLoadingProject, 
    isError: isErrorProject, 
    error: projectError 
  } = useProject(projectId);
  
  // Mutation pour mettre à jour le projet
  const mutation = useMutation({
    mutationFn: (payload: ProjectFormData) => updateProject(projectId, payload),
    onSuccess: (data) => {
      // Invalider les queries concernées pour forcer un rechargement des données
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      
      // Log pour debug
      console.log("Mise à jour réussie - ID:", data.id);
      
      // Redirection vers la page du projet mis à jour
      if (data.id) {
        router.replace(`/projects/${data.id}`);
      } else {
        console.error("Redirection impossible - ID du projet manquant");
      }
    },
    onError: (error: Error) => {
      // Ici on pourrait intégrer un toast pour l'UI
      console.error("Erreur lors de la mise à jour du projet:", error);
    },
  });

  // État combiné de chargement et d'erreur
  const isLoading = isLoadingProject || mutation.isPending;
  const isError = isErrorProject || mutation.isError;
  const error = projectError || mutation.error;

  // Wrapper pour permettre des options supplémentaires
  const handleUpdateProject = (
    data: ProjectFormData, 
    options?: { onSuccess?: () => void; onError?: (error: Error) => void }
  ) => {
    mutation.mutate(data, {
      onSuccess: (responseData) => {
        if (options?.onSuccess) {
          options.onSuccess();
        }
      },
      onError: (error) => {
        if (options?.onError) {
          options.onError(error as Error);
        }
      }
    });
  };

  return {
    project,
    updateProject: handleUpdateProject,
    isLoading,
    isLoadingProject,
    isUpdating: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError,
    isErrorProject,
    isUpdateError: mutation.isError,
    error,
    projectError,
    updateError: mutation.error,
    reset: mutation.reset
  };
} 