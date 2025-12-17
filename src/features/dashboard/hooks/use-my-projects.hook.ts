import { useQuery } from "@tanstack/react-query";

import {
  getMyProjects,
  type PaginatedProjectsResponse,
  type ProjectQueryParams,
} from "../services/my-projects.service";

/**
 * Fetches the list of projects for the current user.
 *
 * @returns A React Query result containing the list of projects.
 */
export function useMyProjects(params: ProjectQueryParams = {}) {
  const per_page = params.per_page ?? 7;
  const page = params.page ?? 1;
  const queryParams: ProjectQueryParams = { ...params, per_page, page };
  return useQuery<PaginatedProjectsResponse>({
    queryKey: ["user", "me", "projects", queryParams],
    queryFn: () => getMyProjects(queryParams),
  });
}
