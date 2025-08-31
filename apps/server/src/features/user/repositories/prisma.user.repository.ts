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
      return Result.fail('Failed to update github login');
    }
  }
}
