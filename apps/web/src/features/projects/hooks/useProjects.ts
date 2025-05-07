import { useQuery, useMutation } from "@tanstack/react-query";
import { getProjects, createProject, Project } from "../services/createProjectAPI";
import { getProjectBySlug } from "../services/projectAPI";

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

/**
 * Hook to fetch project details by slug
 * @param slug Project slug identifier
 */
export function useProject(slug: string) {
  return useQuery<Project>({
    queryKey: ['project', slug],
    queryFn: () => getProjectBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
} 
