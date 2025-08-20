import { Injectable, Logger } from '@nestjs/common';
import {
  UserGitHubCredentialsData,
  IUserGitHubCredentialsRepository,
} from './user-github-credentials.repository.interface';
import { Result } from '@/libs/result';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PrismaUserGitHubCredentialsRepository
  implements IUserGitHubCredentialsRepository
{
  private readonly Logger = new Logger(
    PrismaUserGitHubCredentialsRepository.name,
  );
  constructor(private readonly prisma: PrismaService) {}

  async findGhTokenByUserId(userId: string): Promise<Result<string, string>> {
    try {
      const ghToken = await this.prisma.userGithubCredentials.findUnique({
        where: { userId },
        select: {
          githubAccessToken: true,
        },
      });
      if (!ghToken || !ghToken.githubAccessToken) {
        return Result.fail('GitHub credentials not found for this user.');
      }

      return Result.ok(ghToken.githubAccessToken);
    } catch (e) {
      this.Logger.error(e);
      // Idéalement, logger l'erreur 'e' ici
      return Result.fail(
        'A technical error occurred while fetching GitHub credentials.',
      );
    }
  }

  async update(
    props: UserGitHubCredentialsData,
  ): Promise<Result<UserGitHubCredentialsData, string>> {
    try {
      const updatedCredentials = await this.prisma.userGitHubCredentials.update(
        {
          where: { userId: props.userId },
          data: {
            githubAccessToken: props.githubAccessToken,
            githubUserId: props.githubUserId,
          },
        },
      );
      return Result.ok({
        userId: updatedCredentials.userId,
        githubUserId: updatedCredentials.githubUserId ?? '',
        githubAccessToken: updatedCredentials.githubAccessToken ?? '',
      });
    } catch (e) {
      this.Logger.error(e);
      // Idéalement, logger l'erreur 'e' ici
      return Result.fail(
        'A technical error occurred while updating GitHub credentials.',
      );
    }
  }

  async create(
    props: UserGitHubCredentialsData,
  ): Promise<Result<UserGitHubCredentialsData, string>> {
    try {
      const createdCredentials = await this.prisma.userGitHubCredentials.create(
        {
          data: {
            userId: props.userId,
            githubAccessToken: props.githubAccessToken,
            githubUserId: props.githubUserId,
          },
        },
      );
      return Result.ok({
        userId: createdCredentials.userId,
        githubUserId: createdCredentials.githubUserId ?? '',
        githubAccessToken: createdCredentials.githubAccessToken ?? '',
      });
    } catch (e) {
      this.Logger.error(e);
      // Idéalement, logger l'erreur 'e' ici
      return Result.fail(
        'A technical error occurred while creating GitHub credentials.',
      );
    }
  }
}
