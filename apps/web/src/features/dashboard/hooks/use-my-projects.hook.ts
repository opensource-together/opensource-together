import { useQuery } from "@tanstack/react-query";

import { mockDashboardData } from "../mocks/my-projects.mock";
import { MyProjectType } from "../types/my-projects.type";

/**
 * Fetches the list of projects for the current user.
 *
 * @returns A React Query result containing the list of projects.
 */
export function useMyProjects() {
  return useQuery<MyProjectType[]>({
    queryKey: ["my-projects"],
    queryFn: () => Promise.resolve(mockDashboardData),
  });
}
