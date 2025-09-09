import { Injectable } from '@nestjs/common';
import { IUserRepository } from './user.repository.interface';
import { PrismaService } from '../../../../prisma/prisma.service';
import { Result } from '@/libs/result';
@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}
  async updateGithubLogin(
    userId: string,
    githubLogin: string,
  ): Promise<Result<void, string>> {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { githubLogin: githubLogin },
      });
      return Result.ok(undefined);
    } catch (error) {
      console.error('Failed to update github login', error);
      return Result.fail('Failed to update github login');
    }
  }
  async findEmailById(id: string): Promise<Result<string, string>> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: { email: true },
      });
      if (!user) return Result.fail('User not found');
      return Result.ok(user.email);
    } catch (error) {
      console.error('Failed to find email by id', error);
      return Result.fail('Failed to find email by id');
    }
  }
}
