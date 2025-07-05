import {
  Profile as PrismaProfile,
  UserSocialLink as PrismaSocialLink,
} from '@prisma/client';
import { Profile } from '@/contexts/profile/domain/profile.entity';
import {
  SocialLink,
  SocialLinkType,
} from '@/contexts/profile/domain/social-link.vo';
import { ProfileExperience } from '@/contexts/profile/domain/profile-experience.vo';

// Un type helper pour représenter un objet Prisma avec ses relations
type RawPrismaProfile = PrismaProfile & {
  socialLinks: PrismaSocialLink[];
};

export class PrismaProfileMapper {
  /**
   * Traduit un objet brut de Prisma vers une entité du domaine.
   */
  public static toDomain(raw: RawPrismaProfile): Profile {
    // 1. Reconstituer les VOs à partir des données brutes
    const socialLinks = raw.socialLinks
      .map((link) =>
        SocialLink.create({ type: link.type as SocialLinkType, url: link.url }),
      )
      .filter((result) => result.success) // On ignore les liens invalides
      .map((result) => result.value);

    // 2. Reconstituer l'entité Profile.
    // NOTE: Ceci nécessite une méthode `reconstitute` sur l'entité Profile
    // pour la recréer à partir de données existantes, sans appliquer la logique de "création".
    const profileEntity = Profile.reconstitute({
      userId: raw.userId,
      name: raw.name,
      avatarUrl: raw.avatarUrl || undefined,
      bio: raw.bio || undefined,
      location: raw.location || undefined,
      company: raw.company || undefined,
      socialLinks: socialLinks,
      skills: [],
      experiences: [],
      projects: [],
      updatedAt: raw.updatedAt,
    });

    return profileEntity;
  }

  /**
   * Traduit une entité du domaine vers un format pour la persistance Prisma.
   */
  public static toRepo(profile: {
    userId: string;
    name: string;
    avatarUrl: string;
    bio?: string;
    location?: string;
    company?: string;
    socialLinks: SocialLink[];
    experiences: ProfileExperience[];
  }) {
    const profileState = profile;

    return {
      // Données pour la table `Profile`
      profileData: {
        userId: profileState.userId,
        name: profileState.name,
        avatarUrl: profileState.avatarUrl,
        bio: profileState.bio,
        location: profileState.location,
        company: profileState.company,
      },
      // Données pour la table liée `UserSocialLink`
      socialLinksData: profileState.socialLinks.map((link) => ({
        type: link.type,
        url: link.url,
      })),
    };
  }
}
