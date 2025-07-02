import { z } from "zod";

const keyFeatureSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
});

const projectGoalSchema = z.object({
  id: z.string().optional(),
  goal: z.string(),
});

const externalLinkSchema = z.object({
  type: z.enum(["github", "website", "discord", "twitter", "other"]),
  url: z.string().url("URL invalide"),
});

// Step 1: Basic Project Information
export const stepOneSchema = z.object({
  projectName: z
    .string()
    .min(3, "Le nom du projet doit contenir au moins 3 caractères"),
  shortDescription: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères"),
  keyFeatures: z
    .array(keyFeatureSchema)
    .min(1, "Au moins une fonctionnalité clé est requise"),
  projectGoals: z
    .array(projectGoalSchema)
    .min(1, "Au moins un objectif de projet est requis"),
});

// Step 2: Tech Stack and Categories
export const stepTwoSchema = z.object({
  techStack: z.array(z.string()).min(1, "Au moins une technologie est requise"),
  categories: z.array(z.string()).min(1, "Au moins une catégorie est requise"),
  image: z.string().optional(),
  externalLinks: z.array(externalLinkSchema).optional(),
});

// Step 3: Project Roles
export const roleSchema = z.object({
  title: z.string().min(1, "Le titre du rôle est requis"),
  description: z
    .string()
    .min(1, "La description est requise")
    .max(250, "La description ne peut pas dépasser 250 caractères"),
  techStack: z
    .array(z.string())
    .min(1, "Au moins une technologie est requise")
    .max(6, "Maximum 6 technologies autorisées"),
});

export const stepThreeSchema = z.object({
  roles: z.array(roleSchema).min(1, "Au moins un rôle est requis"),
});

// Combined schema for the entire project creation form
export const createProjectSchema = z.object({
  method: z.enum(["github", "scratch"]).nullable(),
  ...stepOneSchema.shape,
  ...stepTwoSchema.shape,
  ...stepThreeSchema.shape,
  selectedRepository: z
    .object({
      name: z.string(),
      date: z.string(),
    })
    .nullable(),
});

// Type exports
export type StepOneFormData = z.infer<typeof stepOneSchema>;
export type StepTwoFormData = z.infer<typeof stepTwoSchema>;
export type RoleFormData = z.infer<typeof roleSchema>;
export type StepThreeFormData = z.infer<typeof stepThreeSchema>;
export type CreateProjectFormData = z.infer<typeof createProjectSchema>;
