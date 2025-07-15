import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProjectRepositoryPort } from '@/contexts/project/use-cases/ports/project.repository.port';
import { Inject } from '@nestjs/common';
import { PROJECT_REPOSITORY_PORT } from '@/contexts/project/use-cases/ports/project.repository.port';
import { Result } from '@/libs/result';
import { IQuery } from '@nestjs/cqrs';
import {
  GithubRepositoryPort,
  GITHUB_REPOSITORY_PORT,
} from '@/contexts/github/use-cases/ports/github-repository.port';
import {
  UserRepositoryPort,
  USER_REPOSITORY_PORT,
} from '@/contexts/user/use-cases/ports/user.repository.port';
import { Octokit } from '@octokit/rest';
import { Project } from '@/contexts/project/domain/project.entity';
export class FindProjectByIdQuery implements IQuery {
  constructor(
    public readonly props: {
      id: string;
      octokit: Octokit;
    },
  ) {}
}

@QueryHandler(FindProjectByIdQuery)
export class FindProjectByIdHandler
  implements IQueryHandler<FindProjectByIdQuery>
{
  constructor(
    @Inject(PROJECT_REPOSITORY_PORT)
    private readonly projectRepo: ProjectRepositoryPort,
    @Inject(GITHUB_REPOSITORY_PORT)
    private readonly githubRepo: GithubRepositoryPort,
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepo: UserRepositoryPort,
  ) {}

  async execute(query: FindProjectByIdQuery): Promise<
    Result<
      {
        project: Project;
        projectStats: {
          forks_count: number;
          stargazers_count: number;
          watchers_count: number;
          open_issues_count: number;
          commits_count: number;
        };
      },
      string
    >
  > {
    const { id, octokit } = query.props;
    const project = await this.projectRepo.findById(id);
    if (!project.success) {
      return Result.fail(project.error);
    }
    const ownerProjectInfo = await this.userRepo.findById(
      project.value.toPrimitive().ownerId,
    );
    if (!ownerProjectInfo.success) {
      return Result.fail(ownerProjectInfo.error as string);
    }
    const username = ownerProjectInfo.value.toPrimitive().username;
    const repoName = project.value.toPrimitive().title;
    const [commitsNumber, repoInfo] = await Promise.all([
      this.githubRepo.findCommitsByRepository(
        username,
        repoName.replace(/\s+/g, '-'),
        octokit,
      ),
      this.githubRepo.findRepositoryByOwnerAndName(
        username,
        repoName.replace(/\s+/g, '-'),
        octokit,
      ),
    ]);
    if (!commitsNumber.success) {
      return Result.fail(commitsNumber.error);
    }
    if (!repoInfo.success) {
      return Result.fail(repoInfo.error);
    }
    const { forks_count, stargazers_count, watchers_count, open_issues_count } =
      repoInfo.value;
    return Result.ok({
      project: project.value,
      projectStats: {
        forks_count,
        stargazers_count,
        watchers_count,
        open_issues_count,
        commits_count: commitsNumber.value as number,
      },
    });
  }
}
