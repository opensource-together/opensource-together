import { useQuery } from "@tanstack/react-query";

import { getUserRepos } from "../services/git-repository.service";
import {
  UserGitRepositoryQueryParams,
  UserGitRepositoryResponse,
} from "../types/git-repository.type";

/**
 * Hook to fetch the repositories of the current user with pagination and filters.
 *
 * This hook does not manage any local state. Provide filters via params.
 *
 * @param params - Filters and pagination parameters
 * @returns A React Query result containing the repositories data.
 */
export const useGitRepository = (params: UserGitRepositoryQueryParams = {}) => {
  const per_page = params.per_page ?? 50;
  const page = params.page ?? 1;
  const queryParams: UserGitRepositoryQueryParams = {
    ...params,
    per_page,
    page,
  };

  return useQuery<UserGitRepositoryResponse>({
    queryKey: ["user", "me", "repos", queryParams],
    queryFn: () => getUserRepos(queryParams),
  });
};
