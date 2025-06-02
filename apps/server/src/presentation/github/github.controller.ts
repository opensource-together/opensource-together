import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { GithubAuthGuard, GithubUserOctokit } from '../guards/github-auth.guard';
import { Octokit } from '@octokit/rest';

@Controller('github')
export class GithubController {
  constructor() {}

  @Get('user')
  @UseGuards(GithubAuthGuard)
  async getUser(@GithubUserOctokit() octokit: Octokit): Promise<void> {
    const user = await octokit.rest.users.getAuthenticated();
    console.log(user);
  }

}
