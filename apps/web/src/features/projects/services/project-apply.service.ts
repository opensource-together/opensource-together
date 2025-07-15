import { API_BASE_URL } from "@/config/config";

import { ProjectRoleApplicationInput } from "../types/project-apply-role.type";

export async function applyToProjectRole(
  projectId: string,
  roleId: string,
  data: ProjectRoleApplicationInput
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/projects/${projectId}/roles/${roleId}/apply`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Erreur lors de la candidature: ${response.status}`
    );
  }
}
