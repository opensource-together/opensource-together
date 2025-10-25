import { CategoryType } from "@/shared/types/category.type";
import { TechStackType } from "@/shared/types/tech-stack.type";

export interface Project {
  id?: string;
  publicId?: string;
  title: string;
  imagesUrls: string[];
  logoUrl: string | null;
  provider: "GITHUB" | "GITLAB";
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
  createdAt: Date;
  updatedAt: Date;
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
  number: number;
  title: string;
  status: string;
  body: string | null;
  labels: string[];
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  author: {
    login: string | undefined;
    avatar_url: string | undefined;
  };
  url: string;
};

export type IssueLabels = {
  id: number;
  description: string | null;
  name: string;
  color: string;
};

export type RepositoryLanguages = {
  [language: string]: number;
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
  pullRequestsCount: number;
  subscribersCount: number;
  visibility: string | null | undefined;
  languages: RepositoryLanguages;
  contributors: Contributor[];
  issues: Issue[];
  issueLabels: IssueLabels[];
  pullRequests: PullRequest[];
  readme: string;
  contributionFile: string | undefined;
  cocFile: string | undefined;
};

export type Owner = {
  id: string;
  name: string;
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
