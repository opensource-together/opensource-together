import { z } from "zod";

export const techStackOptions = [
  "React",
  "Next.js",
  "Node.js",
  "TypeScript",
  "Python",
  "Java",
  "Vue.js",
] as const;

export const roleOptions = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "UI/UX Designer",
  "DevOps Engineer",
] as const;

export const difficultyOptions = [
  "Débutant",
  "Intermédiaire",
  "Avancé",
] as const;

export const sortOptions = [
  "Plus Récent",
  "Plus Ancien",
  "Plus Populaire",
] as const;

export const filtersSchema = z.object({
  techStack: z.enum(techStackOptions).optional(),
  role: z.enum(roleOptions).optional(),
  difficulty: z.enum(difficultyOptions).optional(),
  sort: z.enum(sortOptions).optional(),
});

export type FiltersFormData = z.infer<typeof filtersSchema>;
