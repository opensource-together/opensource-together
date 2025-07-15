import { API_BASE_URL } from "@/config/config";

import { ProjectRoleApplication } from "../types/project-application.type";
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
      credentials: "include",
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

export async function getProjectApplications(
  projectId: string
): Promise<ProjectRoleApplication[]> {
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
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        `Erreur lors de la récupération des candidatures: ${response.status}`
    );
  }

  return response.json();
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
  // const response = await fetch(
  //   `${API_BASE_URL}/applications/${applicationId}/accept`,
  //   {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     credentials: "include",
  //   }
  // );
  //
  // if (!response.ok) {
  //   const errorData = await response.json().catch(() => ({}));
  //   throw new Error(
  //     errorData.message ||
  //       `Erreur lors de l'acceptation de la candidature: ${response.status}`
  //   );
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
  // const response = await fetch(
  //   `${API_BASE_URL}/applications/${applicationId}/reject`,
  //   {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     credentials: "include",
  //   }
  // );
  //
  // if (!response.ok) {
  //   const errorData = await response.json().catch(() => ({}));
  //   throw new Error(
  //     errorData.message ||
  //       `Erreur lors du rejet de la candidature: ${response.status}`
  //   );
  // }
}
