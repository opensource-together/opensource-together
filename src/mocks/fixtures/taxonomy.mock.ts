import type { CategoryType } from "@/shared/types/category.type";
import type { TechStackType } from "@/shared/types/tech-stack.type";

import { mockPublicId } from "../public-id.mock";

const now = new Date("2025-01-01T00:00:00.000Z").toISOString();

const tech = (
  id: string,
  name: string,
  iconUrl: string,
  type: TechStackType["type"]
): TechStackType => ({
  id,
  name,
  iconUrl,
  type,
  createdAt: now,
  updatedAt: now,
});

export const categories: CategoryType[] = [
  { id: mockPublicId("cat", 1), name: "Web Development" },
  { id: mockPublicId("cat", 2), name: "Developer Tools" },
  { id: mockPublicId("cat", 3), name: "Artificial Intelligence" },
  { id: mockPublicId("cat", 4), name: "Databases" },
  { id: mockPublicId("cat", 5), name: "DevOps" },
  { id: mockPublicId("cat", 6), name: "Mobile" },
  { id: mockPublicId("cat", 7), name: "Security" },
  { id: mockPublicId("cat", 8), name: "Data Science" },
];

const icon = (slug: string) =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-original.svg`;

export const techStacks: TechStackType[] = [
  tech(mockPublicId("tst", 1), "TypeScript", icon("typescript"), "LANGUAGE"),
  tech(mockPublicId("tst", 2), "JavaScript", icon("javascript"), "LANGUAGE"),
  tech(mockPublicId("tst", 3), "Python", icon("python"), "LANGUAGE"),
  tech(mockPublicId("tst", 4), "Rust", icon("rust"), "LANGUAGE"),
  tech(mockPublicId("tst", 5), "Go", icon("go"), "LANGUAGE"),
  tech(mockPublicId("tst", 6), "Java", icon("java"), "LANGUAGE"),
  tech(mockPublicId("tst", 7), "React", icon("react"), "TECH"),
  tech(mockPublicId("tst", 8), "Next.js", icon("nextjs"), "TECH"),
  tech(mockPublicId("tst", 9), "NestJS", icon("nestjs"), "TECH"),
  tech(mockPublicId("tst", 10), "Node.js", icon("nodejs"), "TECH"),
  tech(mockPublicId("tst", 11), "PostgreSQL", icon("postgresql"), "TECH"),
  tech(mockPublicId("tst", 12), "Docker", icon("docker"), "TECH"),
  tech(mockPublicId("tst", 13), "Tailwind CSS", icon("tailwindcss"), "TECH"),
  tech(mockPublicId("tst", 14), "Prisma", icon("prisma"), "TECH"),
  tech(mockPublicId("tst", 15), "C", icon("c"), "LANGUAGE"),
  tech(mockPublicId("tst", 16), "C++", icon("cplusplus"), "LANGUAGE"),
  tech(mockPublicId("tst", 17), "C#", icon("csharp"), "LANGUAGE"),
  tech(mockPublicId("tst", 18), "Kotlin", icon("kotlin"), "LANGUAGE"),
  tech(mockPublicId("tst", 19), "Swift", icon("swift"), "LANGUAGE"),
  tech(mockPublicId("tst", 20), "Dart", icon("dart"), "LANGUAGE"),
  tech(mockPublicId("tst", 21), "Ruby", icon("ruby"), "LANGUAGE"),
  tech(mockPublicId("tst", 23), "Shell", icon("bash"), "LANGUAGE"),
  tech(mockPublicId("tst", 24), "Vue", icon("vuejs"), "TECH"),
  tech(mockPublicId("tst", 25), "Svelte", icon("svelte"), "TECH"),
  tech(mockPublicId("tst", 26), "Angular", icon("angularjs"), "TECH"),
  tech(mockPublicId("tst", 27), "Django", icon("django"), "TECH"),
  tech(mockPublicId("tst", 28), "FastAPI", icon("fastapi"), "TECH"),
  tech(mockPublicId("tst", 29), "Kubernetes", icon("kubernetes"), "TECH"),
];
