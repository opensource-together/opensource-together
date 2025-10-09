import { CategoryType } from "@/shared/types/category.type";
import { TechStackType } from "@/shared/types/tech-stack.type";

export interface Owner {
  id: string;
  username: string;
  avatarUrl?: string;
  techStacks?: TechStackType[];
}

export interface Contributor {
  id: string;
  username: string;
  avatarUrl: string | null;
  contributions: number;
}

export interface ExternalLink {
  id?: string;
  type: "GITHUB" | "WEBSITE" | "DISCORD" | "TWITTER" | "LINKEDIN" | "OTHER";
  url: string;
}

export interface LastCommit {
  sha: string;
  message: string;
  date: string;
  url: string;
  author: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
}

export interface ProjectStats {
  contributors?: Contributor[];
  stars?: number;
  forks?: number;
  watchers?: number;
  openIssues?: number;
  commits?: number;
  lastCommit?: LastCommit;
}

export interface Collaborator {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  collaboratorsCount?: number;
}

export interface Project {
  id?: string;
  publicId?: string;
  title: string;
  imagesUrls: string[];
  logoUrl: string | null;
  provider: "GITHUB" | "GITLAB" | "SCRATCH";
  readme: string | null;
  owner: Owner;
  description: string;
  projectTechStacks: TechStackType[];
  published: boolean;
  githubUrl: string | null;
  gitlabUrl: string | null;
  discordUrl: string | null;
  twitterUrl: string | null;
  linkedinUrl: string | null;
  websiteUrl: string | null;
  projectStats?: ProjectStats;
  projectCategories: CategoryType[];
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
  githubUrl: string | null;
  gitlabUrl: string | null;
  discordUrl: string | null;
  twitterUrl: string | null;
  linkedinUrl: string | null;
  websiteUrl: string | null;
  projectTechStacks: TechStackType[];
  projectCategories?: CategoryType[];
}
