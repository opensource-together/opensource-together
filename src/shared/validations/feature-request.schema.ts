import { z } from "zod";

export const featureRequestSchema = z.object({
  request: z
    .string()
    .min(10, "Request must contain at least 10 characters")
    .max(2000, "Request cannot exceed 2000 characters")
    .trim(),
});

export type FeatureRequestFormData = z.infer<typeof featureRequestSchema>;
