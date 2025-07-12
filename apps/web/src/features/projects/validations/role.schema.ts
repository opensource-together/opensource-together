import { z } from "zod";

export const createRoleSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  techStackIds: z
    .array(z.string())
    .min(1, "Veuillez sélectionner au moins une technologie"),
  description: z
    .string()
    .max(200, "La description ne peut pas dépasser 200 caractères")
    .min(1, "La description est requise"),
});

export const updateRoleSchema = createRoleSchema;

export const roleApplicationSchema = z.object({
  question1: z
    .string()
    .min(20, "La contribution doit contenir au moins 20 caractères")
    .max(200, "La contribution ne peut pas dépasser 200 caractères"),
  projectGoal: z.string().min(1, "Veuillez faire une sélection"),
});

export type CreateRoleSchema = z.infer<typeof createRoleSchema>;
export type UpdateRoleSchema = z.infer<typeof updateRoleSchema>;
export type RoleApplicationSchema = z.infer<typeof roleApplicationSchema>;
