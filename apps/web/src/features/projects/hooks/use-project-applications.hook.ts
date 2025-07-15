import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useToastMutation } from "@/shared/hooks/use-toast-mutation";

import {
  acceptProjectApplication,
  getProjectApplications,
  rejectProjectApplication,
} from "../services/project-apply.service";
import { ProjectRoleApplicationType } from "../types/project-application.type";

/**
 * Fetches the applications for a specific project.
 *
 * @param projectId - The ID of the project to retrieve applications for.
 * @returns A React Query result containing the list of project applications.
 */
export function useProjectApplications(projectId: string) {
  return useQuery<ProjectRoleApplicationType[]>({
    queryKey: ["project-applications", projectId],
    queryFn: () => getProjectApplications(projectId),
    enabled: !!projectId,
  });
}

/**
 * Mutation to accept a project application.
 *
 * @param projectId - The ID of the project (for cache invalidation).
 * @returns A mutation function to accept an application.
 */
export function useAcceptProjectApplication(projectId: string) {
  const queryClient = useQueryClient();

  return useToastMutation<void, Error, string>({
    mutationFn: (applicationId: string) =>
      acceptProjectApplication(applicationId),
    loadingMessage: "Acceptation de la candidature en cours...",
    successMessage: "Candidature acceptée avec succès !",
    errorMessage: "Erreur lors de l'acceptation de la candidature.",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["project-applications", projectId],
        });
      },
    },
  });
}

/**
 * Mutation to reject a project application.
 *
 * @param projectId - The ID of the project (for cache invalidation).
 * @returns A mutation function to reject an application.
 */
export function useRejectProjectApplication(projectId: string) {
  const queryClient = useQueryClient();

  return useToastMutation<void, Error, string>({
    mutationFn: (applicationId: string) =>
      rejectProjectApplication(applicationId),
    loadingMessage: "Rejet de la candidature en cours...",
    successMessage: "Candidature refusée avec succès !",
    errorMessage: "Erreur lors du rejet de la candidature.",
    options: {
      onSuccess: () => {
        // Invalidate and refetch project applications
        queryClient.invalidateQueries({
          queryKey: ["project-applications", projectId],
        });
      },
    },
  });
}
