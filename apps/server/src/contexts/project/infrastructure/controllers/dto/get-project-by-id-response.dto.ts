import { Project, ProjectData } from '@/contexts/project/domain/project.entity';
import {
  Author,
  LastCommit,
  RepositoryInfo,
} from '@/contexts/github/use-cases/ports/github-repository.port';
import { OstContributor } from '@/contexts/project/bounded-contexts/project-role-application/use-cases/queries/find-approved-contributors-by-project-id.query';

export class GetProjectByIdResponseDto {
  public static toResponse(props: {
    author: Author;
    project: Project;
    repositoryInfo: RepositoryInfo;
    commits: number;
    lastCommit: LastCommit;
    contributors: OstContributor[];
  }): Omit<ProjectData, 'ownerId'> & {
    author: Author;
    projectStats: RepositoryInfo & {
      commits: number;
      lastCommit: LastCommit;
      contributors: OstContributor[];
    };
  } {
    const {
      project,
      repositoryInfo,
      author,
      lastCommit,
      contributors,
      commits,
    } = props;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ownerId, ...projectData } = project.toPrimitive();
    return {
      author,
      ...projectData,
      projectStats: {
        forks: repositoryInfo.forks,
        stars: repositoryInfo.stars,
        watchers: repositoryInfo.watchers,
        openIssues: repositoryInfo.openIssues,
        commits,
        lastCommit: lastCommit,
        contributors: contributors,
      },
    };
  }
}
