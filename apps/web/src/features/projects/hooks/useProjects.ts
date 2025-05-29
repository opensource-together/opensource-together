import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { getQueryClient } from "@/lib/queryClient";

import { ProjectSchema } from "../schema/project.schema";
import { createProject } from "../services/createProjectAPI";
import { getProjectDetails, getProjects } from "../services/projectAPI";
import { updateProject } from "../services/updateProjectAPI";
import { Project } from "../types/projectTypes";

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
 * @returns createProject, isPending, isSuccess, isError, error, reset
 */
export function useCreateProject() {
  const router = useRouter();
  const queryClient = getQueryClient();
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

/**
 * Hook to update a project
 * @param projectId id of the project to update
 * @returns updateProject, isUpdating, isError
 */
export function useUpdateProject(projectId: string) {
  const router = useRouter();
  const queryClient = getQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      data,
      projectId,
    }: {
      data: ProjectSchema;
      projectId: string;
    }) => {
      toast.loading("Mise à jour du projet en cours...");
      return updateProject(data, projectId);
    },
    onSuccess: (data) => {
      toast.dismiss();
      toast.success("Projet mis à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      router.push(`/projects/${data.id}`);
    },
    onError: (error: Error) => {
      toast.dismiss();
      toast.error("Erreur lors de la mise à jour du projet");
      console.error("Error updating project:", error);
    },
  });

  return {
    updateProject: mutation.mutate,
    isUpdating: mutation.isPending,
    isError: mutation.isError,
  };
}
