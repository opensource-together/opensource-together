import { useQuery } from "@tanstack/react-query";

import { Project } from "@/features/projects/types/project.type";

import { getMyProjects } from "../services/my-projects.service";

/**
 * Fetches the list of projects for the current user.
 *
 * @returns A React Query result containing the list of projects.
 */
export function useMyProjects() {
  return useQuery<Project[]>({
    queryKey: ["user", "me", "projects"],
    queryFn: getMyProjects,
  });
}
