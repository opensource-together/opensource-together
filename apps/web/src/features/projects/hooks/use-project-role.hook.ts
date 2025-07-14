import { useQueryClient } from "@tanstack/react-query";

import { useToastMutation } from "@/shared/hooks/use-toast-mutation";

import { roleService } from "../services/project-role.service";

/**
 * Hook to create a role
 * @returns createRole, isCreating, isCreateError
 */
export const useCreateRole = () => {
  const queryClient = useQueryClient();

  const mutation = useToastMutation({
    mutationFn: roleService.createRole,
    loadingMessage: "Création du rôle en cours...",
    successMessage: "Rôle créé avec succès",
    errorMessage: "Erreur lors de la création du rôle",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["project-roles"] });
      },
    },
  });

  return {
    createRole: mutation.mutate,
    isCreating: mutation.isPending,
    isCreateError: mutation.isError,
  };
};

/**
 * Hook to update a role
 * @returns updateRole, isUpdating, isUpdateError
 */
export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  const mutation = useToastMutation({
    mutationFn: roleService.updateRole,
    loadingMessage: "Modification du rôle en cours...",
    successMessage: "Rôle modifié avec succès",
    errorMessage: "Erreur lors de la modification du rôle",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["project-roles"] });
      },
    },
  });

  return {
    updateRole: mutation.mutate,
    isUpdating: mutation.isPending,
    isUpdateError: mutation.isError,
  };
};
