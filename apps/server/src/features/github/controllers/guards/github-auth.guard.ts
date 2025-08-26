import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  Logger,
} from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { UserSession } from '@thallesp/nestjs-better-auth';
import {
  ACCOUNT_REPOSITORY,
  IAccountRepository,
} from '../../repositories/account.repository.interface';

export interface GithubAuthRequest extends UserSession {
  octokit: Octokit;
}

@Injectable()
export class GithubAuthGuard implements CanActivate {
  private readonly Logger = new Logger(GithubAuthGuard.name);
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: IAccountRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<GithubAuthRequest>();

    if (!request.user?.id) {
      // throw new UnauthorizedException('User not authenticated');
      const octokit = new Octokit({
        auth: process.env.GH_TOKEN_OST_PUBLIC,
      });
      request.octokit = octokit;
      return true;
    }

    const userId = request.user.id;
    const userGhTokenResult =
      await this.accountRepository.getUserGithubToken(userId);
    if (!userGhTokenResult.success) {
      return false;
    }

    const octokit = new Octokit({
      auth: userGhTokenResult.value,
    });
    request.octokit = octokit;

    return true;
  }
}
