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
}

export interface SocialLink {
  type: "github" | "website" | "discord" | "twitter" | "other";
  url: string;
}

export interface CommunityStats {
  contributors?: number;
  stars?: number;
  forks?: number;
}

export interface Category {
  id: string;
  name: string;
}

export interface Collaborator {
  id?: string;
  name?: string;
  email?: string;
}

export interface KeyFeature {
  id?: string;
  name: string;
}

export interface ProjectGoal {
  id?: string;
  name: string;
}

// Interface Project complète
export interface Project {
  id?: string;
  slug?: string;
  title: string;
  image?: string;
  authorName?: string;
  authorImage?: string;
  description: string;
  longDescription?: string;
  collaborator?: Collaborator[];
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  difficulty?: "Facile" | "Moyenne" | "Difficile";
  techStacks: TechStack[];
  roles?: ProjectRole[];
  socialLinks?: SocialLink[];
  communityStats?: CommunityStats;
  keyFeatures?: KeyFeature[];
  projectGoals?: ProjectGoal[];
  categories?: Category[];
  lastCommit?: string;
  createdAt?: string;
  updatedAt?: string;
}
