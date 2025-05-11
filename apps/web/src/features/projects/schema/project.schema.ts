import { z } from "zod";

// Schéma pour les technologies
const techStackSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nom de technologie requis"),
  iconUrl: z.string().optional(),
});

// Schéma pour les badges
const badgeSchema = z.object({
  label: z.string(),
  color: z.string(),
  bgColor: z.string(),
});

// Schéma pour les rôles
const roleSchema = z.object({
  title: z.string().min(1, "Titre du rôle requis"),
  description: z.string().min(1, "Description du rôle requise"),
  badges: z.array(badgeSchema),
  experienceBadge: z.string().optional(),
});

// Schéma pour les liens sociaux
const socialLinkSchema = z.object({
  type: z.enum(["github", "website", "discord", "twitter", "other"], {
    errorMap: () => ({ message: "Type de lien social invalide" }),
  }),
  url: z.string().url("URL invalide"),
});

// Schéma principal du projet
export const projectSchema = z.object({
  title: z.string().min(1, "Le titre du projet est requis"),
  description: z.string().min(1, "Une courte description est requise"),
  longDescription: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"], {
    errorMap: () => ({ message: "Statut invalide" }),
  }),
  techStacks: z.array(techStackSchema),
  roles: z.array(roleSchema).optional(),
  keyBenefits: z.array(z.string()).optional(),
  socialLinks: z.array(socialLinkSchema).optional(),
});

// Type inféré du schéma pour l'utilisation avec React Hook Form
export type ProjectFormData = z.infer<typeof projectSchema>; 