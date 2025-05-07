import { useQuery, useMutation } from "@tanstack/react-query";
import { getProjects, createProject, Project } from "../services/createProjectAPI";

/**
 * Hook pour récupérer la liste des projets
 */
export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: getProjects
  });
}

/**
 * Hook pour créer un projet
 */
export function useCreateProject() {
  return useMutation({
    mutationFn: (payload: Project) => createProject(payload)
  });
}
