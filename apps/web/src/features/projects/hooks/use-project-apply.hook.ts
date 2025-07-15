import { useToastMutation } from "@/shared/hooks/use-toast-mutation";

import { applyToProjectRole } from "../services/project-apply.service";
import { ProjectRoleApplicationInput } from "../types/project-apply-role.type";

interface ApplyToProjectData {
  projectId: string;
  roleId: string;
  data: ProjectRoleApplicationInput;
}

export function useApplyToProject() {
  return useToastMutation<void, Error, ApplyToProjectData>({
    mutationFn: ({ projectId, roleId, data }) =>
      applyToProjectRole(projectId, roleId, data),
    loadingMessage: "Envoi de votre candidature en cours...",
    successMessage: "Votre candidature a été envoyée avec succès !",
    errorMessage: "Erreur lors de l'envoi de votre candidature",
  });
}
