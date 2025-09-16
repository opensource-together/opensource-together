import { Project } from "@/features/projects/types/project.type";

export type ProfileSocialLink = {
  github?: string;
  discord?: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
};

export type ProfileTechStack = {
  id: string;
  name: string;
  iconUrl: string;
  type: "LANGUAGE" | "TECH";
};

export type ContributionDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export type ContributionWeek = {
  days: ContributionDay[];
};

export type ContributionGraph = {
  weeks: ContributionWeek[];
  totalContributions: number;
  maxContributions: number;
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
  socialLinks?: ProfileSocialLink;
  techStacks?: ProfileTechStack[];
  projects?: Project[];
};
