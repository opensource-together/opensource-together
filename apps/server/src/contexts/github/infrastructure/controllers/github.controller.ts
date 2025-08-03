import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Octokit } from '@octokit/rest';
import {
  GITHUB_REPOSITORY_PORT,
  GithubRepositoryPort,
} from '../../use-cases/ports/github-repository.port';
import { GitHubOctokit } from '../decorators/github-octokit.decorator';
import { GithubAuthGuard } from '../guards/github-auth.guard';
import { GithubRepoListInput } from '../repositories/inputs/github-repo-list.input';

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
  ): Promise<GithubRepoListInput[]> {
    const repos =
      await this.githubRepository.findRepositoriesOfAuthenticatedUser(octokit);
    if (!repos.success) {
      throw new HttpException(repos.error, HttpStatus.NOT_FOUND);
    }
    return repos.value;
  }

  @Get('orgs/repos')
  @UseGuards(GithubAuthGuard)
  @ApiOperation({
    summary:
      "Récupérer la liste des repository github des organisations de l'utilisateur courant",
  })
  @ApiCookieAuth('sAccessToken')
  @ApiResponse({
    status: 200,
    description: 'List repository organisations retournée avec succès',
    example: {
      repositories: [
        {
          owner: 'OrganizationName',
          title: 'SampleProject',
          description: "Un projet d'example",
          url: 'https://github.com/OrganizationName/SampleProject',
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Erreur lors de la récupération des repositories',
    example: {
      message: 'Failed to fetch organization repositories.',
      error: 'Not Found',
      statusCode: 404,
    },
  })
  async getOrganizationRepositories(
    @GitHubOctokit() octokit: Octokit,
  ): Promise<GithubRepoListInput[]> {
    const repos =
      await this.githubRepository.findRepositoriesOfOrganizations(octokit);
    if (!repos.success) {
      throw new HttpException(repos.error, HttpStatus.NOT_FOUND);
    }
    return repos.value;
  }
}
