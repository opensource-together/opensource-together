import {
  Controller,
  Get,
  UseGuards,
  Inject,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import {
  ApiTags,
} from '@nestjs/swagger';
import { GitHubOctokit } from './github-octokit.decorator';
import { Octokit } from '@octokit/rest';
import { GithubAuthGuard } from './guards/github-auth.guard';
import { GithubRepoSuggestionInput } from '../services/inputs/github-repo-suggestion.input';
import {
  GITHUB_REPOSITORY,
  IGithubRepository,
} from '../repositories/github.repository.interface';
import { GetGithubRepositorySwagger } from './swagger/swagger.decorator';

@ApiTags('Github')
@Controller('github')
export class GithubController {
  constructor(
    @Inject(GITHUB_REPOSITORY)
    private readonly githubRepository: IGithubRepository,
  ) {}

  @Get('repos')
  @UseGuards(GithubAuthGuard)
  @GetGithubRepositorySwagger()
  async getMyRepositories(
    @GitHubOctokit() octokit: Octokit,
  ): Promise<GithubRepoSuggestionInput[]> {
    const repos =
      await this.githubRepository.findRepositoriesOfAuthenticatedUser(octokit);
    if (!repos.success) {
      throw new HttpException(repos.error, HttpStatus.NOT_FOUND);
    }
    return repos.value;
  }
}
