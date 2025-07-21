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
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { GitHubOctokit } from '../decorators/github-octokit.decorator';
import { Octokit } from '@octokit/rest';
import { GithubAuthGuard } from '../guards/github-auth.guard';
import { GithubRepoListInput } from '../repositories/inputs/github-repo-list.input';
import { GithubRepository } from '../repositories/github.repository';
import { toGithubRepoListInput } from '../repositories/adapters/github-repo-list.adapter';

@ApiTags('Github')
@Controller('github')
export class GithubController {
  constructor(
    @Inject(GithubRepository)
    private readonly githubRepository: GithubRepository,
  ) {}

  @Get('repos')
  @UseGuards(GithubAuthGuard)
  @ApiOperation({
    summary:
      "Récupérer la liste des repository github de l'utilisateur courant",
  })
  @ApiCookieAuth('sAccessToken')
  @ApiResponse({
    status: 200,
    description: 'List repository utilisateur retournée avec succès',
    example: {
      repositories: [
        {
          owner: 'JohnDoe',
          title: 'SampleProject',
          description: "Un projet d'example",
          url: 'https://github.com/JohnDoe/SampleProject',
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur non trouvé',
    example: {
      message: 'Utilisateur non trouvé.',
      error: 'Not Found',
      statusCode: 404,
    },
  })
  async getMyRepositories(
    @GitHubOctokit() octokit: Octokit,
  ): Promise<GithubRepoListInput[]> {
    const repos =
      await this.githubRepository.findRepositoriesOfAuthenticatedUser(octokit);
    if (!repos.success) {
      throw new HttpException(repos.error, HttpStatus.NOT_FOUND);
    }
    return repos.value;
  }
}
