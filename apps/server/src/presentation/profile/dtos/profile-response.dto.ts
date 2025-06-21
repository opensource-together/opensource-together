import { SocialLink } from '@/domain/profile/social-link.vo';

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
  socialLinks: SocialLink[];
  // Remplacer "any" par les vrais types quand ils seront définis
  skills: any[];
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
