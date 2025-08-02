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
export class FindProjectByIdQuery implements IQuery {
  constructor(
    public readonly props: {
      id: string;
      octokit?: Octokit;
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
    @Inject(PROFILE_REPOSITORY_PORT)
    private readonly profileRepo: ProfileRepositoryPort,
  ) {}

  async execute(query: FindProjectByIdQuery): Promise<
    Result<
      {
        author: {
          ownerId: string;
          name: string;
          avatarUrl: string;
        };
        project: Project;
        repositoryInfo: RepositoryInfo;
        lastCommit: LastCommit | null;
        contributors: Contributor[];
        commits: number;
      },
      string
    >
  > {
    type ProjectStats = {
      forks: number;
      stars: number;
      watchers: number;
      openIssues: number;
      commits: number;
      lastCommit: LastCommit | null;
      contributors: {
        login: string;
        avatar_url: string;
        html_url: string;
        contributions: number;
      }[];
    };

    const { id, octokit } = query.props;
    const project = await this.projectRepo.findById(id);
    if (!project.success) {
      return Result.fail(project.error);
    }
    const ownerProjectInfo = await this.profileRepo.findById(
      project.value.toPrimitive().ownerId,
    );
    if (!ownerProjectInfo.success) {
      return Result.fail(ownerProjectInfo.error);
    }
    const ownerLogin = ownerProjectInfo.value.toPrimitive().login;
    const ownerName = ownerProjectInfo.value.toPrimitive().name;
    const ownerAvatarUrl = ownerProjectInfo.value.toPrimitive().avatarUrl;
    const repoName = project.value.toPrimitive().title;

    let commits: Result<
      { lastCommit: LastCommit | null; commitsNumber: number },
      string
    >;
    let repoInfo: Result<RepositoryInfo, string>;
    let contributors: Result<Contributor[], string>;

    if (octokit) {
      [commits, repoInfo, contributors] = await Promise.all([
        this.githubRepo.findCommitsByRepository(
          ownerLogin,
          repoName.replace(/\s+/g, '-'),
          octokit,
        ),
        this.githubRepo.findRepositoryByOwnerAndName(
          ownerLogin,
          repoName.replace(/\s+/g, '-'),
          octokit,
        ),
        this.githubRepo.findContributorsByRepository(
          ownerLogin,
          repoName.replace(/\s+/g, '-'),
          octokit,
        ),
      ]);
    } else {
      // Valeurs par défaut si pas d'octokit
      commits = Result.fail('No authentication');
      repoInfo = Result.fail('No authentication');
      contributors = Result.fail('No authentication');
    }

    const defaultProjectStats: ProjectStats = {
      forks: 0,
      stars: 0,
      watchers: 0,
      openIssues: 0,
      commits: 0,
      lastCommit: {
        sha: '',
        message: '',
        date: '',
        url: '',
        author: { login: '', avatar_url: '', html_url: '' },
      },
      contributors: [],
    };

    const projectStats: ProjectStats = { ...defaultProjectStats };

    commits = Result.ok({
      lastCommit: null,
      commitsNumber: 0,
    });
    if (commits.success) {
      projectStats.commits = commits.value.commitsNumber;
      projectStats.lastCommit = commits.value.lastCommit || null;
    }

    if (repoInfo.success) {
      const { forks, stars, watchers, openIssues } = repoInfo.value;
      projectStats.forks = forks;
      projectStats.stars = stars;
      projectStats.watchers = watchers;
      projectStats.openIssues = openIssues;
    }

    if (contributors.success) {
      projectStats.contributors = contributors.value;
    }

    return Result.ok({
      author: {
        ownerId: project.value.toPrimitive().ownerId,
        name: ownerName,
        avatarUrl: ownerAvatarUrl,
      },
      project: project.value,
      repositoryInfo: {
        forks: 0,
        stars: 0,
        watchers: 0,
        openIssues: 0,
      },
      lastCommit: null,
      contributors: [],
      commits: 0,
    });
  }
}
