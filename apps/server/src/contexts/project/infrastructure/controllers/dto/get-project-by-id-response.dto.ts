import { Project, ProjectData } from '@/contexts/project/domain/project.entity';
import {
  Author,
  Contributor,
  LastCommit,
  ProjectStats,
} from '@/contexts/github/use-cases/ports/github-repository.port';

export class GetProjectByIdResponseDto {
  public static toResponse(props: {
    author: Author;
    project: Project;
    projectStats: ProjectStats;
    lastCommit: LastCommit;
    contributors: Contributor[];
  }): Omit<ProjectData, 'ownerId'> & {
    projectStats: ProjectStats;
    author: Author;
  } {
    const { project, projectStats, author, lastCommit, contributors } = props;
    const { ownerId,...projectData } = project.toPrimitive();
    return {
      author,
      ...projectData,
      projectStats: {
        forks: projectStats.forks,
        stars: projectStats.stars,
        watchers: projectStats.watchers,
        openIssues: projectStats.openIssues,
        commits: projectStats.commits,
        lastCommit: lastCommit,
        contributors: contributors,
      },
    };
  }
}
