import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useToastMutation } from "@/shared/hooks/use-toast-mutation";

import {
  getUserById,
  getUserPullRequests,
  updateProfile,
} from "../services/profile.service";
import { PullRequestQueryParams } from "../types/profile.type";
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
 * Hook to fetch the authenticated user's pull requests with pagination and filters.
 *
 * This hook does not manage any local state. Provide filters via params.
 *
 * @param params - Filters and pagination parameters
 * @returns A React Query result with PRs and simple pagination metadata
 */
export const useUserPullRequests = (
  params: PullRequestQueryParams & {
    enabled?: boolean;
    staleTime?: number;
  } = {}
) => {
  const { enabled = true, staleTime = 30_000, ...queryParams } = params;
  if (queryParams.per_page == null) {
    queryParams.per_page = 10;
  }

  return useQuery({
    queryKey: ["user", "pullrequests", queryParams],
    queryFn: () => getUserPullRequests(queryParams),
    enabled,
    placeholderData: (previousData) => previousData,
    staleTime,
    select: (response) => {
      const perPage = queryParams.per_page;
      const page = queryParams.page ?? 1;
      const provider = queryParams.provider ?? "all";

      const github = response.data.github ?? [];
      const gitlab = response.data.gitlab ?? [];

      const hasNextGithub = perPage ? github.length === perPage : false;
      const hasNextGitlab = perPage ? gitlab.length === perPage : false;

      const hasNextPage =
        provider === "github"
          ? hasNextGithub
          : provider === "gitlab"
            ? hasNextGitlab
            : perPage
              ? github.length === perPage || gitlab.length === perPage
              : false;

      return {
        ...response,
        meta: {
          provider,
          page,
          per_page: perPage,
          hasPrevPage: page > 1,
          hasNextPage,
        },
      };
    },
  });
};
