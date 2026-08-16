import { useQuery } from "@tanstack/react-query";
import type { PaginationParams } from "@/shared/types/pagination.type";

import {
  getUserBookmarks,
  getUserById,
  getUserProjects,
  type UserBookmarksQueryParams,
  type UserProjectsQueryParams,
} from "../services/profile.service";
import { profileKeys } from "./profile.keys";

export function useProfileQuery(userId: string) {
  return useQuery({
    queryKey: profileKeys.detail(userId),
    queryFn: () => getUserById(userId),
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
    queryFn: () => getUserProjects(userId, queryParams),
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
    queryFn: () => getUserBookmarks(queryParams),
    enabled: options?.enabled ?? true,
  });
}
