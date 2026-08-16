import { useQuery } from "@tanstack/react-query";
import { profileKeys } from "@/features/profile/hooks/profile.keys";
import {
  getCurrentUserProjects,
  type PaginatedProjectsResponse,
  type UserProjectsQueryParams,
} from "@/features/projects/services/project.service";

export function useMyProjectsQuery(params: UserProjectsQueryParams = {}) {
  const queryParams: UserProjectsQueryParams = {
    ...params,
    per_page: params.per_page ?? 7,
    page: params.page ?? 1,
  };

  return useQuery<PaginatedProjectsResponse>({
    queryKey: profileKeys.projectList("me", queryParams),
    queryFn: ({ signal }) => getCurrentUserProjects(queryParams, { signal }),
  });
}
