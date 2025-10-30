import { z } from "zod";

export const onboardingSchema = z.object({
  jobTitle: z
    .string()
    .min(1, "Job title is required")
    .max(200, "Job title cannot exceed 200 characters"),
  techStacks: z
    .array(z.string())
    .min(1, "At least one technology is required")
    .max(10, "Maximum 10 technologies allowed"),
  userCategories: z
    .array(z.string())
    .min(1, "At least one category is required")
    .max(6, "Maximum 6 categories allowed"),
});

export type OnboardingSchema = z.infer<typeof onboardingSchema>;
