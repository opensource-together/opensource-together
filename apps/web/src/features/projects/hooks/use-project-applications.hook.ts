import { useQuery } from "@tanstack/react-query";

import { getProjectApplications } from "../services/project-apply.service";
import { ProjectRoleApplication } from "../types/project-application.type";

/**
 * Fetches the applications for a specific project.
 *
 * @param projectId - The ID of the project to retrieve applications for.
 * @returns A React Query result containing the list of project applications.
 */
export function useProjectApplications(projectId: string) {
  return useQuery<ProjectRoleApplication[]>({
    queryKey: ["project-applications", projectId],
    queryFn: () => getProjectApplications(projectId),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
