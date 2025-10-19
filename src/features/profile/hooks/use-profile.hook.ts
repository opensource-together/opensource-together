import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useToastMutation } from "@/shared/hooks/use-toast-mutation";

import {
  getUserById,
  updateProfile,
  updateProfileLogo,
} from "../services/profile.service";
import { Profile } from "../types/profile.type";
import { ProfileSchema } from "../validations/profile.schema";

/**
 * Hook to fetch the profile of a user by their ID.
 *
 * @param id - The ID of the user to fetch.
 * @returns A React Query result containing the user's profile.
 */
export const useProfile = (id: string) => {
  return useQuery({
    queryKey: ["users", id],
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
      id,
      updateData,
    }: {
      id: string;
      updateData: ProfileSchema;
    }) => updateProfile(id, updateData),
    loadingMessage: "Updating your profile...",
    successMessage: "Profil updated with success",
    errorMessage: "Error updating your profile",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users", "me"] });
        router.push("/profile/me");
      },
    },
  });

  return {
    updateProfile: mutation.mutate,
    updateProfileAsync: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    isUpdateError: mutation.isError,
  };
};

/**
 * * Hook to update the logo of a user by their ID.
 *
 * @param id - The ID of the user to update.
 * @param file - The file to update the logo with.
 * @returns An object containing:
 * - updateProfileLogo: function to trigger the logo update
 * - isUpdatingLogo: boolean indicating if the update is in progress
 * - isUpdateErrorLogo: boolean indicating if an error occurred
 */
export const useProfileLogoUpdate = (id: string) => {
  const queryClient = useQueryClient();

  const mutation = useToastMutation({
    mutationFn: (file: File) => updateProfileLogo(id, file),
    loadingMessage: "Updating your avatar...",
    successMessage: "Avatar updated successfully",
    errorMessage: "Error updating your avatar",
    options: {
      onSuccess: (data) => {
        const versionSuffix = `?t=${Date.now()}`;
        const baseUrl = data.image.split("?")[0];
        const versionedImage = `${baseUrl}${versionSuffix}`;

        // Busting the cache for the image url
        const updateImage = (old: Profile | undefined): Profile | undefined =>
          old ? { ...old, image: versionedImage } : old;

        queryClient.setQueryData(["user", "me"], updateImage);

        queryClient.invalidateQueries({ queryKey: ["user", "me"] });
      },
    },
  });

  return {
    updateProfileLogo: mutation.mutate,
    isUpdatingLogo: mutation.isPending,
    isUpdateErrorLogo: mutation.isError,
  };
};
