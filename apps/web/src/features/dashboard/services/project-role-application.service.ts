import { API_BASE_URL } from "@/config/config";

import { ProjectRoleApplicationType } from "../types/project-role-application.type";

/**
 * Fetches the list of project role applications for a specific project.
 *
 * @param projectId - The ID of the project to fetch applications for.
 * @returns A promise that resolves to an array of project role applications.
 */
export async function getProjectRolesApplications(projectId: string) {
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
    return data;
  } catch (error) {
    console.error("[getProjectRolesApplications]", error);
    throw error;
  }
}

/**
 * Fetches the list of project role applications for the current user.
 *
 * @returns A promise that resolves to an array of project role applications.
 */
export async function getMyProjectRolesApplications(): Promise<
  ProjectRoleApplicationType[]
> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/applications`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          `Erreur lors de la récupération des candidatures: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("[getMyProjectRolesApplications]", error);
    throw error;
  }
}

/**
 * Accepts a project role application.
 *
 * @param projectId - The ID of the project to accept the application for.
 * @param applicationId - The ID of the application to accept.
 * @returns A promise that resolves to void.
 */
export async function acceptProjectRoleApplication(
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
    console.error("[acceptProjectRoleApplication]", error);
    throw error;
  }
}

/**
 * Rejects a project role application.
 *
 * @param projectId - The ID of the project to reject the application for.
 * @param applicationId - The ID of the application to reject.
 * @returns A promise that resolves to void.
 */
export async function rejectProjectRoleApplication(
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
    console.error("[rejectProjectRoleApplication]", error);
    throw error;
  }
}
