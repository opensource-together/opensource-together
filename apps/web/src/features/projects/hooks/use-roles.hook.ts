import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { roleService } from "../services/role.service";
import { useRoleCreateStore } from "../stores/role-create.store";
import { useRoleEditStore } from "../stores/role-edit.store";

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  const { setCreatedRole, setDialogOpen, resetStore } = useRoleCreateStore();

  return useMutation({
    mutationFn: roleService.createRole,
    onSuccess: (response) => {
      // Update store with created role
      setCreatedRole(response.role);

      // Show success toast
      toast.success(response.message);

      // Close dialog
      setDialogOpen(false);

      // Invalidate project queries to refetch with new role
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      // Reset store after a short delay
      setTimeout(() => {
        resetStore();
      }, 100);
    },
    onError: (error: Error) => {
      // Show error toast
      toast.error(error.message || "Erreur lors de la création du rôle");
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  const { setUpdatedRole, setDialogOpen, resetStore } = useRoleEditStore();

  return useMutation({
    mutationFn: roleService.updateRole,
    onSuccess: (response) => {
      // Update store with updated role
      setUpdatedRole(response.role);

      // Show success toast
      toast.success(response.message);

      // Close dialog
      setDialogOpen(false);

      // Invalidate project queries to refetch with updated role
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      // Also invalidate specific project query if we have projectId
      // This ensures the project detail page updates immediately
      queryClient.invalidateQueries({
        queryKey: ["project"],
      });

      // Reset store after a short delay
      setTimeout(() => {
        resetStore();
      }, 100);
    },
    onError: (error: Error) => {
      // Show error toast
      toast.error(error.message || "Erreur lors de la modification du rôle");
    },
  });
};
