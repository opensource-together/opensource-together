import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useToastMutation } from "@/shared/hooks/use-toast-mutation";
import type { PaginationParams } from "@/shared/types/pagination.type";

import {
  getUserBookmarks,
  getUserById,
  getUserProjects,
  type UserBookmarksQueryParams,
  type UserProjectsQueryParams,
  updateProfile,
  updateProfileBanner,
  updateProfileLogo,
} from "../services/profile.service";
import type { ProfileSchema } from "../validations/profile.schema";

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
    }: {
      id: string;
      updateData: ProfileSchema;
    }) => updateProfile(id, updateData),
    loadingMessage: "Updating your profile...",
    successMessage: "Profil updated with success",
    errorMessage: "Error updating your profile",
    options: {
      onSuccess: (profileId) => {
        queryClient.invalidateQueries({ queryKey: ["user", profileId] });
        queryClient.invalidateQueries({ queryKey: ["user", "me"] });
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
      onSuccess: (profileId) => {
        queryClient.invalidateQueries({ queryKey: ["user", profileId] });
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

/**
 * Hook to update the banner of a user by their ID.
 *
 * @param id - The ID of the user to update.
 * @param file - The file to update the banner with.
 * @returns An object containing:
 * - updateProfileBanner: function to trigger the banner update
 * - isUpdatingBanner: boolean indicating if the update is in progress
 * - isUpdateErrorBanner: boolean indicating if an error occurred
 */
export const useProfileBannerUpdate = (id: string) => {
  const queryClient = useQueryClient();

  const mutation = useToastMutation({
    mutationFn: (file: File) => updateProfileBanner(id, file),
    loadingMessage: "Updating your banner...",
    successMessage: "Banner updated successfully",
    errorMessage: "Error updating your banner",
    options: {
      onSuccess: (profileId) => {
        queryClient.invalidateQueries({ queryKey: ["user", profileId] });
        queryClient.invalidateQueries({ queryKey: ["user", "me"] });
      },
    },
  });

  return {
    updateProfileBanner: mutation.mutate,
    isUpdatingBanner: mutation.isPending,
    isUpdateErrorBanner: mutation.isError,
  };
};

/**
 * Hook to fetch the projects of a user by their ID.
 *
 * @param userId - The ID of the user to fetch projects for.
 * @param params - Optional query parameters for pagination and filtering.
 * @param options - Optional React Query options (e.g., enabled).
 * @returns A React Query result containing the paginated projects data.
 */
export const useUserProjects = (
  userId: string,
  params: UserProjectsQueryParams = {},
  options?: { enabled?: boolean }
) => {
  const per_page = params.per_page ?? 10;
  const page = params.page ?? 1;
  const queryParams: UserProjectsQueryParams = { ...params, per_page, page };

  return useQuery({
    queryKey: ["user", userId, "projects", queryParams],
    queryFn: () => getUserProjects(userId, queryParams),
    enabled: (options?.enabled ?? true) && !!userId,
  });
};

export const useUserBookmarks = (
  params: PaginationParams = {},
  options?: { enabled?: boolean }
) => {
  const per_page = params.per_page ?? 10;
  const page = params.page ?? 1;
  const queryParams: UserBookmarksQueryParams = { ...params, per_page, page };

  return useQuery({
    queryFn: () => getUserBookmarks(queryParams),
    queryKey: ["user", "me", "bookmarks", queryParams],
    enabled: options?.enabled ?? true,
  });
};
