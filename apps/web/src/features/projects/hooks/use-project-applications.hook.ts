import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useToastMutation } from "@/shared/hooks/use-toast-mutation";

import {
  acceptProjectRoleApplication,
  getProjectApplications,
  rejectProjectRoleApplication,
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
          queryKey: ["project-applications", projectId],
        });
      },
    },
  });
}

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
          queryKey: ["project-applications", projectId],
        });
      },
    },
  });
}
