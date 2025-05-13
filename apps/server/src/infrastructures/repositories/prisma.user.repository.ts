import { Injectable } from '@nestjs/common';
import { User } from '@domain/user/user.entity';
import { PrismaService } from '@infrastructures/orm/prisma/prisma.service';
import { UserFactory } from '@domain/user/user.factory';
import { Result } from '@/shared/result';
import { UserRepositoryPort } from '@/application/user/ports/user.repository.port';
@Injectable()
export class PrismaUserRepository implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(
    id: string,
  ): Promise<Result<User, { username?: string; email?: string } | string>> {
    try {
      const userResult = await this.prisma.user.findUnique({
        where: { id },
      });
      if (!userResult) return Result.fail('User not found');
      const user = UserFactory.create(
        userResult.id,
        userResult.username,
        userResult.email,
      );
      if (!user.success) return Result.fail(user.error);
      return Result.ok(user.value);
    } catch (error) {
      //TODO: log l'erreur avec sentry
      console.log('error', error);
      return Result.fail(
        "Erreur technique lors de la recherche de l'utilisateur.",
      );
    }
  }

  async save(
    user: User,
  ): Promise<Result<User, { username?: string; email?: string } | string>> {
    try {
      console.log('save');
      //throw new Error('test');
      const id = user.getId();
      const username = user.getUsername();
      const email = user.getEmail();
      const savedUser = await this.prisma.user.create({
        data: {
          id,
          username,
          email,
        },
      });
      if (!savedUser)
        return Result.fail("Erreur lors de la création de l'utilisateur.");
      const userResult: Result<
        User,
        { username?: string; email?: string } | string
      > = UserFactory.create(savedUser.id, savedUser.username, savedUser.email);
      if (!userResult.success) return Result.fail(userResult.error);
      return Result.ok(userResult.value);
    } catch (error) {
      //TODO: log l'erreur avec sentry
      console.log('error', error);
      return Result.fail(
        "Erreur technique lors de la création de l'utilisateur.",
      );
    }
  }

  async findByEmail(
    email: string,
  ): Promise<Result<User, { username?: string; email?: string } | string>> {
    const userResult = await this.prisma.user.findFirst({
      where: { email },
    });
    if (!userResult) return Result.fail('User not found');
    const user = UserFactory.create(
      userResult.id,
      userResult.username,
      userResult.email,
    );
    if (!user.success) return Result.fail(user.error);
    return Result.ok(user.value);
  }

  async findByUsername(
    username: string,
  ): Promise<Result<User, { username?: string; email?: string } | string>> {
    const userResult = await this.prisma.user.findFirst({
      where: { username },
    });
    if (!userResult) return Result.fail('User not found');
    const user = UserFactory.create(
      userResult.id,
      userResult.username,
      userResult.email,
    );
    if (!user.success) return Result.fail(user.error);
    return Result.ok(user.value);
  }
}
