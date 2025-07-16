import { z } from "zod";

// ========================================
// CREATE ROLE SCHEMA
// ========================================

export const projectRoleSchema = z.object({
  title: z
    .string()
    .min(5, "Le titre du rôle doit contenir au moins 5 caractères"),
  techStacks: z
    .array(z.string())
    .min(1, "Au moins une technologie est requise")
    .max(6, "Maximum 6 technologies autorisées"),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères")
    .max(250, "La description ne peut pas dépasser 250 caractères"),
});

export const createProjectRoleSchema = projectRoleSchema;

export const updateProjectRoleSchema = projectRoleSchema;

// ========================================
// ROLE APPLICATION SCHEMA
// ========================================

export const roleApplicationSchema = z.object({
  question1: z
    .string()
    .min(20, "La contribution doit contenir au moins 20 caractères")
    .max(200, "La contribution ne peut pas dépasser 200 caractères"),
  projectGoal: z.string().min(1, "Veuillez faire une sélection"),
});

// ========================================
// TYPE EXPORTS
// ========================================

export type ProjectRoleSchema = z.infer<typeof projectRoleSchema>;
export type CreateProjectRoleSchema = z.infer<typeof createProjectRoleSchema>;
export type UpdateProjectRoleSchema = z.infer<typeof updateProjectRoleSchema>;
export type RoleApplicationSchema = z.infer<typeof roleApplicationSchema>;
