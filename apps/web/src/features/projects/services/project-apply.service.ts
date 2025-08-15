import { API_BASE_URL } from "@/config/config";

import { ProjectRoleApplicationType } from "../../dashboard/types/project-role-application.type";
import { RoleApplicationSchema } from "../validations/project-apply.schema";

/**
 * Applies to a project role.
 *
 * @param projectId - The ID of the project.
 * @param roleId - The ID of the role.
 * @param data - The data to apply to the role.
 * @returns The project role application.
 */
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
