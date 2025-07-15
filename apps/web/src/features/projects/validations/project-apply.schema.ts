import { z } from "zod";

export const roleApplicationSchema = z.object({
  keyFeatures: z
    .array(z.string())
    .min(1, "Au moins une fonctionnalité clé doit être sélectionnée"),
  projectGoals: z
    .array(z.string())
    .min(1, "Au moins un objectif de projet doit être sélectionné"),
  motivationLetter: z
    .string()
    .min(20, "La lettre de motivation doit contenir au moins 20 caractères")
    .refine(
      (val) => !val || val.length >= 10,
      "La lettre de motivation doit contenir au moins 10 caractères"
    ),
});

export type RoleApplicationSchema = z.infer<typeof roleApplicationSchema>;
