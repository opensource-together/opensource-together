import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GithubAuthGuard } from '../guards/github-auth.guard';
import { GithubAuthRequest } from '../types/github-auth-request.interface';

@Controller('github')
export class GithubController {
  constructor() {}

  @Get('user')
  @UseGuards(GithubAuthGuard)
  async getUser(@Req() req: GithubAuthRequest): Promise<void> {
    const user = await req.octokit.rest.users.getAuthenticated();
    console.log(user);
  }
}
