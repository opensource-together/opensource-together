import { API_BASE_URL } from "@/config/config";

import { ProjectRoleApplicationType } from "../types/project-application.type";
import { RoleApplicationSchema } from "../validations/project-apply.schema";

export async function applyToProjectRole(
  projectId: string,
  roleId: string,
  data: RoleApplicationSchema
): Promise<ProjectRoleApplicationType> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/projects/${projectId}/roles/${roleId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error applying to project role");
    }

    return response.json();
  } catch (error) {
    console.error("Error applying to project role:", error);
    throw error;
  }
}

export async function getProjectApplications(
  projectId: string
): Promise<ProjectRoleApplicationType[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/projects/${projectId}/roles/applications`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          `Erreur lors de la récupération des candidatures: ${response.status}`
      );
    }

    const data = await response.json();
    // Correction du mapping : on mappe appplicationId -> id si présent
    return data.map((app: any) => ({
      ...app,
      id: app.appplicationId || app.id,
    }));
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function acceptProjectRoleApplication(
  projectId: string,
  applicationId: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/projects/${projectId}/roles/applications/${applicationId}/accept`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.message || "Erreur lors de l'acceptation de la candidature."
    );
  }
}

export async function rejectProjectRoleApplication(
  projectId: string,
  applicationId: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/projects/${projectId}/roles/applications/${applicationId}/reject`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erreur lors du rejet de la candidature.");
  }
}
