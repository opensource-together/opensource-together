import { useQueryClient } from "@tanstack/react-query";

import { useToastMutation } from "@/shared/hooks/use-toast-mutation";

import { applyToProjectRole } from "../services/project-apply.service";
import { RoleApplicationSchema } from "../validations/project-apply.schema";

/**
 * Hook to apply to a project
 * @param projectId - The ID of the project
 * @param roleId - The ID of the role
 * @param data - The data of the application
 * @returns An object containing:
 * - applyToProject: function to trigger the application
 * - isApplying: boolean indicating if the application is in progress
 * - isApplyError: boolean indicating if an error occurred
 */
export function useApplyToProject(projectId: string, roleId: string) {
  const queryClient = useQueryClient();

  const mutation = useToastMutation({
    mutationFn: (data: RoleApplicationSchema) =>
      applyToProjectRole(projectId, roleId, data),
    loadingMessage: "Envoi de votre candidature en cours...",
    successMessage: "Votre candidature a été envoyée avec succès !",
    errorMessage: "Erreur lors de l'envoi de votre candidature",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["project-applications", projectId],
        });
      },
    },
  });

  return {
    applyToProject: mutation.mutate,
    isApplying: mutation.isPending,
    isApplyError: mutation.isError,
  };
}
