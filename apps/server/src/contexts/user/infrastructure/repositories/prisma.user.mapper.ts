import { User as DomainUser, User } from '@/contexts/user/domain/user.entity';
import { Email } from '@/contexts/user/domain/email.vo';
import { Username } from '@/contexts/user/domain/username.vo';
import { Result } from '@/shared/result';
import { User as PrismaUser } from '@prisma/client';

export class PrismaUserMapper {
  static toRepo(user: DomainUser): Result<PrismaUser, string> {
    try {
      const toRepo = {
        id: user.toPrimitive().id,
        username: user.toPrimitive().username,
        email: user.toPrimitive().email,
      };
      return Result.ok(toRepo as PrismaUser);
    } catch (error) {
      console.error(error);
      return Result.fail(`Error mapping user to repository format`);
    }
  }

  static toDomain(prismaUser: PrismaUser): Result<DomainUser, string> {
    const username = Username.create(prismaUser.username);
    const email = Email.create(prismaUser.email);
    if (!username.success)
      return Result.fail(
        "Une erreur est survenue lors de la récupération des données de l'utilisateur",
      );
    if (!email.success)
      return Result.fail(
        "Une erreur est survenue lors de la récupération des données de l'utilisateur",
      );
    const userResult = User.reconstitute({
      id: prismaUser.id,
      username: prismaUser.username,
      email: prismaUser.email,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    });

    if (!userResult.success)
      return Result.fail(
        "Une erreur est survenue lors de la récupération des données de l'utilisateur",
      );
    return Result.ok(userResult.value);
  }
}
