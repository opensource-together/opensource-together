import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createProject,
  getProjects,
  Project,
} from "../services/createProjectAPI";
import { getProjectDetails } from "../services/projectAPI";

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
 */
export function useCreateProject() {
  return useMutation({
    mutationFn: (payload: Project) => createProject(payload),
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
