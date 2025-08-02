import {
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
import {
  FindApprovedContributorsByProjectIdQuery,
  OstContributor,
} from '@/contexts/project/bounded-contexts/project-role-application/use-cases/queries/find-approved-contributors-by-project-id.query';
import { Result } from '@/libs/result';
import { Inject } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler, QueryBus } from '@nestjs/cqrs';
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
    private readonly queryBus: QueryBus,
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
        contributors: OstContributor[];
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
      contributors: OstContributor[];
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
    let contributors: Result<OstContributor[], string>;

    // Récupérer les contributeurs OST approuvés
    const ostContributorsPromise: Promise<Result<OstContributor[], string>> =
      this.queryBus.execute(
        new FindApprovedContributorsByProjectIdQuery({ projectId: id }),
      );

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
        ostContributorsPromise,
      ]);
    } else {
      // Valeurs par défaut si pas d'octokit
      commits = Result.fail('No authentication');
      repoInfo = Result.fail('No authentication');
      contributors = await ostContributorsPromise;
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
      repositoryInfo: projectStats,
      lastCommit: projectStats.lastCommit,
      contributors: projectStats.contributors,
      commits: projectStats.commits,
    });
  }
}
