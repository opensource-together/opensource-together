import { ProjectRole } from "./project-role.type";

export interface Author {
  ownerId: string;
  name: string;
  avatarUrl?: string;
}

export interface TechStack {
  id: string;
  name: string;
  iconUrl?: string;
}

export interface ExternalLink {
  type: "github" | "website" | "discord" | "twitter" | "linkedin" | "other";
  url: string;
}

export interface ProjectStats {
  contributors?: number;
  stars?: number;
  forks?: number;
  lastCommitAt?: Date;
}

export interface Category {
  id: string;
  name: string;
}

export interface Collaborator {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  role?: string;
  collaboratorsCount?: number;
}

export interface KeyFeature {
  id?: string;
  projectId?: string;
  feature: string;
}

export interface ProjectGoal {
  id?: string;
  projectId?: string;
  goal: string;
}

export interface Project {
  id?: string;
  ownerId?: string;
  slug?: string;
  title: string;
  image?: string;
  author: Author;
  shortDescription: string;
  longDescription?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  collaborators?: Collaborator[];
  techStacks: TechStack[];
  projectRoles: ProjectRole[];
  externalLinks?: ExternalLink[];
  projectStats?: ProjectStats;
  keyFeatures: KeyFeature[];
  projectGoals: ProjectGoal[];
  categories: Category[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Type for the project edit form with string-based keyFeatures and projectGoals
export interface ProjectEditForm {
  image?: File;
  title: string;
  description: string;
  longDescription?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  techStacks: TechStack[];
  roles?: {
    title: string;
    description: string;
    experienceBadge?: string;
    badges?: string[];
    techStacks?: TechStack[];
  }[];
  keyBenefits?: string[];
  socialLinks?: {
    type: "github" | "website" | "discord" | "twitter" | "linkedin" | "other";
    url: string;
  }[];
  keyFeatures?: string;
  projectGoals?: string;
  categories?: Category[];
}
