import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ProjectSchema } from "../schema/project.schema";
import { updateProject } from "../services/updateProjectAPI";

/**
 * Hook to update a project
 * @param projectId id of the project to update
 * @returns updateProject, isUpdating, isError
 */
export function useUpdateProject(projectId: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      data,
      projectId,
    }: {
      data: ProjectSchema;
      projectId: string;
    }) => updateProject(data, projectId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      router.push(`/projects/${data.id}`);
    },
    onError: (error: Error) => {
      console.error("Error updating project:", error);
    },
  });

  return {
    updateProject: mutation.mutate,
    isUpdating: mutation.isPending,
    isError: mutation.isError,
  };
}
