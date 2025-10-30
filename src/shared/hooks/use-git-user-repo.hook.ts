import { useQuery } from "@tanstack/react-query";

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
  const per_page = params.per_page ?? 100;
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
