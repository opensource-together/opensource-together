import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { GitHubApiServicePort } from '@/application/github/ports/github-api.service.port';
import { Result } from '@/shared/result';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GitHubApiService implements GitHubApiServicePort {
  constructor(private readonly httpService: HttpService) {}

  async createRepository(
    token: string,
    repoData: {
      name: string;
      description?: string;
      isPrivate?: boolean;
    },
  ): Promise<Result<any, string>> {
    try {
      console.log({ repoData });
      const toGithub = {
        name: repoData.name,
        description: repoData.description,
        private: repoData.isPrivate,
      };
      const response = await firstValueFrom(
        this.httpService.post('https://api.github.com/user/repos', toGithub, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }),
      );
      return Result.ok(response.data);
    } catch (error: any) {
      if (typeof error === 'string') {
        return Result.fail(`Erreur API Github : ${error}.`);
      } else if (error instanceof Error) {
        console.error('Erreur GitHub API:', {
          message: error.message,
        });

        return Result.fail(`Erreur API GitHub (${error.message}`);
      } else {
        return Result.fail(`Erreur API Github inconnnue.`);
      }
    }
  }
}
