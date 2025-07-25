import { API_BASE_URL } from "@/config/config";

import logger from "@/shared/logger";

export async function getDashboardProjectApplications(projectId: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/projects/${projectId}/roles/applications`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
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
    return data.map((app: any) => ({
      ...app,
      id: app.appplicationId || app.id,
    }));
  } catch (error) {
    logger.error("[getDashboardProjectApplications]", error);
    throw error;
  }
}

export async function acceptDashboardProjectApplication(
  projectId: string,
  applicationId: string
) {
  try {
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
  } catch (error) {
    logger.error("[acceptDashboardProjectApplication]", error);
    throw error;
  }
}

export async function rejectDashboardProjectApplication(
  projectId: string,
  applicationId: string
) {
  try {
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
      throw new Error(
        error.message || "Erreur lors du rejet de la candidature."
      );
    }
  } catch (error) {
    logger.error("[rejectDashboardProjectApplication]", error);
    throw error;
  }
}
