import { useQuery } from "@tanstack/react-query";
import { profileKeys } from "@/features/profile/hooks/profile.keys";

import {
  getMyProjects,
  type PaginatedProjectsResponse,
  type ProjectQueryParams,
} from "../services/my-projects.service";

export function useMyProjectsQuery(params: ProjectQueryParams = {}) {
  const queryParams: ProjectQueryParams = {
    ...params,
    per_page: params.per_page ?? 7,
    page: params.page ?? 1,
  };

  return useQuery<PaginatedProjectsResponse>({
    queryKey: profileKeys.projectList("me", queryParams),
    queryFn: () => getMyProjects(queryParams),
  });
}
