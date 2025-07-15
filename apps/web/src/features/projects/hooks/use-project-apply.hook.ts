import { useQueryClient } from "@tanstack/react-query";

import { useToastMutation } from "@/shared/hooks/use-toast-mutation";

import { applyToProjectRole } from "../services/project-apply.service";
import { ProjectRoleApplicationInput } from "../types/project-apply-role.type";

export function useApplyToProject(projectId: string, roleId: string) {
  const queryClient = useQueryClient();

  const mutation = useToastMutation<void, Error, ProjectRoleApplicationInput>({
    mutationFn: (data: ProjectRoleApplicationInput) =>
      applyToProjectRole(projectId, roleId, data),
    loadingMessage: "Envoi de votre candidature en cours...",
    successMessage: "Votre candidature a été envoyée avec succès !",
    errorMessage: "Erreur lors de l'envoi de votre candidature",
    options: {
      onSuccess: () => {
        // Invalidate project data to refresh roles application status if needed
        queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      },
    },
  });

  return {
    applyToProject: mutation.mutate,
    isApplying: mutation.isPending,
    isApplyError: mutation.isError,
  };
}
