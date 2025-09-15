import { API_BASE_URL } from "@/config/config";

import { ProjectRoleApplicationType } from "../types/project-role-application.type";

/**
 * Fetches the list of project role applications for the current user.
 *
 * @returns A promise that resolves to an array of project role applications.
 */
export const getMyApplications = async (): Promise<
  ProjectRoleApplicationType[]
> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/me/applications`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch applications");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching applications:", error);
    throw error;
  }
};

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
 * Accepts or rejects a project role application.
 *
 * @param applicationId - The ID of the application to accept/reject.
 * @param action - The action to perform ('accept' or 'reject').
 * @param rejectionReason - Optional reason for rejection.
 * @returns A promise that resolves to void.
 */
export async function updateApplicationStatus(
  applicationId: string,
  action: "accept" | "reject",
  rejectionReason?: string
) {
  try {
    const payload =
      action === "reject" && rejectionReason ? { rejectionReason } : {};

    const response = await fetch(
      `${API_BASE_URL}/applications/${applicationId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          status: action === "accept" ? "ACCEPTED" : "REJECTED",
          ...payload,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message ||
          `Erreur lors de l'${action === "accept" ? "acceptation" : "rejet"} de la candidature.`
      );
    }
  } catch (error) {
    console.error(`[updateApplicationStatus] ${action}:`, error);
    throw error;
  }
}

/**
 * Accepts a project role application.
 *
 * @param applicationId - The ID of the application to accept.
 * @returns A promise that resolves to void.
 */
export async function acceptProjectRoleApplication(applicationId: string) {
  return updateApplicationStatus(applicationId, "accept");
}

/**
 * Rejects a project role application.
 *
 * @param applicationId - The ID of the application to reject.
 * @param rejectionReason - Optional reason for rejection.
 * @returns A promise that resolves to void.
 */
export async function rejectProjectRoleApplication(
  applicationId: string,
  rejectionReason?: string
) {
  return updateApplicationStatus(applicationId, "reject", rejectionReason);
}

/**
 * Applies to a project role.
 *
 * @param projectId - The ID of the project.
 * @param roleId - The ID of the role.
 * @param applicationData - The application data.
 * @returns A promise that resolves to the application details.
 */
export async function applyToProjectRole(
  projectId: string,
  roleId: string,
  applicationData: {
    motivationLetter: string;
    selectedKeyFeatures: { feature: string }[];
  }
): Promise<ProjectRoleApplicationType> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/projects/${projectId}/roles/${roleId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(applicationData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || "Erreur lors de la candidature au rôle."
      );
    }

    return response.json();
  } catch (error) {
    console.error("[applyToProjectRole]", error);
    throw error;
  }
}

/**
 * Cancels an application by its ID
 *
 * @param applicationId - The ID of the application to cancel
 * @returns A promise that resolves to void
 */
export async function cancelApplication(applicationId: string): Promise<void> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/user/me/applications/${applicationId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ cancel: true }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || "Erreur lors de l'annulation de la candidature."
      );
    }

    return await response.json();
  } catch (error) {
    console.error("[cancelApplication]", error);
    throw error;
  }
}
