import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useToastMutation } from "@/shared/hooks/use-toast-mutation";

import {
  getUserById,
  getUserPullRequests,
  updateProfile,
  updateProfileLogo,
} from "../services/profile.service";
import {
  Profile,
  PullRequestQueryParams,
  PullRequestsResponse,
} from "../types/profile.type";
import { ProfileSchema } from "../validations/profile.schema";

/**
 * Hook to fetch the profile of a user by their ID.
 *
 * @param id - The ID of the user to fetch.
 * @returns A React Query result containing the user's profile.
 */
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
      id,
      updateData,
      avatarFile,
      shouldDeleteAvatar,
    }: {
      id: string;
      updateData: ProfileSchema;
      avatarFile?: File;
      shouldDeleteAvatar?: boolean;
    }) => updateProfile(id, updateData, avatarFile, shouldDeleteAvatar),
    loadingMessage: "Mise à jour de votre profil en cours...",
    successMessage: "Profil mis à jour avec succès",
    errorMessage: "Erreur lors de la mise à jour du profil",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user/me"] });
        router.push("/profile/me");
      },
    },
  });

  return {
    updateProfile: mutation.mutate,
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

        queryClient.setQueryData(["user/me"], updateImage);

        queryClient.invalidateQueries({ queryKey: ["user/me"] });
      },
    },
  });

  return {
    updateProfileLogo: mutation.mutate,
    isUpdatingLogo: mutation.isPending,
    isUpdateErrorLogo: mutation.isError,
  };
};

/**
 * Hook to fetch the authenticated user's pull requests with pagination and filters.
 *
 * This hook does not manage any local state. Provide filters via params.
 *
 * @param params - Filters and pagination parameters
 * @returns A React Query result with PRs and simple pagination metadata
 */
export const useUserPullRequests = (params: PullRequestQueryParams = {}) => {
  const per_page = params.per_page ?? 10;
  const page = params.page ?? 1;
  const queryParams: PullRequestQueryParams = { ...params, per_page, page };

  return useQuery<PullRequestsResponse>({
    queryKey: ["user", "me", "pullrequests", queryParams],
    queryFn: () => getUserPullRequests(queryParams),
  });
};
