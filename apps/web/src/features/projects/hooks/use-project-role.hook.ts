import { useQueryClient } from "@tanstack/react-query";

import { useToastMutation } from "@/shared/hooks/use-toast-mutation";

import {
  createProjectRole,
  updateProjectRole,
} from "../services/project-role.service";
import {
  CreateProjectRoleSchema,
  UpdateProjectRoleSchema,
} from "../validations/project-role.schema";

/**
 * Handles the creation of a new role within a project.
 *
 * @param projectId - The ID of the project to which the role will be added.
 * @returns An object containing:
 * - createRole: function to trigger the role creation
 * - isCreating: boolean indicating if the creation is in progress
 * - isCreateError: boolean indicating if an error occurred
 */
export const useCreateRole = (projectId: string) => {
  const queryClient = useQueryClient();

  const mutation = useToastMutation({
    mutationFn: (data: CreateProjectRoleSchema) =>
      createProjectRole(projectId, data),
    loadingMessage: "Création du rôle en cours...",
    successMessage: "Rôle créé avec succès",
    errorMessage: "Erreur lors de la création du rôle",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["project", projectId] });
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
 * Handles the update of an existing role within a project.
 *
 * @param projectId - The ID of the project containing the role.
 * @param roleId - The ID of the role to update.
 * @returns An object containing:
 * - updateRole: function to trigger the role update
 * - isUpdating: boolean indicating if the update is in progress
 * - isUpdateError: boolean indicating if an error occurred
 */
export const useUpdateRole = (projectId: string, roleId: string) => {
  const queryClient = useQueryClient();

  const mutation = useToastMutation({
    mutationFn: (data: UpdateProjectRoleSchema) =>
      updateProjectRole(projectId, roleId, data),
    loadingMessage: "Modification du rôle en cours...",
    successMessage: "Rôle modifié avec succès",
    errorMessage: "Erreur lors de la modification du rôle",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      },
    },
  });

  return {
    updateRole: mutation.mutate,
    isUpdating: mutation.isPending,
    isUpdateError: mutation.isError,
  };
};
