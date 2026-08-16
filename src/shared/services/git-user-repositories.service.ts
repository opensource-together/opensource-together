import {
  type ApiRequestContext,
  apiData,
  withQueryParams,
} from "@/shared/lib/api-client";

import type {
  GitUserRepositoriesQueryParams,
  GitUserRepositoriesResponse,
} from "../types/git-repository.type";

export function getCurrentUserRepositories(
  params?: GitUserRepositoriesQueryParams,
  context: ApiRequestContext = {}
): Promise<GitUserRepositoriesResponse> {
  return apiData<GitUserRepositoriesResponse>(
    withQueryParams("/users/me/repos", params),
    context
  );
}
