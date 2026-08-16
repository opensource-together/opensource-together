import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { authKeys } from "@/features/auth/hooks/auth.keys";

import { getGitUserRepositories } from "../services/git-user-repos.service";
import type {
  GitUserRepositoriesQueryParams,
  GitUserRepositoriesResponse,
} from "../types/git-repository.type";

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
    queryKey: authKeys.repositoryList(queryParams),
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
    queryKey: authKeys.repositoryList(queryParams),
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
