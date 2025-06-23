import { z } from "zod";

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

export type RoleFormData = z.infer<typeof roleSchema>;
export type StepThreeFormData = z.infer<typeof stepThreeSchema>;
export type NewRoleFormData = z.infer<typeof newRoleSchema>;
