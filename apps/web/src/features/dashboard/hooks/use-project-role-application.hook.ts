import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useToastMutation } from "@/shared/hooks/use-toast-mutation";

import {
  acceptProjectRoleApplication,
  getApplicationById,
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
 * Fetches a specific application by ID.
 *
 * @param applicationId - The ID of the application to fetch.
 * @returns A React Query result containing the application details.
 */
export function useApplicationById(applicationId: string) {
  return useQuery({
    queryKey: ["application", applicationId],
    queryFn: () => getApplicationById(applicationId),
    enabled: !!applicationId,
  });
}

/**
 * Accepts a project role application.
 *
 * @returns A React Query mutation for accepting applications.
 */
export function useAcceptProjectRoleApplication() {
  const queryClient = useQueryClient();
  return useToastMutation<void, Error, string>({
    mutationFn: (applicationId: string) =>
      acceptProjectRoleApplication(applicationId),
    loadingMessage: "Acceptation de la candidature en cours...",
    successMessage: "Candidature acceptée avec succès !",
    errorMessage: "Erreur lors de l'acceptation de la candidature.",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["my-project-roles-applications"],
        });
        queryClient.invalidateQueries({
          queryKey: ["project-roles-applications"],
        });
        queryClient.invalidateQueries({
          queryKey: ["my-projects"],
        });
      },
    },
  });
}

/**
 * Rejects a project role application.
 *
 * @returns A React Query mutation for rejecting applications.
 */
export function useRejectProjectRoleApplication() {
  const queryClient = useQueryClient();
  return useToastMutation<
    void,
    Error,
    { applicationId: string; rejectionReason?: string }
  >({
    mutationFn: ({ applicationId, rejectionReason }) =>
      rejectProjectRoleApplication(applicationId, rejectionReason),
    loadingMessage: "Rejet de la candidature en cours...",
    successMessage: "Candidature refusée avec succès !",
    errorMessage: "Erreur lors du rejet de la candidature.",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["my-project-roles-applications"],
        });
        queryClient.invalidateQueries({
          queryKey: ["project-roles-applications"],
        });
        queryClient.invalidateQueries({
          queryKey: ["my-projects"],
        });
      },
    },
  });
}
