import type { Project } from "@/features/projects/types/project.type";

import rawProjects from "./projects.mock.json";

type SerializedProject = Omit<Project, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export const projectsResponse: Project[] = (
  rawProjects as unknown as SerializedProject[]
).map((project) => ({
  ...project,
  repositoryDetails: {
    ...project.repositoryDetails,
    contributionFile: project.repositoryDetails.contributionFile ?? undefined,
    cocFile: project.repositoryDetails.cocFile ?? undefined,
  },
  createdAt: new Date(project.createdAt),
  updatedAt: new Date(project.updatedAt),
}));

function projectId(repoUrl: string): string {
  const id = projectsResponse.find(
    (project) => project.repoUrl === repoUrl
  )?.id;
  if (!id) throw new Error(`Mock project fixture is missing: ${repoUrl}`);
  return id;
}

export const PROJECT_IDS = {
  polar: projectId("https://github.com/polarsource/polar"),
  mistralCommon: projectId("https://github.com/mistralai/mistral-common"),
  betterAuth: projectId("https://github.com/better-auth/better-auth"),
  hermesAgent: projectId("https://github.com/NousResearch/hermes-agent"),
  steelBrowser: projectId("https://github.com/steel-dev/steel-browser"),
  react: projectId("https://github.com/facebook/react"),
  supabase: projectId("https://github.com/supabase/supabase"),
  svelte: projectId("https://github.com/sveltejs/svelte"),
  codex: projectId("https://github.com/openai/codex"),
} as const;
