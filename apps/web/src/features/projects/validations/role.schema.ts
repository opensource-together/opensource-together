import { z } from "zod";

// ========================================
// CREATE ROLE SCHEMA
// ========================================

export const createRoleSchema = z.object({
  title: z.string().min(1, "Le titre du rôle est requis"),
  techStack: z
    .array(z.string())
    .min(1, "Au moins une technologie est requise")
    .max(6, "Maximum 6 technologies autorisées"),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères")
    .max(250, "La description ne peut pas dépasser 250 caractères"),
});

export const updateRoleSchema = createRoleSchema;

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

export type CreateRoleSchema = z.infer<typeof createRoleSchema>;
export type UpdateRoleSchema = z.infer<typeof updateRoleSchema>;
export type RoleApplicationSchema = z.infer<typeof roleApplicationSchema>;
