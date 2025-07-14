import { ProjectRole } from "../types/project.type";
import {
  CreateRoleSchema,
  UpdateRoleSchema,
} from "../validations/project-role.schema";

export interface CreateRoleRequest {
  projectId: string;
  data: CreateRoleSchema;
}

export interface CreateRoleResponse {
  role: ProjectRole;
  success: boolean;
  message: string;
}

export interface UpdateRoleRequest {
  projectId: string;
  roleId: string;
  data: UpdateRoleSchema;
}

export interface UpdateRoleResponse {
  role: ProjectRole;
  success: boolean;
  message: string;
}

// Mock API service
export const roleService = {
  createRole: async ({
    projectId: _projectId,
    data,
  }: CreateRoleRequest): Promise<CreateRoleResponse> => {
    /*
     // reminder: example API call
     return post<CreateRoleResponse, CreateRoleSchema>(
        `/projects/${_projectId}/roles`,
        data
      );
      */

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock role creation
    const newRole: ProjectRole = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      techStacks: data.techStack.map((id) => ({
        id,
        name: `Tech-${id}`, // In real app, would fetch from backend
        iconUrl: "",
      })),
    };

    // Simulate random success/failure (90% success rate)
    const isSuccess = Math.random() > 0.1;

    if (!isSuccess) {
      throw new Error("Erreur lors de la création du rôle");
    }

    return {
      role: newRole,
      success: true,
      message: "Rôle créé avec succès",
    };
  },

  updateRole: async ({
    projectId: _projectId,
    roleId,
    data,
  }: UpdateRoleRequest): Promise<UpdateRoleResponse> => {
    /*
     // reminder: example API call
     return put<UpdateRoleResponse, UpdateRoleSchema>(
        `/projects/${_projectId}/roles/${roleId}`,
        data
      );
      */

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock role update
    const updatedRole: ProjectRole = {
      id: roleId,
      title: data.title,
      description: data.description,
      techStacks: data.techStack.map((id) => ({
        id,
        name: `Tech-${id}`, // In real app, would fetch from backend
        iconUrl: "",
      })),
    };

    // Simulate random success/failure (90% success rate)
    const isSuccess = Math.random() > 0.1;

    if (!isSuccess) {
      throw new Error("Erreur lors de la modification du rôle");
    }

    return {
      role: updatedRole,
      success: true,
      message: "Rôle modifié avec succès",
    };
  },
};
