import { API_BASE_URL } from "@/config/config";

import logger from "@/shared/logger";

import {
  CreateProjectRoleSchema,
  UpdateProjectRoleSchema,
} from "../validations/project-role.schema";

/**
 * Get all project roles.
 *
 * @param projectId - The ID of the project to get the roles for.
 * @returns A promise that resolves to the project roles.
 */
export const getProjectRoles = async (projectId: string) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/projects/${projectId}/roles`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error fetching project roles");
    }

    return response.json();
  } catch (error) {
    logger.error("Error fetching project roles:", error);
    throw error;
  }
};

/**
 * Create a new project role.
 *
 * @param projectId - The ID of the project to which the role will be added.
 * @param data - The data for the new role.
 * @returns A promise that resolves to the created role.
 */
export const createProjectRole = async (
  projectId: string,
  data: CreateProjectRoleSchema
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/projects/${projectId}/roles`,
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
      throw new Error(error.message || "Error creating project role");
    }

    return response.json();
  } catch (error) {
    logger.error("Error creating project role:", error);
    throw error;
  }
};

/**
 * Update an existing project role.
 *
 * @param projectId - The ID of the project containing the role.
 * @param roleId - The ID of the role to update.
 * @param data - The data for the updated role.
 * @returns A promise that resolves to the updated role.
 */
export const updateProjectRole = async (
  projectId: string,
  roleId: string,
  data: UpdateProjectRoleSchema
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/projects/${projectId}/roles/${roleId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error updating project role");
    }

    return response.json();
  } catch (error) {
    logger.error("Error updating project role:", error);
    throw error;
  }
};

/**
 * Delete a project role.
 *
 * @param projectId - The ID of the project containing the role.
 * @param roleId - The ID of the role to delete.
 */
export const deleteProjectRole = async (
  projectId: string,
  roleId: string
): Promise<void> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/projects/${projectId}/roles/${roleId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error deleting project role");
    }
  } catch (error) {
    logger.error("Error deleting project role:", error);
    throw error;
  }
};

// // Mock API service
// export const roleService = {
//   createRole: async ({
//     projectId: _projectId,
//     data,
//   }: CreateRoleRequest): Promise<CreateRoleResponse> => {
//     /*
//      // reminder: example API call
//      return post<CreateRoleResponse, CreateRoleSchema>(
//         `/projects/${_projectId}/roles`,
//         data
//       );
//       */

//     // Simulate API delay
//     await new Promise((resolve) => setTimeout(resolve, 1000));

//     // Mock role creation
//     const newRole: ProjectRole = {
//       id: Date.now().toString(),
//       title: data.title,
//       description: data.description,
//       techStacks: data.techStack.map((id) => ({
//         id,
//         name: `Tech-${id}`, // In real app, would fetch from backend
//         iconUrl: "",
//       })),
//     };

//     // Simulate random success/failure (90% success rate)
//     const isSuccess = Math.random() > 0.1;

//     if (!isSuccess) {
//       throw new Error("Erreur lors de la création du rôle");
//     }

//     return {
//       role: newRole,
//       success: true,
//       message: "Rôle créé avec succès",
//     };
//   },
