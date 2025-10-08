import { useQuery } from "@tanstack/react-query";

import { getUserPullRequests } from "../services/profile-pull-request.service";
import {
  PullRequestQueryParams,
  PullRequestsResponse,
} from "../types/profile.pull-request.type";

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
