export interface ProjectInput {
  title: string;
  description: string;
  longDescription?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  techStacks: { id: string; name: string; iconUrl: string }[];
  roles?: {
    title: string;
    description: string;
    badges: { label: string; color: string; bgColor: string }[];
    experienceBadge?: string;
  }[];
  keyBenefits?: string[];
  socialLinks?: { type: "github" | "website" | "discord" | "twitter" | "other"; url: string }[];
} 