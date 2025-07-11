import { ProjectRole } from "../types/project.type";
import { CreateRoleSchema } from "../validations/role.schema";

export interface CreateRoleRequest {
  projectId: string;
  data: CreateRoleSchema;
}

export interface CreateRoleResponse {
  role: ProjectRole;
  success: boolean;
  message: string;
}

// Mock API service
export const roleService = {
  createRole: async ({
    projectId,
    data,
  }: CreateRoleRequest): Promise<CreateRoleResponse> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock role creation
    const newRole: ProjectRole = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      techStacks: data.techStackIds.map((id) => ({
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
};
