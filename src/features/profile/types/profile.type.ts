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

export type PullRequestQueryParams = {
  provider?: "github" | "gitlab";
  page?: number;
  per_page?: number;
  state?: "open" | "closed" | "merged" | "all";
};

export type UserPullRequest = {
  title: string;
  repository: string;
  owner: string | null;
  state: "OPEN" | "CLOSED" | "MERGED" | "merged" | "closed" | "open";
  draft: boolean;
  number: number;
  created_at: string;
  updated_at: string | null;
  closed_at: string | null;
  merged_at: string | null;
  url: string;
  branch: {
    from: string;
    to: string;
  };
};

export type PullRequestPagination = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type PullRequestProviderData = {
  data: UserPullRequest[];
  pagination: PullRequestPagination;
};

export type PullRequestsResponse = {
  github?: PullRequestProviderData | null;
  gitlab?: PullRequestProviderData | null;
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
  gitlabUrl?: string;
  discordUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  userTechStacksIds?: string[];
  userTechStacks?: ProfileTechStack[];
  projects?: Project[];
};
