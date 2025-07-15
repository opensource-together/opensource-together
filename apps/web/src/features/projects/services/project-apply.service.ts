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
      `${API_BASE_URL}/projects/${projectId}/roles/${roleId}/apply`,
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
      `${API_BASE_URL}/projects/${projectId}/applications`,
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

    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function acceptProjectApplication(
  applicationId: string
): Promise<void> {
  // Mock implementation for now
  console.log(`[MOCK] Accepting application: ${applicationId}`);

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock success response
  return Promise.resolve();

  // Real implementation would be:
  // try {
  //   const response = await fetch(
  //     `${API_BASE_URL}/applications/${applicationId}/accept`,
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       credentials: "include",
  //     }
  //   );
  //
  //   if (!response.ok) {
  //     const error = await response.json();
  //     throw new Error(error.message || "Error accepting project application");
  //   }
  //
  //   return response.json();
  // } catch (error) {
  //   console.error("Error accepting project application:", error);
  //   throw error;
  // }
}

export async function rejectProjectApplication(
  applicationId: string
): Promise<void> {
  // Mock implementation for now
  console.log(`[MOCK] Rejecting application: ${applicationId}`);

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock success response
  return Promise.resolve();

  // Real implementation would be:
  // try {
  //   const response = await fetch(
  //     `${API_BASE_URL}/applications/${applicationId}/reject`,
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       credentials: "include",
  //     }
  //   );
  //
  //   if (!response.ok) {
  //     const error = await response.json();
  //     throw new Error(error.message || "Error rejecting project application");
  //   }
  //
  //   return response.json();
  // } catch (error) {
  //   console.error("Error rejecting project application:", error);
  //   throw error;
  // }
}
