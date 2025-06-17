import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructures/orm/prisma/prisma.service';
import { UserGitHubCredentialsRepositoryPort } from '@/application/user/ports/user-github-credentials.repository';
import { UserGitHubCredentials } from '@/domain/user/user-github-credentials.entity';
import { Result } from '@/shared/result';
import { PrismaUserGitHubCredentialsMapper } from './prisma.user-github-credentials.mapper';

@Injectable()
export class PrismaUserGitHubCredentialsRepository
  implements UserGitHubCredentialsRepositoryPort
{
  constructor(private readonly prisma: PrismaService) {}

  async findGhTokenByUserId(userId: string): Promise<Result<string, string>> {
    const ghToken = await this.prisma.userGitHubCredentials.findUnique({
      where: { userId },
      select: {
        githubAccessToken: true,
      },
    });
    if (!ghToken || !ghToken.githubAccessToken)
      //Une erreur est survenue lors de la récupération des credentials GitHub

      return Result.fail('Une erreur est survenue');

    return Result.ok(ghToken.githubAccessToken);
  }

  async update(
    userGitHubCredentials: UserGitHubCredentials,
  ): Promise<Result<UserGitHubCredentials, string>> {
    const { userId, githubAccessToken, githubUserId } =
      PrismaUserGitHubCredentialsMapper.toPrisma(userGitHubCredentials);
    const updatedUserGitHubCredentials =
      await this.prisma.userGitHubCredentials.update({
        where: { userId },
        data: {
          githubAccessToken,
          githubUserId,
        },
      });
    return Result.ok(
      PrismaUserGitHubCredentialsMapper.toDomain(updatedUserGitHubCredentials),
    );
  }

  async save(
    userGitHubCredentials: UserGitHubCredentials,
  ): Promise<Result<UserGitHubCredentials, string>> {
    const { userId, githubAccessToken, githubUserId } =
      PrismaUserGitHubCredentialsMapper.toPrisma(userGitHubCredentials);
    const createdUserGitHubCredentials =
      await this.prisma.userGitHubCredentials.create({
        data: {
          userId,
          githubAccessToken,
          githubUserId,
        },
      });
    if (!createdUserGitHubCredentials)
      //Erreur lors de la création des credentials GitHub
      return Result.fail('Une erreur est survenue');
    return Result.ok(
      PrismaUserGitHubCredentialsMapper.toDomain(createdUserGitHubCredentials),
    );
  }
}
