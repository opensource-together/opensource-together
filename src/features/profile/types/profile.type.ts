import type { CategoryType } from "@/shared/types/category.type";
import type { TechStackType } from "@/shared/types/tech-stack.type";

import type { ContributionGraph, GithubStats } from "./github-graph.type";

export interface Profile {
  id: string;
  publicId?: string;
  name: string;
  email?: string;
  emailVerified?: boolean;
  image: string;
  banner?: string | null;
  jobTitle?: string;
  bio?: string;
  provider?: string;
  contributionsCount?: number;
  createdAt?: string;
  updatedAt?: string;
  githubUrl?: string;
  gitlabUrl?: string;
  discordUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  connectedProviders?: string[];
  userTechStacksIds?: string[];
  betaTester: boolean;
  userTechStacks?: TechStackType[];
  userCategories?: CategoryType[];
  userExperiences?: UserExperience[];
  githubStats?: GithubStats;
  contributionGraph?: ContributionGraph;
}

export interface UserExperience {
  title: string;
  startAt: string;
  endAt?: string | null;
  url?: string | null;
}
