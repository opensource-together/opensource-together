import { User as DomainUser, User } from '@/domain/user/user.entity';
import { Email } from '@/domain/user/email.vo';
import { Username } from '@/domain/user/username.vo';
import { Result } from '@/shared/result';
import { User as PrismaUser } from '@prisma/client';

export class PrismaUserMapper {
  static toRepo(user: DomainUser): Result<PrismaUser, string> {
    try {
      const toRepo = {
        id: user.getState().id,
        username: user.getState().username,
        email: user.getState().email,
      };
      return Result.ok(toRepo as PrismaUser);
    } catch (error) {
      return Result.fail(`Error mapping user to repository format : ${error}`);
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
      username: username.value,
      email: email.value,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    });

    return Result.ok(userResult);
  }
}
