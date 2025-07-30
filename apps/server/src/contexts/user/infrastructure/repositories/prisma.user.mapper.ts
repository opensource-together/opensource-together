import { User as DomainUser, User } from '@/contexts/user/domain/user.entity';
import { Email } from '@/contexts/user/domain/email.vo';
import { Username } from '@/contexts/user/domain/username.vo';
import { ProfileExperience } from '@/contexts/profile/domain/profile-experience.vo';
import { ProfileProject } from '@/contexts/profile/domain/profile-project.vo';
import { Result } from '@/libs/result';
import { User as PrismaUser, UserSocialLink, TechStack } from '@prisma/client';

type UserWithRelations = PrismaUser & {
  socialLinks: UserSocialLink[];
  techStacks: TechStack[];
};

export class PrismaUserMapper {
  static toRepo(user: DomainUser): Result<
    {
      userData: Omit<PrismaUser, 'createdAt' | 'updatedAt'>;
      socialLinksData: Omit<UserSocialLink, 'id' | 'userId'>[];
    },
    string
  > {
    try {
      const primitive = user.toPrimitive();

      const userData = {
        id: primitive.id,
        username: primitive.username,
        email: primitive.email,
        // name: primitive.name,
        login: primitive.login,
        avatarUrl: primitive.avatarUrl,
        location: primitive.location,
        company: primitive.company,
        bio: primitive.bio,
        jobTitle: primitive.jobTitle,
      };

      const socialLinksData: Omit<UserSocialLink, 'id' | 'userId'>[] = [];

      if (primitive.socialLinks) {
        for (const [type, url] of Object.entries(primitive.socialLinks)) {
          if (url) {
            socialLinksData.push({
              type,
              url,
              createdAt: new Date(),
            });
          }
        }
      }

      return Result.ok({ userData, socialLinksData });
    } catch (error) {
      return Result.fail(`Error mapping user to repository format : ${error}`);
    }
  }

  static toDomain(
    prismaUserWithRelations: UserWithRelations,
  ): Result<DomainUser, string> {
    try {
      const prismaUser = prismaUserWithRelations;

      // Validation des VOs
      const username = Username.create(prismaUser.username);
      const email = Email.create(prismaUser.email);

      if (!username.success) {
        return Result.fail(
          "Une erreur est survenue lors de la récupération des données de l'utilisateur",
        );
      }

      if (!email.success) {
        return Result.fail(
          "Une erreur est survenue lors de la récupération des données de l'utilisateur",
        );
      }

      // Conversion des socialLinks depuis le format base vers l'objet
      const socialLinks: {
        github?: string;
        website?: string;
        twitter?: string;
        linkedin?: string;
        discord?: string;
      } = {};

      for (const link of prismaUserWithRelations.socialLinks || []) {
        const linkType = link.type as keyof typeof socialLinks;
        socialLinks[linkType] = link.url;
      }

      // Conversion des techStacks
      const techStacks = (prismaUserWithRelations.techStacks || []).map(
        (ts) => ({
          id: ts.id,
          name: ts.name,
          iconUrl: ts.iconUrl,
          type: ts.type as 'LANGUAGE' | 'TECH',
        }),
      );

      // TODO: Récupérer les experiences et projects depuis la base de données
      // Pour l'instant, on les initialise vides
      const experiences: ProfileExperience[] = [];
      const projects: ProfileProject[] = [];

      const userResult = User.reconstitute({
        id: prismaUser.id,
        username: prismaUser.username,
        email: prismaUser.email,
        // name: prismaUser.name,
        login: prismaUser.login,
        avatarUrl: prismaUser.avatarUrl ?? undefined,
        location: prismaUser.location ?? undefined,
        company: prismaUser.company ?? undefined,
        bio: prismaUser.bio ?? undefined,
        jobTitle: prismaUser.jobTitle ?? undefined,
        socialLinks,
        techStacks,
        experiences,
        projects,
        createdAt: prismaUser.createdAt,
        updatedAt: prismaUser.updatedAt,
      });

      if (!userResult.success) {
        return Result.fail(
          "Une erreur est survenue lors de la récupération des données de l'utilisateur",
        );
      }

      return Result.ok(userResult.value);
    } catch (error) {
      return Result.fail(
        `Une erreur est survenue lors de la conversion des données de l'utilisateur: ${error}`,
      );
    }
  }
}
