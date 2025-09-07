import { useQuery } from "@tanstack/react-query";

import {
  getMyProjectDetails,
  getMyProjects,
} from "../services/my-projects.service";
import { MyProjectType } from "../types/my-projects.type";

/**
 * Fetches the list of projects for the current user.
 *
 * @returns A React Query result containing the list of projects.
 */
export function useMyProjects() {
  return useQuery<MyProjectType[]>({
    queryKey: ["my-projects"],
    queryFn: getMyProjects,
  });
}

/**
 * Fetches the details of a specific project for the current user.
 *
 * @param projectId - The ID of the project to fetch.
 * @returns A React Query result containing the project details.
 */
export function useMyProjectDetails(projectId: string) {
  return useQuery<MyProjectType>({
    queryKey: ["my-project", projectId],
    queryFn: () => getMyProjectDetails(projectId),
    enabled: !!projectId,
  });
}
