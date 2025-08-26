import { PrismaService } from 'prisma/prisma.service';
import { IAccountRepository } from './account.repository.interface';
import { Injectable, Logger } from '@nestjs/common';
import { Result } from '@/libs/result';

@Injectable()
export class AccountRepository implements IAccountRepository {
  private readonly Logger = new Logger(AccountRepository.name);
  constructor(private readonly prismaService: PrismaService) {}

  async getUserGithubToken(cookie: string): Promise<Result<string>> {
    try {
      const result = await this.prismaService.session.findUnique({
        where: {
          token: cookie,
        },
        select: {
          user: {
            select: {
              accounts: {
                select: {
                  accessToken: true,
                },
                where: {
                  providerId: 'github',
                },
              },
            },
          },
        },
      });

      const accounts = result?.user.accounts;
      if (!accounts || accounts?.length == 0) {
        return Result.fail("Failed to fetch user's github token");
      }
      const token = accounts[0].accessToken;
      if (!result || !token) {
        return Result.fail("Failed to fetch user's github token");
      }
      return Result.ok(token);
    } catch (e) {
      this.Logger.error(`Failed to fetch user's github token : ${e}`);
      return Result.fail("Failed to fetch user's github token");
    }
  }
}
