import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  GITHUB_REPOSITORY,
  RepositoryInfo,
} from '../repositories/github.repository.interface';
import { GithubRepository } from '../repositories/github.repository';
import { CreateGithubRepositoryInput } from './inputs/create-github-repository.input';
import { Result } from '@/libs/result';
import { GithubRepositoryDto } from './dto/github-repository.dto';
import { InviteUserToRepoInput } from './inputs/invite-user-to-repo.input';
import { GithubInvitationDto } from './dto/github-invitation.dto';
import { Octokit } from '@octokit/rest';

@Injectable()
export class GithubRepositoryService {
  private readonly Logger = new Logger(GithubRepositoryService.name);
  constructor(
    @Inject(GITHUB_REPOSITORY)
    private readonly githubRepository: GithubRepository,
  ) {}

  async createGithubRepository(
    input: CreateGithubRepositoryInput,
  ): Promise<Result<GithubRepositoryDto, string>> {
    const createRepoResult = await this.githubRepository.createGithubRepository(
      {
        title: input.name,
        description: input.description ?? '',
      },
      input.octokit,
    );

    if (!createRepoResult.success) {
      return Result.fail(
        `Erreur lors de la création du repository: ${createRepoResult.error}`,
      );
    }
    return createRepoResult;
  }

  async inviteUserToRepository(
    input: InviteUserToRepoInput,
  ): Promise<Result<GithubInvitationDto, string>> {
    const invitationResult = await this.githubRepository.inviteUserToRepository(
      input,
      input.octokit,
    );

    if (!invitationResult.success) {
      return Result.fail(
        `Erreur lors de l'invitation à un repository: ${invitationResult.error}`,
      );
    }

    return invitationResult;
  }

  async findRepositoryByOwnerAndName(
    ownerName: string,
    repoName: string,
    octokit: Octokit,
  ): Promise<Result<RepositoryInfo>> {
    const repositoryResult =
      await this.githubRepository.findRepositoryByOwnerAndName(
        ownerName,
        repoName,
        octokit,
      );

    if (!repositoryResult.success) {
      return Result.fail(
        `Erreur lors de la récupération du repository: ${repositoryResult.error}`,
      );
    }

    return repositoryResult;
  }

  async findCommitsByRepository(
    ownerName: string,
    repoName: string,
    octokit: Octokit,
  ): Promise<Result<any>> {
    const commitsResult = await this.githubRepository.findCommitsByRepository(
      ownerName,
      repoName,
      octokit,
    );

    if (!commitsResult.success) {
      return Result.fail(
        `Erreur lors de la récupération des commits: ${commitsResult.error}`,
      );
    }

    return commitsResult;
  }

  async findContributorsByRepository(
    ownerName: string,
    repoName: string,
    octokit: Octokit,
  ): Promise<Result<any>> {
    const contributors =
      await this.githubRepository.findContributorsByRepository(
        ownerName,
        repoName,
        octokit,
      );

    if (!contributors.success) {
      return Result.fail(
        `Erreur lors de la récupération des contributeurs: ${contributors.error}`,
      );
    }

    return contributors;
  }

  async findRepositoryOfAuthenticatedUser(
    octokit: Octokit,
  ): Promise<Result<any>> {
    const repositories =
      await this.githubRepository.findRepositoriesOfAuthenticatedUser(octokit);

    if (!repositories.success) {
      return Result.fail(
        `Erreur lors de la récupération des contributeurs: ${repositories.error}`,
      );
    }

    return repositories;
  }

  async getRepositoryReadme(
    ownerName: string,
    repoName: string,
    octokit: Octokit,
  ) {
    const readmeResult = await this.githubRepository.getRepositoryReadme(
      ownerName,
      repoName,
      octokit,
    );

    if (!readmeResult.success) {
      return Result.fail(
        `Erreur lors de la récupération du Readme: ${readmeResult.error}`,
      );
    }

    return readmeResult;
  }
}
