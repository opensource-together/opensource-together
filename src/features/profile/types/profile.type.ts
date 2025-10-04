import { Project } from "@/features/projects/types/project.type";

export type ProfileTechStack = {
  id: string;
  name: string;
  iconUrl: string;
  type: "LANGUAGE" | "TECH";
  createdAt: string;
  updatedAt: string;
};

export type ContributionLevel =
  | "NONE"
  | "FIRST_QUARTILE"
  | "SECOND_QUARTILE"
  | "THIRD_QUARTILE"
  | "FOURTH_QUARTILE";

export type ContributionDay = {
  date: string;
  contributionCount: number;
  contributionLevel: ContributionLevel;
  color: string;
};

export type ContributionWeek = {
  contributionDays: ContributionDay[];
};

export type ContributionGraph = {
  weeks: ContributionWeek[];
  totalContributions: number;
  maxContributions?: number;
};

export type GithubStats = {
  totalStars: number;
  contributedRepos: number;
  commitsThisYear: number;
  contributionGraph: ContributionGraph;
};

export type Profile = {
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
  discordUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  userTechStacksIds?: string[];
  userTechStacks?: ProfileTechStack[];
  projects?: Project[];
};
