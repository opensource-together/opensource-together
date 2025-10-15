import { CategoryType } from "@/shared/types/category.type";
import { TechStackType } from "@/shared/types/tech-stack.type";

export interface Project {
  id?: string;
  publicId?: string;
  title: string;
  imagesUrls: string[];
  logoUrl: string | null;
  provider: "GITHUB" | "GITLAB" | "SCRATCH";
  readme: string | null;
  description: string;
  published: boolean;
  repoUrl: string | null;
  githubUrl: string | null;
  gitlabUrl: string | null;
  discordUrl: string | null;
  twitterUrl: string | null;
  linkedinUrl: string | null;
  websiteUrl: string | null;
  projectTechStacks: TechStackType[];
  projectCategories: CategoryType[];
  repositoryDetails: RepositoryWithDetails;
  owner?: Owner;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProjectEditForm {
  id?: string;
  publicId?: string;
  logoUrl?: string;
  title: string;
  description: string;
  published: boolean;
  repoUrl: string | null;
  githubUrl: string | null;
  gitlabUrl: string | null;
  discordUrl: string | null;
  twitterUrl: string | null;
  linkedinUrl: string | null;
  websiteUrl: string | null;
  projectTechStacks: TechStackType[];
  projectCategories?: CategoryType[];
}

export type Contributor = {
  login: string | undefined;
  avatar_url: string | undefined;
  contributions: number;
};

export type PullRequest = {
  title: string;
  state: string;
  draft: boolean | undefined;
  number: number;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  merged_at: string | null;
  url: string;
  author: {
    login: string | undefined;
    avatar_url: string | undefined;
  };
};

export type Issue = {
  title: string;
  status: string;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  author: {
    login: string | undefined;
    avatar_url: string | undefined;
  };
  url: string;
};

export type RepositoryWithDetails = {
  name: string;
  description: string | null;
  url: string | null;
  html_url: string;
  created_at: string | null | undefined;
  updated_at: string | null | undefined;
  pushed_at: string | null | undefined;
  stars: number;
  tags: string[];
  forksCount: number;
  openIssuesCount: number;
  subscribersCount: number;
  visibility: string | null | undefined;
  owner: {
    login: string | undefined;
    avatar_url: string | undefined;
  };
  contributors: Contributor[];
  issues: Issue[];
  pullRequests: PullRequest[];
  readme: string;
  contributionFile: string | undefined;
  cocFile: string | undefined;
};

// Lightweight owner information used across the app
export type Owner = {
  id: string;
  username: string;
  avatarUrl: string | null;
};

export type LastCommitAuthor = {
  login: string | undefined;
  avatar_url: string | undefined;
  html_url: string | undefined;
};

export type LastCommit = {
  sha: string;
  message: string;
  date: string;
  url: string;
  author: LastCommitAuthor;
};

export type ProjectStats = {
  forks: number;
  contributors: Contributor[];
  stars: number;
  watchers: number;
  openIssues: number;
  commits: number;
  lastCommit: LastCommit;
};
