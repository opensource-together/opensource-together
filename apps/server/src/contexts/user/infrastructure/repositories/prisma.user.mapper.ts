import { User as DomainUser, User } from '@/contexts/user/domain/user.entity';
import { Email } from '@/contexts/user/domain/email.vo';
import { Username } from '@/contexts/user/domain/username.vo';
import { ProfileExperience } from '@/contexts/profile/domain/profile-experience.vo';
import { ProfileProject } from '@/contexts/profile/domain/profile-project.vo';
import {
  ContributionGraph,
  GitHubStats,
} from '@/contexts/user/domain/github-stats.vo';
import { Result } from '@/libs/result';
import { User as PrismaUser, UserSocialLink, TechStack } from '@prisma/client';

// Type temporaire pour l'ancienne structure
type UserWithRelations = PrismaUser & {
  socialLinks: UserSocialLink[];
  techStacks: TechStack[];
  // Anciens champs (seront supprimés après migration)
  totalStars?: number;
  contributedRepos?: number;
  commitsThisYear?: number;
  // Nouvelle relation (sera disponible après prisma generate)
  githubStats?: any | null;
};

export class PrismaUserMapper {
  static toRepo(user: DomainUser): Result<
    {
      userData: {
        id: string;
        username: string;
        email: string;
        login: string;
        avatarUrl: string | null;
        location: string | null;
        company: string | null;
        bio: string | null;
        jobTitle: string | null;
      };
      socialLinksData: Omit<UserSocialLink, 'id' | 'userId'>[];
      githubStatsData?: {
        totalStars: number;
        contributedRepos: number;
        commitsThisYear: number;
        contributionGraph?: any;
      };
    },
    string
  > {
    try {
      const primitive = user.toPrimitive();

      const userData = {
        id: primitive.id,
        username: primitive.username,
        email: primitive.email,
        provider: primitive.provider,
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

      // Préparer les données GitHubStats si elles existent
      let githubStatsData: any = undefined;
      if (primitive.githubStats) {
        githubStatsData = {
          totalStars: primitive.githubStats.totalStars,
          contributedRepos: primitive.githubStats.contributedRepos,
          commitsThisYear: primitive.githubStats.commitsThisYear,
          contributionGraph: primitive.githubStats.contributionGraph,
        };
      }

      return Result.ok({ userData, socialLinksData, githubStatsData });
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

      // Créer les statistiques GitHub si elles existent
      let githubStats: GitHubStats | undefined;

      // Essayer d'abord la nouvelle structure (githubStats relation)
      if (prismaUser.githubStats) {
        const statsResult = GitHubStats.create({
          totalStars: prismaUser.githubStats.totalStars,
          contributedRepos: prismaUser.githubStats.contributedRepos,
          commitsThisYear: prismaUser.githubStats.commitsThisYear,
          contributionGraph: (prismaUser.githubStats
            .contributionGraph as ContributionGraph) || {
            weeks: [],
            totalContributions: 0,
            maxContributions: 0,
          },
        });
        if (statsResult.success) {
          githubStats = statsResult.value;
        }
      }
      // Fallback sur l'ancienne structure (champs directs)
      else if (
        prismaUser.totalStars !== undefined ||
        prismaUser.contributedRepos !== undefined ||
        prismaUser.commitsThisYear !== undefined
      ) {
        const statsResult = GitHubStats.create({
          totalStars: prismaUser.totalStars || 0,
          contributedRepos: prismaUser.contributedRepos || 0,
          commitsThisYear: prismaUser.commitsThisYear || 0,
          contributionGraph: {
            weeks: [],
            totalContributions: 0,
            maxContributions: 0,
          },
        });
        if (statsResult.success) {
          githubStats = statsResult.value;
        }
      }

      const userResult = User.reconstitute({
        id: prismaUser.id,
        username: prismaUser.username,
        email: prismaUser.email,
        // name: prismaUser.name,
        provider: prismaUser.provider,
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
        githubStats,
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
