import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { roleService } from "../services/role.service";
import { useRoleCreateStore } from "../stores/role-create.store";

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
