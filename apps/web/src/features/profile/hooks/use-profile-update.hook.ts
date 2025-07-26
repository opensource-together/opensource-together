import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useToastMutation } from "@/shared/hooks/use-toast-mutation";

import { updateProfile } from "../services/profile.service";
import { ProfileSchema } from "../validations/profile.schema";

/**
 * Hook to update a profile
 * @param id - The ID of the profile
 * @param data - The data of the profile
 * @returns An object containing:
 * - updateProfile: function to trigger the update
 * - isUpdating: boolean indicating if the update is in progress
 * - isUpdateError: boolean indicating if an error occurred
 */
export function useProfileUpdate() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useToastMutation({
    mutationFn: (data: ProfileSchema) => updateProfile(data),
    loadingMessage: "Mise à jour de votre profil en cours...",
    successMessage: "Votre profil a été mis à jour avec succès !",
    errorMessage: "Erreur lors de la mise à jour de votre profil",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["user/me"],
        });
        router.push("/profile");
      },
    },
  });

  return {
    updateProfile: mutation.mutate,
    isUpdating: mutation.isPending,
    isUpdateError: mutation.isError,
  };
}
