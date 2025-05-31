import { z } from "zod";

export const techStackOptions = [
  // Frontend Frameworks & Libraries
  "React",
  "Next.js",
  "Vue.js",
  "Angular",
  "Svelte",
  "Nuxt.js",
  "Gatsby",
  "Remix",
  "Solid.js",

  // Backend Technologies
  "Node.js",
  "Express",
  "NestJS",
  "Django",
  "Flask",
  "Spring Boot",
  "Laravel",
  "Ruby on Rails",
  "FastAPI",

  // Programming Languages
  "TypeScript",
  "JavaScript",
  "Python",
  "Java",
  "C#",
  "Go",
  "Rust",
  "PHP",
  "Ruby",

  // Databases
  "PostgreSQL",
  "MongoDB",
  "MySQL",
  "Redis",
  "Elasticsearch",
  "Cassandra",

  // Mobile Development
  "React Native",
  "Flutter",
  "Swift",
  "Kotlin",

  // DevOps & Cloud
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "Google Cloud",
  "Jenkins",
  "GitLab CI",
  "GitHub Actions",
] as const;

export const roleOptions = [
  "Développeur Frontend",
  "Développeur Backend",
  "Développeur Full Stack",
  "Designer UI/UX",
  "Ingénieur DevOps",
  "Architecte Logiciel",
  "Ingénieur en Assurance Qualité",
  "Analyste de Données",
  "Ingénieur en Intelligence Artificielle",
  "Spécialiste en Sécurité Informatique",
  "Administrateur Système",
  "Gestionnaire de Projet Technique",
  "Développeur Mobile",
  "Ingénieur en Base de Données",
  "Spécialiste SEO",
  "Développeur Blockchain",
  "Ingénieur IoT",
  "Spécialiste en Réalité Virtuelle/Augmentée",
  "Ingénieur en Automatisation",
  "Développeur de Jeux Vidéo",
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
