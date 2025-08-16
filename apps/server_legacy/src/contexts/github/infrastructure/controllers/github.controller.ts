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
import { GithubRepoSuggestionInput } from '../repositories/inputs/github-repo-suggestion.input';
import {
  GITHUB_REPOSITORY_PORT,
  GithubRepositoryPort,
} from '../../use-cases/ports/github-repository.port';

@ApiTags('Github')
@Controller('github')
export class GithubController {
  constructor(
    @Inject(GITHUB_REPOSITORY_PORT)
    private readonly githubRepository: GithubRepositoryPort,
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
  ): Promise<GithubRepoSuggestionInput[]> {
    const repos =
      await this.githubRepository.findRepositoriesOfAuthenticatedUser(octokit);
    if (!repos.success) {
      throw new HttpException(repos.error, HttpStatus.NOT_FOUND);
    }
    return repos.value;
  }
}
