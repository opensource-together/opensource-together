import { useQuery } from "@tanstack/react-query";
import { projectKeys } from "@/features/projects/hooks/project.keys";

import {
  getProjectRepositorySummary,
  type RepositoryDetailsResponse,
} from "../services/git.repository-summary.service";

export function useProjectRepositorySummary(projectId: string | undefined) {
  return useQuery<RepositoryDetailsResponse>({
    queryKey: projectKeys.repositorySummary(projectId || ""),
    queryFn: () => getProjectRepositorySummary(projectId || ""),
    enabled: !!projectId,
  });
}
