import { z } from "zod";

export const scratchStepOneSchema = z.object({
  projectName: z
    .string()
    .min(1, "Le nom du projet est requis")
    .max(100, "Le nom du projet ne peut pas dépasser 100 caractères"),
  description: z
    .string()
    .min(1, "La description est requise")
    .max(250, "La description ne peut pas dépasser 250 caractères"),
  website: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true; // Optional field
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      },
      { message: "L'URL du site web n'est pas valide" }
    ),
});

export type ScratchStepOneFormData = z.infer<typeof scratchStepOneSchema>;
