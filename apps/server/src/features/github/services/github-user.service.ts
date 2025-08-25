import { Inject, Injectable, Logger } from '@nestjs/common';
import { GITHUB_REPOSITORY } from '../repositories/github.repository.interface';
import { GithubRepository } from '../repositories/github.repository';
import { Octokit } from '@octokit/rest';
import { Result } from '@/libs/result';

// REFAC: a changer avec la nouvelle feature user
//import { ContributionGraph } from '@/features/user/domain/github-stats.vo';

@Injectable()
export class GithubRepositoryService {
  private readonly Logger = new Logger(GithubRepositoryService.name);
  constructor(
    @Inject(GITHUB_REPOSITORY)
    private readonly githubRepository: GithubRepository,
  ) {}

  async getUserTotalStars(octokit: Octokit): Promise<Result<number, string>> {
    const starsResult = await this.githubRepository.getUserTotalStars(octokit);

    if (!starsResult.success) {
      return Result.fail(
        `Erreur lors de la récupération des stars d'un utilisateur: ${starsResult.error}`,
      );
    }

    return starsResult;
  }

  async getUserContributedRepos(
    octokit: Octokit,
  ): Promise<Result<number, string>> {
    const contributedReposResult =
      await this.githubRepository.getUserContributedRepos(octokit);

    if (!contributedReposResult.success) {
      return Result.fail(
        `Erreur lors de la récupération des contributions d'un utilisateur: ${contributedReposResult.error}`,
      );
    }

    return contributedReposResult;
  }

  async getUserCommitsLastYear(
    octokit: Octokit,
  ): Promise<Result<number, string>> {
    const commitsResult =
      await this.githubRepository.getUserCommitsLastYear(octokit);

    if (!commitsResult.success) {
      return Result.fail(
        `Erreur lors de la récupération des commits annuels d'un utilisateur: ${commitsResult.error}`,
      );
    }

    return commitsResult;
  }

  // REFAC: a refaire avec la nouvelle feature user
  /*async getUserContributionGraph(octokit: Octokit): Promise<Result<ContributionGraph, string>> {
    const contributionGraphResult = await this.githubRepository.getUserContributionGraph(octokit);

    if(!contributionGraphResult.success) {
      return Result.fail(
        `Erreur lors de la récupération du graph de contribution d'un utilisateur: ${contributionGraphResult}`
      );
    }

    return contributionGraphResult;
  }*/
}
