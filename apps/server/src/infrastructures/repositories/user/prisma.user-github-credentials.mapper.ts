import { UserGitHubCredentials as UserGitHubCredentialsEntity } from '@/domain/user/user-github-credentials.entity';
import { UserGitHubCredentialsFactory } from '@/domain/user/user-github-credentials.factory';
import { UserGitHubCredentials as UserGitHubCredentialsModel } from '@prisma/client';

export class PrismaUserGitHubCredentialsMapper {
  static toDomain(
    model: UserGitHubCredentialsModel,
  ): UserGitHubCredentialsEntity {
    return UserGitHubCredentialsFactory.reconstitute({
      userId: model.userId,
      githubUserId: model.githubUserId ?? '',
      githubAccessToken: model.githubAccessToken ?? '',
    });
  }

  static toPrisma(
    entity: UserGitHubCredentialsEntity,
  ): Omit<UserGitHubCredentialsModel, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      userId: entity.getUserId(),
      githubUserId: entity.getGithubUserId(),
      githubAccessToken: entity.getGithubAccessToken(),
    };
  }
}
