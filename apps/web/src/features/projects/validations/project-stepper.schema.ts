import { z } from "zod";

// Step 1: Basic Project Information
export const stepOneSchema = z.object({
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
        if (!value) return true;
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

// Step 3: Project Roles and Tech Stack
export const roleSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Le titre du rôle est requis"),
  description: z
    .string()
    .min(1, "La description du rôle est requise")
    .max(250, "La description ne peut pas dépasser 250 caractères"),
  skillLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  skills: z.array(z.string()),
  isOpen: z.boolean(),
});

export const stepThreeSchema = z.object({
  collaborators: z.array(z.string()),
  techStack: z.array(z.string()),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  roles: z.array(roleSchema).min(1, "Au moins un rôle est requis"),
});

export const newRoleSchema = z.object({
  title: z.string().min(1, "Le titre du rôle est requis"),
  description: z
    .string()
    .min(1, "La description est requise")
    .max(250, "Maximum 250 caractères"),
  skills: z.array(z.string()),
  skillLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
});

// Combined schema for the entire project creation form
export const createProjectSchema = z.object({
  stepOne: stepOneSchema,
  stepThree: stepThreeSchema,
});

// Type exports
export type StepOneFormData = z.infer<typeof stepOneSchema>;
export type RoleFormData = z.infer<typeof roleSchema>;
export type StepThreeFormData = z.infer<typeof stepThreeSchema>;
export type NewRoleFormData = z.infer<typeof newRoleSchema>;
export type CreateProjectFormData = z.infer<typeof createProjectSchema>;
