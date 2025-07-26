import { useQueryClient } from "@tanstack/react-query";

import { useToastMutation } from "@/shared/hooks/use-toast-mutation";

import { updateProfile, UpdateProfileOptions } from "../services/profile.service";

/**
 * Hook to update a profile
 * @returns An object containing:
 * - updateProfile: function to trigger the update
 * - isUpdating: boolean indicating if the update is in progress
 * - isUpdateError: boolean indicating if an error occurred
 */
export function useProfileUpdate() {
  const queryClient = useQueryClient();

  const mutation = useToastMutation({
    mutationFn: (options: UpdateProfileOptions) => updateProfile(options),
    loadingMessage: "Mise à jour de votre profil en cours...",
    successMessage: "Votre profil a été mis à jour avec succès !",
    errorMessage: "Erreur lors de la mise à jour de votre profil",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["profile"],
        });
      },
    },
  });

  return {
    updateProfile: mutation.mutate,
    isUpdating: mutation.isPending,
    isUpdateError: mutation.isError,
  };
}
