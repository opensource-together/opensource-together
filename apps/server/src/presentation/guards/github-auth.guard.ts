import { Result } from '@/shared/result';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import Session from 'supertokens-node/recipe/session';
import { GithubAuthRequest } from '../types/github-auth-request.interface';
import { USER_REPOSITORY_PORT } from '@/application/user/ports/user.repository.port';
import { EncryptionService } from '@/infrastructures/encryption/encryption.service';
import { Octokit } from '@octokit/rest';
import { UserRepositoryPort } from '@/application/user/ports/user.repository.port';
import { USER_GITHUB_CREDENTIALS_REPOSITORY_PORT } from '@/application/github/ports/user-github-credentials.repository.port';
import { UserGitHubCredentialsRepositoryPort } from '@/application/github/ports/user-github-credentials.repository.port';

@Injectable()
export class GithubAuthGuard implements CanActivate {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
    private readonly encryptionService: EncryptionService,
    @Inject(USER_GITHUB_CREDENTIALS_REPOSITORY_PORT)
    private readonly userGitHubCredentialsRepo: UserGitHubCredentialsRepositoryPort,
  ) {}

  async authTokenFromSession(
    request: Request,
    response: Response,
  ): Promise<Result<string>> {
    const session = await Session.getSession(request, response);
    if (!session) {
      return Result.fail('No valid session found');
    }

    const accessToken = session.getAccessToken();
    return Result.ok(accessToken);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<GithubAuthRequest>();

    const userId = req.session!.getUserId();
    const user = await this.userRepository.findById(userId);
    if (!user.success) {
      return false;
    }

    const githubCredentials =
      await this.userGitHubCredentialsRepo.findGhTokenByUserId(userId);
    if (!githubCredentials.success) {
      return false;
    }
    const githubAccessToken = githubCredentials.value;
    const decryptedGithubAccessToken: Result<string, string> =
      this.encryptionService.decrypt(githubAccessToken);
    if (!decryptedGithubAccessToken.success) {
      return false;
    }

    const octokit = new Octokit({
      auth: decryptedGithubAccessToken.value,
    });

    req.octokit = octokit;
    return true;
  }
}
