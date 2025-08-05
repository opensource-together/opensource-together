import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useToastMutation } from "@/shared/hooks/use-toast-mutation";

import {
  acceptProjectRoleApplication,
  cancelApplication,
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
 * @returns An object containing:
 * - acceptApplication: function to trigger the application acceptance
 * - isAccepting: boolean indicating if the acceptance is in progress
 * - isAcceptError: boolean indicating if an error occurred
 */
export function useAcceptProjectRoleApplication() {
  const queryClient = useQueryClient();
  const mutation = useToastMutation({
    mutationFn: (applicationId: string) =>
      acceptProjectRoleApplication(applicationId),
    loadingMessage: "Acceptation de la candidature en cours...",
    successMessage: "Candidature acceptée avec succès !",
    errorMessage: "Erreur lors de l'acceptation de la candidature.",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["my-projects"] });
      },
    },
  });

  return {
    acceptApplication: mutation.mutate,
    isAccepting: mutation.isPending,
    isAcceptError: mutation.isError,
  };
}

/**
 * Rejects a project role application.
 *
 * @returns An object containing:
 * - rejectApplication: function to trigger the application rejection
 * - isRejecting: boolean indicating if the rejection is in progress
 * - isRejectError: boolean indicating if an error occurred
 */
export function useRejectProjectRoleApplication() {
  const queryClient = useQueryClient();
  const mutation = useToastMutation({
    mutationFn: (applicationId: string, rejectionReason?: string) =>
      rejectProjectRoleApplication(applicationId, rejectionReason),
    loadingMessage: "Rejet de la candidature en cours...",
    successMessage: "Candidature refusée avec succès !",
    errorMessage: "Erreur lors du rejet de la candidature.",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["my-projects"] });
      },
    },
  });

  return {
    rejectApplication: mutation.mutate,
    isRejecting: mutation.isPending,
    isRejectError: mutation.isError,
  };
}

/**
 * Cancels a project role application.
 *
 * @returns An object containing:
 * - cancelApplication: function to trigger the application cancellation
 * - isCanceling: boolean indicating if the cancellation is in progress
 * - isCancelError: boolean indicating if an error occurred
 */
export function useCancelApplication() {
  const queryClient = useQueryClient();

  const mutation = useToastMutation({
    mutationFn: (applicationId: string) => cancelApplication(applicationId),
    loadingMessage: "Annulation de la candidature en cours...",
    successMessage: "Candidature annulée avec succès",
    errorMessage: "Erreur lors de l'annulation de la candidature",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["my-project-roles-applications"],
        });
      },
    },
  });

  return {
    cancelApplication: mutation.mutate,
    isCanceling: mutation.isPending,
    isCancelError: mutation.isError,
  };
}
