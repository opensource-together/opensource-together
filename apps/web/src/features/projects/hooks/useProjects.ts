import { createProject } from "../services/createProjectAPI";
import { getProjectDetails, getProjects } from "../services/projectAPI";
import { Project } from "../types/projectTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

/**
 * Hook to get the list of projects
 * @returns projects
 */
export function useProjects() {
  return useQuery({
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
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to create a project
 * @returns createProject, isPending, isSuccess, isError, error, reset
 */
export function useCreateProject() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createProject,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      router.push(`/projects/${data.id}`);
    },
    onError: (error: Error) => {
      console.error("Error while creating the project:", error);
    },
  });

  return {
    createProject: mutation.mutate,
    isCreating: mutation.isPending,
    isError: mutation.isError,
  };
}
