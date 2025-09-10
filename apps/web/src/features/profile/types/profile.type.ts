import { Project } from "@/features/projects/types/project.type";

export type ProfileSocialLinks = {
  name: string;
  url: string;
};

export type ProfileTechStack = {
  id: string;
  name: string;
  iconUrl: string;
  type: "LANGUAGE" | "TECH";
};

export type ProfileExperience = {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
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
  username: string;
  avatarUrl: string;
  jobTitle?: string;
  bio?: string;
  location?: string;
  provider: string;
  company?: string;
  contributionsCount?: number;
  joinedAt?: string;
  profileUpdatedAt?: string;
  email?: string;
  githubStats?: GithubStats;
  socialLinks?: ProfileSocialLinks;
  techStacks?: ProfileTechStack[];
  experiences?: ProfileExperience[];
  projects?: Project[];
};
