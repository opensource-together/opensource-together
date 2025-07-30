import {
  User as PrismaUser,
  UserSocialLink as PrismaSocialLink,
  TechStack as PrismaTechStack,
} from '@prisma/client';
import { User } from '@/contexts/user/domain/user.entity';
import { ProfileExperience } from '@/contexts/profile/domain/profile-experience.vo';

// Un type helper pour représenter un objet Prisma avec ses relations
type RawPrismaUser = PrismaUser & {
  socialLinks: PrismaSocialLink[];
  techStacks: PrismaTechStack[];
};

export class PrismaProfileMapper {
  /**
   * Traduit un objet brut de Prisma vers une entité du domaine.
   */
  public static toDomain(raw: RawPrismaUser): User {
    // 1. Convertir les UserSocialLink[] vers l'objet socialLinks simple
    const socialLinksObject = raw.socialLinks.map((link) => ({
      type: link.type,
      url: link.url,
    }));

    // 2. Reconstituer l'entité Profile
    const profileEntity = User.reconstitute({
      id: raw.id,
      username: raw.username,
      email: raw.email,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      provider: raw.provider,
      login: raw.login,
      avatarUrl: raw.avatarUrl || undefined,
      bio: raw.bio || undefined,
      location: raw.location || undefined,
      company: raw.company || undefined,
      socialLinks: socialLinksObject as {
        github?: string;
        website?: string;
        twitter?: string;
        linkedin?: string;
        discord?: string;
      },
      techStacks: raw.techStacks.map((techStack) => ({
        id: techStack.id,
        name: techStack.name,
        iconUrl: techStack.iconUrl,
        type: techStack.type,
      })),
      experiences: [],
      projects: [],
    });

    if (!profileEntity.success) {
      throw new Error(
        typeof profileEntity.error === 'string'
          ? profileEntity.error
          : 'Erreur de validation',
      );
    }

    return profileEntity.value;
  }

  /**
   * Traduit une entité du domaine vers un format pour la persistance Prisma.
   */
  public static toRepo(profile: {
    userId: string;
    name: string;
    provider: string;
    login: string;
    avatarUrl: string;
    bio?: string;
    location?: string;
    company?: string;
    socialLinks?: {
      github?: string;
      website?: string;
      twitter?: string;
      linkedin?: string;
      discord?: string;
    };
    experiences: ProfileExperience[];
  }) {
    const profileState = profile;

    // Convertir l'objet socialLinks vers les données pour UserSocialLink[]
    const socialLinksData: { type: string; url: string }[] = [];
    if (profileState.socialLinks) {
      Object.entries(profileState.socialLinks).forEach(([type, url]) => {
        if (url && url.trim() !== '') {
          socialLinksData.push({ type, url });
        }
      });
    }

    return {
      // Données pour la table `Profile`
      profileData: {
        userId: profileState.userId,
        name: profileState.name,
        provider: profileState.provider,
        login: profileState.login,
        avatarUrl: profileState.avatarUrl,
        bio: profileState.bio,
        location: profileState.location,
        company: profileState.company,
      },
      // Données pour la table liée `UserSocialLink`
      socialLinksData,
    };
  }
}
