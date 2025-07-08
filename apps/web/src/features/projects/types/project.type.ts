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
}

export interface ExternalLink {
  type: "github" | "website" | "discord" | "twitter" | "other";
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

// Types pour l'API backend
export interface CreateProjectApiRequest {
  title: string;
  description: string;
  shortDescription: string;
  techStacks: string[]; // IDs des tech stacks
  projectRoles: {
    title: string;
    description: string;
    techStacks: string[]; // IDs des tech stacks
  }[];
}

export interface CreateProjectApiResponse {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  techStacks: TechStack[];
  projectRoles: ProjectRole[];
  externalLinks: ExternalLink[];
  createdAt: string;
  updatedAt: string;
}
