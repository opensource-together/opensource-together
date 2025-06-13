import { User as DomainUser } from '@/domain/user/user.entity';
import { UserFactory } from '@/domain/user/user.factory';
import { Result } from '@/shared/result';
import { User as PrismaUser } from '@prisma/client';

export class PrismaUserMapper {
  static toRepo(
    user: DomainUser,
  ): Result<PrismaUser, { username?: string; email?: string } | string> {
    try {
      const toRepo = {
        id: user.getId(),
        username: user.getUsername(),
        email: user.getEmail(),
        avatarUrl: user.getAvatarUrl(),
        bio: user.getBio(),
        githubUrl: user.getGithubUrl(),
        createdAt: user.getCreatedAt(),
        updatedAt: user.getUpdatedAt(),
      };
      return Result.ok(toRepo);
    } catch (error) {
      return Result.fail('Error mapping user to repository format');
    }
  }

  static toDomain(prismaUser: PrismaUser): Result<DomainUser, string> {
    const userResult = UserFactory.create({
      id: prismaUser.id,
      username: prismaUser.username,
      email: prismaUser.email,
      avatarUrl: prismaUser.avatarUrl ?? '',
      bio: prismaUser.bio ?? '',
      githubUrl: prismaUser.githubUrl ?? '',
    });
    if (!userResult.success) return Result.fail('Invalid user data');

    return Result.ok(userResult.value);
  }
}
