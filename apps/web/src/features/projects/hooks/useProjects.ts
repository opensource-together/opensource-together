import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProject,
  getProjects,
  Project,
} from "../services/createProjectAPI";
import { getProjectDetails } from "../services/projectAPI";
import { ProjectFormData } from "../schema/project.schema";
import { useRouter } from "next/navigation";

/**
 * Hook pour récupérer la liste des projets
 */
export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });
}

/**
 * Hook pour créer un projet avec une gestion simplifiée et robuste
 * @returns Fonctions et états pour gérer la création de projet
 */
export function useCreateProject() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: ProjectFormData) => createProject(payload),
    onSuccess: (data) => {
      // Invalider le cache des projets pour forcer un rechargement
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      
      // On log simplement pour le debug, à retirer en production
      console.log("Création du projet réussie - ID:", data.id);
      
      // Redirection vers la page du projet nouvellement créé
      if (data.id) {
        router.replace(`/projects/${data.id}`);
      } else {
        console.error("Redirection impossible - ID du projet manquant");
      }
    },
    onError: (error: Error) => {
      // Ici on pourrait intégrer un toast pour l'UI
      console.error("Erreur lors de la création du projet:", error);
    },
  });

  // Wrapper autour de mutate pour permettre des options supplémentaires
  const handleCreateProject = (
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
    createProject: handleCreateProject,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset
  };
}

/**
 * Hook to fetch project details by projectId
 * @param projectId Project id identifier
 */
export function useProject(projectId: string) {
  return useQuery<Project>({
    queryKey: ["project", projectId],
    queryFn: () => getProjectDetails(projectId),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
