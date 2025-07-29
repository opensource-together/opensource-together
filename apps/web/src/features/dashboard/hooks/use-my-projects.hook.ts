import { useQuery } from "@tanstack/react-query";

import { Project } from "@/features/projects/types/project.type";

import { mockMyProjects } from "../mocks/my-projects.mock";

/**
 * Fetches the list of projects for the current user.
 *
 * @returns A React Query result containing the list of projects.
 */
export function useMyProjects() {
  return useQuery<Project[]>({
    queryKey: ["my-projects"],
    queryFn: () => Promise.resolve(mockMyProjects),
  });
}
