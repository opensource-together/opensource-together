// import { SocialLink } from '@/contexts/profile/domain/social-link.vo';

export type ProfileProjectDto = {
  name: string;
  description: string;
  url: string;
};
export class ProfileResponseDto {
  id: string;
  name: string;
  avatarUrl: string;
  bio: string;
  location: string;
  company: string;
  socialLinks: {
    github?: string;
    discord?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  // Remplacer "any" par les vrais types quand ils seront définis
  techStacks: {
    name: string;
    id: string;
    type: 'LANGUAGE' | 'TECH';
    iconUrl: string;
  }[];
  experiences: {
    company: string;
    position: string;
    startDate: string;
    endDate: string | null;
  }[];
  projects: ProfileProjectDto[];
  joinedAt: string; // ISO string
  profileUpdatedAt: string; // ISO string
}
