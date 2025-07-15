import { Project, ProjectData } from '@/contexts/project/domain/project.entity';

export class GetProjectByIdResponseDto {
  public static toResponse(props: {
    project: Project;
    projectStats: {
      forks_count: number;
      stargazers_count: number;
      watchers_count: number;
      open_issues_count: number;
      commits_count: number;
      lastCommit: {
        sha: string;
        message: string;
        date: string;
        url: string;
        author: {
          login: string;
          avatar_url: string;
          html_url: string;
        };
      };
    };
  }): ProjectData & {
    projectStats: {
      forks_count: number;
      stargazers_count: number;
      watchers_count: number;
      open_issues_count: number;
      commits_count: number;
      lastCommit: {
        sha: string;
        message: string;
        date: string;
        url: string;
        author: {
          login: string;
          avatar_url: string;
          html_url: string;
        };
      };
    };
  } {
    const { project, projectStats } = props;
    return {
      ...project.toPrimitive(),
      projectStats: {
        forks_count: projectStats.forks_count,
        stargazers_count: projectStats.stargazers_count,
        watchers_count: projectStats.watchers_count,
        open_issues_count: projectStats.open_issues_count,
        commits_count: projectStats.commits_count,
        lastCommit: projectStats.lastCommit,
      },
    };
  }
}
