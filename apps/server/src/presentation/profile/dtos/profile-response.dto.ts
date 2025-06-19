import { SocialLink } from '@/domain/profile/social-link.vo';

// Note: On expose ici les VOs directement, c'est un choix acceptable
// car ils sont déjà des structures de données. On pourrait aussi les mapper
// vers des DTOs dédiés si on voulait plus de contrôle sur le format JSON.
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
  joinedAt: string; // ISO string
  profileUpdatedAt: string; // ISO string
}
