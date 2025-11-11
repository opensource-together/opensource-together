import { z } from "zod";

export const featureRequestSchema = z.object({
  request: z
    .string()
    .min(10, "La demande doit contenir au moins 10 caractères")
    .max(2000, "La demande ne peut pas dépasser 2000 caractères")
    .trim(),
});

export type FeatureRequestFormData = z.infer<typeof featureRequestSchema>;

