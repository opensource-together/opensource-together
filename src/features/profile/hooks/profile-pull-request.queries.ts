import { useQuery } from "@tanstack/react-query";

import {
  getUserMyPullRequests,
  getUserPullRequestsById,
} from "../services/profile-pull-request.service";
import type {
  PullRequestQueryParams,
  PullRequestsResponse,
} from "../types/profile.pull-request.type";
import { profileKeys } from "./profile.keys";

export function useCurrentUserPullRequestsQuery(
  params: PullRequestQueryParams = {}
) {
  const queryParams: PullRequestQueryParams = {
    ...params,
    per_page: params.per_page ?? 10,
    page: params.page ?? 1,
  };

  return useQuery<PullRequestsResponse>({
    queryKey: profileKeys.pullRequestList("me", queryParams),
    queryFn: () => getUserMyPullRequests(queryParams),
  });
}

export function useUserPullRequestsQuery(
  userId: string,
  params: PullRequestQueryParams = {}
) {
  const queryParams: PullRequestQueryParams = {
    ...params,
    per_page: params.per_page ?? 10,
    page: params.page ?? 1,
  };

  return useQuery<PullRequestsResponse>({
    queryKey: profileKeys.pullRequestList(userId, queryParams),
    queryFn: () => getUserPullRequestsById(userId, queryParams),
    enabled: !!userId,
  });
}
