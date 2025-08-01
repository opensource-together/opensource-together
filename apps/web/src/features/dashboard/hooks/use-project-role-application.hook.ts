import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useToastMutation } from "@/shared/hooks/use-toast-mutation";

import {
  acceptProjectRoleApplication,
  getMyApplications,
  getProjectRolesApplications,
  rejectProjectRoleApplication,
} from "../services/project-role-application.service";

/**
 * Fetches the list of project role applications for a specific project.
 *
 * @param projectId - The ID of the project to fetch applications for.
 * @returns A React Query result containing the list of project role applications.
 */
export function useProjectRolesApplications(projectId: string) {
  return useQuery({
    queryKey: ["project-roles-applications", projectId],
    queryFn: () => getProjectRolesApplications(projectId),
    enabled: !!projectId,
  });
}

/**
 * Fetches the list of project role applications for the current user.
 *
 * @returns A React Query result containing the list of project role applications.
 */
export function useMyProjectRolesApplications() {
  return useQuery({
    queryKey: ["my-project-roles-applications"],
    queryFn: () => getMyApplications(),
  });
}

/**
 * Accepts a project role application.
 *
 * @param projectId - The ID of the project to accept the application for.
 * @returns A React Query result containing the list of project role applications.
 */
export function useAcceptProjectRoleApplication(projectId: string) {
  const queryClient = useQueryClient();
  return useToastMutation<void, Error, string>({
    mutationFn: (applicationId: string) =>
      acceptProjectRoleApplication(projectId, applicationId),
    loadingMessage: "Acceptation de la candidature en cours...",
    successMessage: "Candidature acceptée avec succès !",
    errorMessage: "Erreur lors de l'acceptation de la candidature.",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["project-roles-applications", projectId],
        });
      },
    },
  });
}

/**
 * Rejects a project role application.
 *
 * @param projectId - The ID of the project to reject the application for.
 * @returns A React Query result containing the list of project role applications.
 */
export function useRejectProjectRoleApplication(projectId: string) {
  const queryClient = useQueryClient();
  return useToastMutation<void, Error, string>({
    mutationFn: (applicationId: string) =>
      rejectProjectRoleApplication(projectId, applicationId),
    loadingMessage: "Rejet de la candidature en cours...",
    successMessage: "Candidature refusée avec succès !",
    errorMessage: "Erreur lors du rejet de la candidature.",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["project-roles-applications", projectId],
        });
      },
    },
  });
}
