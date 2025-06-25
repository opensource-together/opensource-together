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
import { PrismaUserRepository } from '@/infrastructures/repositories/user/prisma.user.repository';
import { USER_REPOSITORY_PORT } from '@/application/user/ports/user.repository.port';
import { EncryptionService } from '@/infrastructures/encryption/encryption.service';
import { Octokit } from '@octokit/rest';

@Injectable()
export class GithubAuthGuard implements CanActivate {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: PrismaUserRepository,
    private readonly encryptionService: EncryptionService,
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

    const encryptedGithubAccessToken = user.value.getGithubAccessToken();
    const githubAccessToken = this.encryptionService.decrypt(
      encryptedGithubAccessToken,
    );
    if (!githubAccessToken.success) {
      return false;
    }

    const octokit = new Octokit({
      auth: githubAccessToken.value,
    });

    req.octokit = octokit;
    return true;
  }
}
