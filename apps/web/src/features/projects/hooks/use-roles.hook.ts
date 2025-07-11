import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { roleService } from "../services/role.service";

export const useCreateRole = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: roleService.createRole,
    onSuccess: (response) => {
      // Show success toast
      toast.success(response.message);

      // Invalidate project queries to refetch with new role
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      // Call optional success callback
      onSuccess?.();
    },
    onError: (error: Error) => {
      // Show error toast
      toast.error(error.message || "Erreur lors de la création du rôle");
    },
  });
};

export const useUpdateRole = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: roleService.updateRole,
    onSuccess: (response) => {
      // Show success toast
      toast.success(response.message);

      // Invalidate project queries to refetch with updated role
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      // Also invalidate specific project query
      queryClient.invalidateQueries({
        queryKey: ["project"],
      });

      // Call optional success callback
      onSuccess?.();
    },
    onError: (error: Error) => {
      // Show error toast
      toast.error(error.message || "Erreur lors de la modification du rôle");
    },
  });
};
