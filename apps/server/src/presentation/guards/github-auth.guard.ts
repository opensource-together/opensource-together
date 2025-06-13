import { OCTOKIT_OAUTH_PROVIDER } from '@/infrastructures/github/providers/octokit.provider';
import { Result } from '@/shared/result';
import {
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { OAuthApp } from 'octokit';
import { Request } from 'express';
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import { GithubAuthRequest } from '../types/github-auth-request.interface';

export const GithubUserOctokit = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<GithubAuthRequest>();
    const octokit = request.octokit as Octokit;
    if (!octokit) {
      throw new Error('Octokit in not defined in context');
    }
    return octokit;
  },
);

@Injectable()
export class GithubAuthGuard implements CanActivate {
  constructor(
    @Inject(OCTOKIT_OAUTH_PROVIDER) private readonly octokitProvider: OAuthApp,
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
    const userInfo = await supertokens.getUser(userId, context);
    const token = userInfo?.thirdParty.find((v) => v.id == 'github');
    if (!token) {
      return false;
    }

    const userOctokit = this.octokitProvider.getUserOctokit({
      token: token.userId,
      scopes: ['repo', 'user:email', 'read:user'],
    });

    req.octokit = userOctokit;
    return true;
  }
}
