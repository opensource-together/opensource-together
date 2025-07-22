import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useToastMutation } from "@/shared/hooks/use-toast-mutation";

import {
  acceptDashboardProjectApplication,
  getDashboardProjectApplications,
  rejectDashboardProjectApplication,
} from "../services/dashboard-application.service";

export function useDashboardProjectApplications(projectId: string) {
  return useQuery({
    queryKey: ["dashboard-project-applications", projectId],
    queryFn: () => getDashboardProjectApplications(projectId),
    enabled: !!projectId,
  });
}

export function useAcceptDashboardProjectApplication(projectId: string) {
  const queryClient = useQueryClient();
  return useToastMutation<void, Error, string>({
    mutationFn: (applicationId: string) =>
      acceptDashboardProjectApplication(projectId, applicationId),
    loadingMessage: "Acceptation de la candidature en cours...",
    successMessage: "Candidature acceptée avec succès !",
    errorMessage: "Erreur lors de l'acceptation de la candidature.",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["dashboard-project-applications", projectId],
        });
      },
    },
  });
}

export function useRejectDashboardProjectApplication(projectId: string) {
  const queryClient = useQueryClient();
  return useToastMutation<void, Error, string>({
    mutationFn: (applicationId: string) =>
      rejectDashboardProjectApplication(projectId, applicationId),
    loadingMessage: "Rejet de la candidature en cours...",
    successMessage: "Candidature refusée avec succès !",
    errorMessage: "Erreur lors du rejet de la candidature.",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["dashboard-project-applications", projectId],
        });
      },
    },
  });
}
