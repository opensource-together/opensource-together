export interface Owner {
  id: string;
  username: string;
  avatarUrl?: string;
  techStacks?: TechStack[];
}

export interface Contributor {
  id: string;
  username: string;
  avatarUrl: string | null;
  contributions: number;
}

export interface TechStack {
  id: string;
  name: string;
  iconUrl?: string;
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

export interface Category {
  id: string;
  name: string;
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
  slug?: string;
  title: string;
  image?: string;
  coverImages?: string[];
  readme?: string;
  owner: Owner;
  description: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  techStacks: TechStack[];
  externalLinks?: ExternalLink[];
  projectStats?: ProjectStats;
  categories: Category[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProjectEditForm {
  image?: File;
  title: string;
  description: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  techStacks: TechStack[];
  externalLinks?: ExternalLink[];
  categories?: Category[];
}
