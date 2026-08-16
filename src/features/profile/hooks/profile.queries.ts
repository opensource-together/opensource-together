import { useQuery } from "@tanstack/react-query";
import {
  getCurrentUserBookmarks,
  getUserProjects,
  type UserBookmarksQueryParams,
  type UserProjectsQueryParams,
} from "@/features/projects/services/project.service";
import type { PaginationParams } from "@/shared/types/pagination.type";

import { getUser } from "../services/profile.service";
import { profileKeys } from "./profile.keys";

export function useProfileQuery(userId: string) {
  return useQuery({
    queryKey: profileKeys.detail(userId),
    queryFn: ({ signal }) => getUser(userId, { signal }),
    enabled: !!userId,
  });
}

export function useUserProjectsQuery(
  userId: string,
  params: UserProjectsQueryParams = {},
  options?: { enabled?: boolean }
) {
  const queryParams: UserProjectsQueryParams = {
    ...params,
    per_page: params.per_page ?? 10,
    page: params.page ?? 1,
  };

  return useQuery({
    queryKey: profileKeys.projectList(userId, queryParams),
    queryFn: ({ signal }) => getUserProjects(userId, queryParams, { signal }),
    enabled: (options?.enabled ?? true) && !!userId,
  });
}

export function useUserBookmarksQuery(
  params: PaginationParams = {},
  options?: { enabled?: boolean }
) {
  const queryParams: UserBookmarksQueryParams = {
    ...params,
    per_page: params.per_page ?? 10,
    page: params.page ?? 1,
  };

  return useQuery({
    queryKey: profileKeys.bookmarkList(queryParams),
    queryFn: ({ signal }) => getCurrentUserBookmarks(queryParams, { signal }),
    enabled: options?.enabled ?? true,
  });
}
