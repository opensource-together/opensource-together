import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProject,
  getProjects,
  Project,
} from "../services/createProjectAPI";
import { getProjectDetails } from "../services/projectAPI";
import { ProjectInput } from "../types/ProjectInput";
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
 * Hook pour créer un projet
 * @param options Options additionnelles pour la mutation
 */
export function useCreateProject(options?: {
  onSuccess?: (data: Project) => void;
  onError?: (error: Error) => void;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProjectInput) => createProject(payload),
    onSuccess: (data) => {
      // Invalider le cache des projets pour forcer un rechargement
      // lors de la prochaine navigation vers la liste des projets
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      
      console.log("Création du projet réussie - data:", data);
      console.log("ID du projet:", data.id);
      
      // Rediriger vers la page du projet nouvellement créé 
      // sauf si un comportement personnalisé est défini
      if (options?.onSuccess) {
        console.log("Utilisation du callback onSuccess personnalisé");
        options.onSuccess(data);
      } else if (data.id) {
        console.log("Tentative de redirection vers:", `/projects/${data.id}`);
        // Utilise replace au lieu de push pour éviter des problèmes avec l'historique
        router.replace(`/projects/${data.id}`);
      } else {
        console.error("Impossible de rediriger - ID du projet manquant");
      }
    },
    onError: (error: Error) => {
      if (options?.onError) {
        options.onError(error);
      }
      // Ici on pourrait ajouter une gestion d'erreur par défaut
      console.error("Erreur lors de la création du projet:", error);
    },
  });
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
