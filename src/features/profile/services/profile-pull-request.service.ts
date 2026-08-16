import type { ApiRequestContext } from "@/shared/lib/api-client";
import { apiData, withQueryParams } from "@/shared/lib/api-client";

import type {
  PullRequestQueryParams,
  PullRequestsResponse,
} from "../types/profile.pull-request.type";

export function getCurrentUserPullRequests(
  params?: PullRequestQueryParams,
  context: ApiRequestContext = {}
): Promise<PullRequestsResponse> {
  return apiData<PullRequestsResponse>(
    withQueryParams("/users/me/pull-requests", params),
    context
  );
}

export function getUserPullRequests(
  userId: string,
  params?: PullRequestQueryParams,
  context: ApiRequestContext = {}
): Promise<PullRequestsResponse> {
  return apiData<PullRequestsResponse>(
    withQueryParams(`/users/${userId}/pull-requests`, params),
    context
  );
}
