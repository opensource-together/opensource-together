import {
  Contributor,
  GITHUB_REPOSITORY_PORT,
  GithubRepositoryPort,
  LastCommit,
  RepositoryInfo,
} from '@/contexts/github/use-cases/ports/github-repository.port';
import {
  PROFILE_REPOSITORY_PORT,
  ProfileRepositoryPort,
} from '@/contexts/profile/use-cases/ports/profile.repository.port';
import { Project } from '@/contexts/project/domain/project.entity';
import {
  PROJECT_REPOSITORY_PORT,
  ProjectRepositoryPort,
} from '@/contexts/project/use-cases/ports/project.repository.port';
import { Result } from '@/libs/result';
import { Inject } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Octokit } from '@octokit/rest';
export class GetProjectsQuery implements IQuery {
  constructor(
    public readonly props: {
      octokit?: Octokit;
    },
  ) {}
}

@QueryHandler(GetProjectsQuery)
export class GetProjectsHandler implements IQueryHandler<GetProjectsQuery> {
  constructor(
    @Inject(PROJECT_REPOSITORY_PORT)
    private readonly projectRepo: ProjectRepositoryPort,
    @Inject(GITHUB_REPOSITORY_PORT)
    private readonly githubRepo: GithubRepositoryPort,
    @Inject(PROFILE_REPOSITORY_PORT)
    private readonly profileRepo: ProfileRepositoryPort,
  ) {}

  async execute(query: GetProjectsQuery): Promise<
    Result<
      {
        author: {
          ownerId: string;
          name: string;
          avatarUrl: string;
        };
        repositoryInfo: RepositoryInfo;
        lastCommit: LastCommit | null;
        commits: number;
        contributors: Contributor[];
        project: Project;
      }[],
      string
    >
  > {
    const { octokit } = query.props;
    const result = await this.projectRepo.getAllProjects();
    if (!result.success) return Result.ok([]);

    const projects = result.value;

    const enrichedProjects = await Promise.all(
      projects.map(async (project) => {
        const projectPrimitive = project.toPrimitive();
        const { ownerId, title } = projectPrimitive;

        const ownerInfo = await this.profileRepo.findById(ownerId);
        if (!ownerInfo.success) return null;

        const owner = ownerInfo.value.toPrimitive();
        const repoName = title.replace(/\s+/g, '-');

        let contributors: Contributor[] = [];

        const projectWithDetails =
          await this.projectRepo.findUserProjectsWithDetails(ownerId);
        if (projectWithDetails.success && projectWithDetails.value.length > 0) {
          const projectDetails = projectWithDetails.value.find(
            (p) => p.project.toPrimitive().id === projectPrimitive.id,
          );
          if (projectDetails) {
            contributors = projectDetails.projectMembers.map((member) => ({
              id: member.userId,
              username: member.user.username,
              avatarUrl: member.user.avatarUrl,
              contributions: 1,
            }));
          }
        }

        let repoInfo = Result.fail<RepositoryInfo>('No authentication');
        let commits = Result.fail<{
          lastCommit: LastCommit | null;
          commitsNumber: number;
        }>('No authentication');

        if (octokit) {
          [commits, repoInfo] = await Promise.all([
            this.githubRepo.findCommitsByRepository(
              owner.login,
              repoName,
              octokit,
            ),
            this.githubRepo.findRepositoryByOwnerAndName(
              owner.login,
              repoName,
              octokit,
            ),
          ]);
        }

        const defaultStats: RepositoryInfo = {
          forks: repoInfo.success ? repoInfo.value.forks : 0,
          stars: repoInfo.success ? repoInfo.value.stars : 0,
          watchers: repoInfo.success ? repoInfo.value.watchers : 0,
          openIssues: repoInfo.success ? repoInfo.value.openIssues : 0,
        };

        const lastCommit: LastCommit | null = commits.success
          ? commits.value.lastCommit
          : null;

        return {
          project,
          author: {
            ownerId,
            name: owner.name,
            avatarUrl: owner.avatarUrl,
          },
          repositoryInfo: repoInfo.success ? repoInfo.value : defaultStats,
          lastCommit,
          commits: commits.success ? commits.value.commitsNumber : 0,
          contributors: contributors,
        };
      }),
    );

    return Result.ok(
      enrichedProjects.filter((p): p is NonNullable<typeof p> => p !== null),
    );
  }
}
