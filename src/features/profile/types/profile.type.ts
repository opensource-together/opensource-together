import { TechStackType } from "@/shared/types/tech-stack.type";

import { ContributionGraph, GithubStats } from "./github-graph.type";

export interface Profile {
  id: string;
  publicId?: string;
  name: string;
  email?: string;
  emailVerified?: boolean;
  image: string;
  jobTitle?: string;
  bio?: string;
  provider?: string;
  contributionsCount?: number;
  createdAt?: string;
  updatedAt?: string;
  githubStats?: GithubStats;
  contributionGraph?: ContributionGraph;
  githubUrl?: string;
  gitlabUrl?: string;
  discordUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  userTechStacksIds?: string[];
  userTechStacks?: TechStackType[];
}
