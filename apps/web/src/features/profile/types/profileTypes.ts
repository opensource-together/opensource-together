export type ProfileSocialLink = {
  type: "github" | "twitter" | "linkedin" | "website";
  url: string;
};

export type ProfileTechStack = {
  id: string;
  name: string;
  iconUrl: string;
};

export type ProfileBadge = {
  label: string;
  color: string;
  bgColor: string;
};

export type ProfileSkill = {
  name: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
  badges: ProfileBadge[];
};

// Correspond to GitHub Repository format
export type ProfileProject = {
  id: string;
  name: string; // repo name
  full_name: string; // owner/repo
  description?: string;
  html_url?: string;
  homepage?: string;
  stargazers_count?: number;
  watchers_count?: number;
  forks_count?: number;
  language?: string;
  topics?: string[];
  created_at?: string;
  updated_at?: string;
  pushed_at?: string;
  image?: string;
  techStacks?: ProfileTechStack[];
};

// Correspond to GitHub User format
export type Profile = {
  id: string;
  login: string;
  avatar_url: string;
  html_url: string;
  type: string;
  site_admin: boolean;
  name?: string;
  bio?: string;
  location?: string;
  blog?: string;
  company?: string;
  public_repos?: number;
  public_gists?: number;
  followers?: number;
  following?: number;
  created_at?: string;
  updated_at?: string;
  skills?: ProfileSkill[];
  projects?: ProfileProject[];
  socialLinks?: ProfileSocialLink[];
  contributions_count?: number;
};
