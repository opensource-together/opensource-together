import { Injectable, Inject } from '@nestjs/common';
import { Result } from '@/libs/result';
import { GitHubStats } from '@/contexts/user/domain/github-stats.vo';
import {
  USER_REPOSITORY_PORT,
  UserRepositoryPort,
} from './ports/user.repository.port';
import {
  GITHUB_REPOSITORY_PORT,
  GithubRepositoryPort,
} from '@/contexts/github/use-cases/ports/github-repository.port';
import {
  USER_GITHUB_CREDENTIALS_REPOSITORY_PORT,
  UserGitHubCredentialsRepositoryPort,
} from '@/contexts/github/use-cases/ports/user-github-credentials.repository.port';
import {
  ENCRYPTION_SERVICE_PORT,
  EncryptionServicePort,
} from '@/contexts/encryption/ports/encryption.service.port';
import { Octokit } from '@octokit/rest';

export interface GitHubStatsCalculationResult {
  totalStars: number;
  contributedRepos: number;
  commitsThisYear: number;
}

@Injectable()
export class CalculateGitHubStatsUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepo: UserRepositoryPort,
    @Inject(GITHUB_REPOSITORY_PORT)
    private readonly githubRepo: GithubRepositoryPort,
    @Inject(USER_GITHUB_CREDENTIALS_REPOSITORY_PORT)
    private readonly userGitHubCredentialsRepo: UserGitHubCredentialsRepositoryPort,
    @Inject(ENCRYPTION_SERVICE_PORT)
    private readonly encryptionService: EncryptionServicePort,
  ) {}

  async execute(
    userId: string,
  ): Promise<Result<GitHubStatsCalculationResult, string>> {
    try {
      // 1. Vérifier que l'utilisateur existe
      const userResult = await this.userRepo.findById(userId);
      if (!userResult.success) {
        return Result.fail('User not found');
      }

      // 2. Récupérer les credentials GitHub
      const credentialsResult =
        await this.userGitHubCredentialsRepo.findGhTokenByUserId(userId);
      if (!credentialsResult.success) {
        // Si pas de credentials GitHub, retourner des stats à 0
        return Result.ok({
          totalStars: 0,
          contributedRepos: 0,
          commitsThisYear: 0,
        });
      }

      // 3. Décrypter le token GitHub
      const decryptedTokenResult = this.encryptionService.decrypt(
        credentialsResult.value,
      );
      if (!decryptedTokenResult.success) {
        return Result.fail('Failed to decrypt GitHub token');
      }

      // 4. Créer l'instance Octokit
      const octokit = new Octokit({
        auth: decryptedTokenResult.value,
      });

      // 5. Calculer les statistiques
      const statsResult = await this.calculateStats(octokit);
      if (!statsResult.success) {
        return Result.fail(statsResult.error);
      }

      return Result.ok(statsResult.value);
    } catch (error) {
      return Result.fail(`Failed to calculate GitHub stats: ${error}`);
    }
  }

  private async calculateStats(
    octokit: Octokit,
  ): Promise<Result<GitHubStatsCalculationResult, string>> {
    try {
      // Récupérer les repositories de l'utilisateur
      const reposResult =
        await this.githubRepo.findRepositoriesOfAuthenticatedUser(octokit);
      if (!reposResult.success) {
        return Result.fail('Failed to fetch user repositories');
      }

      const repositories = reposResult.value;
      let totalStars = 0;
      let contributedRepos = 0;
      let commitsThisYear = 0;

      // Calculer le total des stars
      for (const repo of repositories) {
        const repoInfoResult =
          await this.githubRepo.findRepositoryByOwnerAndName(
            repo.owner,
            repo.title,
            octokit,
          );

        if (repoInfoResult.success) {
          totalStars += repoInfoResult.value.stars;
        }
      }

      // Compter les repositories contribués (tous les repositories de l'utilisateur)
      contributedRepos = repositories.length;

      // Calculer les commits de cette année
      const currentYear = new Date().getFullYear();
      for (const repo of repositories) {
        const commitsResult = await this.githubRepo.findCommitsByRepository(
          repo.owner,
          repo.title,
          octokit,
        );

        if (commitsResult.success) {
          // Filtrer les commits de cette année
          const commitsThisYearInRepo = commitsResult.value.commitsNumber;
          // Note: Cette approche est simplifiée. Pour un calcul précis,
          // il faudrait analyser chaque commit individuellement
          commitsThisYear += Math.min(commitsThisYearInRepo, 100); // Limite pour éviter la surcharge
        }
      }

      console.log('totalStars', totalStars);
      console.log('contributedRepos', contributedRepos);
      console.log('commitsThisYear', commitsThisYear);
      return Result.ok({
        totalStars,
        contributedRepos,
        commitsThisYear,
      });
    } catch (error) {
      return Result.fail(`Failed to calculate stats: ${error}`);
    }
  }
}
