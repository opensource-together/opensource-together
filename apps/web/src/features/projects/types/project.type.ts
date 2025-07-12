export interface Author {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface TechStack {
  id: string;
  name: string;
  iconUrl?: string;
}

export interface ProjectRole {
  id?: string;
  title: string;
  description: string;
  techStacks: TechStack[];
  roleCount?: number;
  projectGoal?: ProjectGoal[];
}

export interface ExternalLink {
  type: "github" | "website" | "discord" | "twitter" | "linkedin" | "other";
  url: string;
}

export interface ProjectStats {
  contributors?: number;
  stars?: number;
  forks?: number;
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
  title: string;
}

export interface ProjectGoal {
  id?: string;
  goal: string;
}

export interface Project {
  id?: string;
  slug?: string;
  title: string;
  image?: string;
  author: Author;
  shortDescription: string;
  longDescription?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  collaborators?: Collaborator[];
  techStacks: TechStack[];
  roles: ProjectRole[];
  externalLinks?: ExternalLink[];
  projectStats?: ProjectStats;
  keyFeatures: KeyFeature[];
  projectGoals: ProjectGoal[];
  categories: Category[];
  lastCommitAt?: Date;
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
