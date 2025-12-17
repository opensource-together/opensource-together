import { useQuery } from "@tanstack/react-query";

import {
  getProjectRepositorySummary,
  type RepositoryDetailsResponse,
} from "../services/git.repository-summary.service";

/**
 * Fetch repository summary for a specific project (GitHub stats, languages, etc.).
 */
export function useProjectRepositorySummary(projectId: string | undefined) {
  return useQuery<RepositoryDetailsResponse>({
    queryKey: ["project", projectId, "repository-summary"],
    queryFn: () => getProjectRepositorySummary(projectId || ""),
    enabled: !!projectId,
  });
}
