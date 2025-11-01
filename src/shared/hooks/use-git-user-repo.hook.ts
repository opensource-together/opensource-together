import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { getGitUserRepositories } from "../services/git-user-repos.service";
import {
  GitUserRepositoriesQueryParams,
  GitUserRepositoriesResponse,
} from "../types/git-repository.type";

/**
 * Hook to fetch the repositories of the current user with pagination and filters.
 *
 * This hook does not manage any local state. Provide filters via params.
 *
 * @param params - Filters and pagination parameters
 * @returns A React Query result containing the repositories data.
 */
export const useGitUserRepositories = (
  params: GitUserRepositoriesQueryParams = {}
) => {
  const per_page = params.per_page ?? 50;
  const page = params.page ?? 1;
  const queryParams: GitUserRepositoriesQueryParams = {
    ...params,
    per_page,
    page,
  };

  return useQuery<GitUserRepositoriesResponse>({
    queryKey: ["user", "me", "repos", queryParams],
    queryFn: () => getGitUserRepositories(queryParams),
  });
};

export const useInfiniteGitUserRepositories = (
  params: Omit<GitUserRepositoriesQueryParams, "page"> & { per_page?: number }
) => {
  const per_page = params.per_page ?? 50;
  const queryParams: GitUserRepositoriesQueryParams = {
    ...params,
    per_page,
  };

  return useInfiniteQuery<GitUserRepositoriesResponse, Error>({
    queryKey: ["user", "me", "repos", queryParams],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) =>
      getGitUserRepositories({
        ...queryParams,
        page: pageParam as number,
      }),
    getNextPageParam: (lastPage, _pages, lastPageParam) => {
      const provider = params.provider;
      if (!provider) return undefined;
      const providerData = lastPage[provider];
      if (!providerData) return undefined;
      return providerData.pagination.hasNextPage
        ? (Number(lastPageParam) || 1) + 1
        : undefined;
    },
  });
};
