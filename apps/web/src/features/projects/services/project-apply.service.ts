import { API_BASE_URL } from "@/config/config";
import logger from "@/shared/logger";

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
    logger.error("Error applying to project role:", error);
    throw error;
  }
}
