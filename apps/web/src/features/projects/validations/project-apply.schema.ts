import { z } from "zod";

export const roleApplicationSchema = z.object({
  keyFeatures: z
    .array(z.string())
    .min(1, "Au moins une fonctionnalité clé doit être sélectionnée"),
  motivationLetter: z
    .string()
    .min(20, "La lettre de motivation doit contenir au moins 20 caractères"),
});

export type RoleApplicationSchema = z.infer<typeof roleApplicationSchema>;
