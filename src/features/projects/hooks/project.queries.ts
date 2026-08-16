import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import {
  getProject,
  getProjects,
  type PaginatedProjectsResponse,
  type ProjectQueryParams,
} from "../services/project.service";
import type { Project } from "../types/project.type";
import { projectKeys } from "./project.keys";

export function useInfiniteProjectsQuery(
  params: Omit<ProjectQueryParams, "page"> = {},
  options?: {
    enabled?: boolean;
    maxTotalItems?: number;
  }
) {
  const per_page = params.per_page ?? 20;
  const queryParams = { ...params, per_page };
  const maxPageLimit =
    options?.maxTotalItems && options.maxTotalItems > 0
      ? Math.ceil(options.maxTotalItems / per_page)
      : undefined;

  return useInfiniteQuery<PaginatedProjectsResponse>({
    queryKey: projectKeys.infiniteList(queryParams),
    queryFn: ({ pageParam, signal }) =>
      getProjects(
        {
          ...queryParams,
          page: typeof pageParam === "number" ? pageParam : 1,
        },
        { signal }
      ),
    initialPageParam: 1,
    enabled: options?.enabled ?? true,
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      if (!pagination) return undefined;

      const canHaveMoreByServer = pagination.currentPage < pagination.lastPage;
      const canHaveMoreByLimit = maxPageLimit
        ? pagination.currentPage < maxPageLimit
        : true;

      return canHaveMoreByServer && canHaveMoreByLimit
        ? pagination.currentPage + 1
        : undefined;
    },
  });
}

export function useProjectQuery(projectId: string) {
  return useQuery<Project>({
    queryKey: projectKeys.detail(projectId),
    queryFn: ({ signal }) => getProject(projectId, { signal }),
    enabled: !!projectId,
  });
}
