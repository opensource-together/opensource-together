import { Injectable } from '@nestjs/common';
import { User } from '@/contexts/user/domain/user.entity';
import { PrismaService } from '@/persistence/orm/prisma/services/prisma.service';
import { Result } from '@/libs/result';
import { UserRepositoryPort } from '@/contexts/user/use-cases/ports/user.repository.port';
import { PrismaUserMapper } from './prisma.user.mapper';
import { User as PrismaUser } from '@prisma/client';
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
      const user = PrismaUserMapper.toDomain(userResult);
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

  async create(user: User): Promise<Result<User, string>> {
    const userData: Result<PrismaUser, string> = PrismaUserMapper.toRepo(user);
    if (!userData.success) return Result.fail(userData.error);
    try {
      const savedUser = await this.prisma.user.create({
        data: userData.value,
      });
      if (!savedUser)
        return Result.fail("Erreur lors de la création de l'utilisateur.");
      const userResult: Result<User, string> =
        PrismaUserMapper.toDomain(savedUser);
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
    const user = PrismaUserMapper.toDomain(userResult);
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
    const user = PrismaUserMapper.toDomain(userResult);
    if (!user.success) return Result.fail(user.error);
    return Result.ok(user.value);
  }

  async update(
    user: User,
  ): Promise<Result<User, { username?: string; email?: string } | string>> {
    const userData: Result<
      PrismaUser,
      { username?: string; email?: string } | string
    > = PrismaUserMapper.toRepo(user);
    if (!userData.success) return Result.fail(userData.error);
    const updatedUser = await this.prisma.user.update({
      where: { id: userData.value.id },
      data: userData.value,
    });
    if (!updatedUser) return Result.fail('User not updated');
    const userResult: Result<User, string> =
      PrismaUserMapper.toDomain(updatedUser);
    if (!userResult.success) return Result.fail(userResult.error);
    return Result.ok(userResult.value);
  }

  async delete(user: User): Promise<Result<void, string>> {
    const { id } = user.toPrimitive();
    const deletedUser = await this.prisma.user.delete({
      where: { id },
    });
    if (!deletedUser) return Result.fail('User not deleted');
    return Result.ok(undefined);
  }
}
