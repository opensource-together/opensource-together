import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GithubAuthRequest } from './guards/github-auth.guard';

export const GitHubOctokit = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<GithubAuthRequest>();
    return request.octokit;
  },
);
