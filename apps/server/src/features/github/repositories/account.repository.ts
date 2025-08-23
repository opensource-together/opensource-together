import { PrismaService } from "prisma/prisma.service";
import { IAccountRepository } from "./account.repository.interface";
import { Injectable, Logger } from "@nestjs/common";
import { Result } from "@/libs/result";

@Injectable()
export class AccountRepository implements IAccountRepository {
  private readonly Logger = new Logger(AccountRepository.name); 
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  async getUserGithubToken(userId: string): Promise<Result<string>> {
    try {
      const result = await this.prismaService.account.findUnique({
        where: {
          userId: userId
        },
        select: {
          accessToken: true
        }
      });

      if(!result || !result.accessToken) {
        return Result.fail('Failed to fetch user\'s github token');
      }
      return Result.ok(result?.accessToken);
    } catch(e) {
      this.Logger.error('Failed to fetch user\'s github token');
      return Result.fail('Failed to fetch user\'s github token');
    }
  }
}
