import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
 * Returns the standard TanStack Query mutation result.
 */
export const useProfileUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updateData,
    }: {
      id: string;
      updateData: ProfileSchema;
    }) => updateProfile(id, updateData),
    onSuccess: async (profile) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["user", profile.id] }),
        queryClient.invalidateQueries({ queryKey: ["user", "me"] }),
      ]);
    },
  });
};

/**
 * Hook to update the logo of a user by their ID.
 *
 * @param id - The ID of the user to update.
 * @returns The standard TanStack Query mutation result.
 */
export const useProfileLogoUpdate = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => updateProfileLogo(id, file),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["user", id] }),
        queryClient.invalidateQueries({ queryKey: ["user", "me"] }),
      ]);
    },
  });
};

/**
 * Hook to update the banner of a user by their ID.
 *
 * @param id - The ID of the user to update.
 * @returns The standard TanStack Query mutation result.
 */
export const useProfileBannerUpdate = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => updateProfileBanner(id, file),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["user", id] }),
        queryClient.invalidateQueries({ queryKey: ["user", "me"] }),
      ]);
    },
  });
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
