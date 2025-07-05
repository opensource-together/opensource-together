// import { Injectable } from '@nestjs/common';
// // import { GitHubApiServicePort } from '@/contexts/github/use-cases/ports/github-api.service.port';
// import { Result } from '@/shared/result';
// import { firstValueFrom } from 'rxjs';
// import { Octokit } from 'octokit';

// @Injectable()
// export class GitHubApiService {
//   constructor(private readonly octokit: Octokit) {}

//   async createRepository(
//     token: string,
//     repoData: {
//       name: string;
//       description?: string;
//       isPrivate?: boolean;
//     },
//   ): Promise<Result<any, string>> {
//     try {
//       console.log({ repoData });
//       const toGithub = {
//         name: repoData.name,
//         description: repoData.description,
//         private: repoData.isPrivate,
//       };
//       const response = await firstValueFrom(
//         this.octokit.request('POST /user/repos', {
//           body: toGithub,
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: 'application/vnd.github.v3+json',
//           },
//         }),
//       );
//       return Result.ok(response);
//     } catch (error: any) {
//       if (typeof error === 'string') {
//         return Result.fail(`Erreur API Github : ${error}.`);
//       } else if (error instanceof Error) {
//         console.error('Erreur GitHub API:', {
//           message: error.message,
//         });

//         return Result.fail(`Erreur API GitHub (${error.message}`);
//       } else {
//         return Result.fail(`Erreur API Github inconnnue.`);
//       }
//     }
//   }
// }
