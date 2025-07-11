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

export type CreateRoleSchema = z.infer<typeof createRoleSchema>;

// Update schema - reuses the same validation as create
export const updateRoleSchema = createRoleSchema;
export type UpdateRoleSchema = z.infer<typeof updateRoleSchema>;
