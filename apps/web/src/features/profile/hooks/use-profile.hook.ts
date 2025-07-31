import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useToastMutation } from "@/shared/hooks/use-toast-mutation";

import { getUserById, updateProfile } from "../services/profile.service";
import { ProfileSchema } from "../validations/profile.schema";

export const useProfile = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
};

/**
 * Hook to update the profile of the current user.
 *
 * @returns An object containing:
 * - updateProfile: function to trigger the profile update
 * - isUpdating: boolean indicating if the update is in progress
 * - isUpdateError: boolean indicating if an error occurred
 */
export const useProfileUpdate = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useToastMutation({
    mutationFn: ({
      updateData,
      avatarFile,
      shouldDeleteAvatar,
    }: {
      updateData: ProfileSchema;
      avatarFile?: File;
      shouldDeleteAvatar?: boolean;
    }) => updateProfile(updateData, avatarFile, shouldDeleteAvatar),
    loadingMessage: "Mise à jour de votre profil en cours...",
    successMessage: "Profil mis à jour avec succès",
    errorMessage: "Erreur lors de la mise à jour du profil",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user/me"] });
        router.push("/profile");
      },
    },
  });

  return {
    updateProfile: mutation.mutate,
    isUpdating: mutation.isPending,
    isUpdateError: mutation.isError,
  };
};
