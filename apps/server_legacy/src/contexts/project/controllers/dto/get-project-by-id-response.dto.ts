import { Project, ProjectData } from '@/contexts/project/domain/project.entity';
import {
  Contributor,
  LastCommit,
  RepositoryInfo,
} from '@/contexts/github/use-cases/ports/github-repository.port';

export class GetProjectByIdResponseDto {
  public static toResponse(props: {
    project: Project;
    repositoryInfo: RepositoryInfo;
    commits: number;
    lastCommit: LastCommit;
    contributors: Contributor[];
  }): Omit<ProjectData, 'ownerId'> & {
    projectStats: RepositoryInfo & {
      commits: number;
      lastCommit: LastCommit;
      contributors: Contributor[];
    };
  } {
    const { project, repositoryInfo, lastCommit, contributors, commits } =
      props;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ownerId, ...projectData } = project.toPrimitive();
    // console.log('author', author);
    return {
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
