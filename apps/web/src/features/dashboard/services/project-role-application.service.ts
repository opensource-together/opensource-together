import { API_BASE_URL } from "@/config/config";

import { ProjectRoleApplicationType } from "../types/project-role-application.type";

/**
 * Récupère les candidatures de l'utilisateur courant
 *
 * @returns Promise<ProjectRoleApplicationType[]> - Liste des candidatures
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

    const data = await response.json();

    // Convertir les dates string en objets Date
    return data.map((application: any) => ({
      ...application,
      appliedAt: new Date(application.appliedAt),
      decidedAt: application.decidedAt
        ? new Date(application.decidedAt)
        : undefined,
    }));
  } catch (error) {
    console.error("Error fetching applications:", error);
    throw error;
  }
};

/**
 * Récupère les détails d'une application spécifique
 *
 * @param applicationId - L'ID de l'application à récupérer
 * @returns Promise<ProjectRoleApplicationType> - Détails de l'application
 */
export const getApplicationById = async (
  applicationId: string
): Promise<ProjectRoleApplicationType> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/applications/${applicationId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch application");
    }

    const data = await response.json();

    // Convertir les dates string en objets Date
    return {
      ...data,
      appliedAt: new Date(data.appliedAt),
      decidedAt: data.decidedAt ? new Date(data.decidedAt) : undefined,
    };
  } catch (error) {
    console.error("Error fetching application:", error);
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
 * Postule à un rôle de projet
 *
 * @param projectId - L'ID du projet
 * @param roleId - L'ID du rôle
 * @param applicationData - Les données de candidature
 * @returns Promise<ProjectRoleApplicationType> - La candidature créée
 */
export async function applyToProjectRole(
  projectId: string,
  roleId: string,
  applicationData: {
    motivationLetter: string;
    selectedKeyFeatures: { feature: string }[];
    selectedProjectGoals: { goal: string }[];
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

    const data = await response.json();

    // Convertir les dates string en objets Date
    return {
      ...data,
      appliedAt: new Date(data.appliedAt),
      decidedAt: data.decidedAt ? new Date(data.decidedAt) : undefined,
    };
  } catch (error) {
    console.error("[applyToProjectRole]", error);
    throw error;
  }
}
