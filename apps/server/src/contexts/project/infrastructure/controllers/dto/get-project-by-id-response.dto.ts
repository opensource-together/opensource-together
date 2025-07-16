import { Project, ProjectData } from '@/contexts/project/domain/project.entity';

export type LastCommit = {
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
export type Contributor = {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
};
export type Author = {
  login: string;
  avatar_url: string;
  html_url: string;
};
export type ProjectStats = {
  forks: number;
  stars: number;
  watchers: number;
  openIssues: number;
  commits: number;
  lastCommit: LastCommit;
  contributors: Contributor[];
};
export class GetProjectByIdResponseDto {
  public static toResponse(props: {
    author: Author;
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
      contributors: {
        login: string;
        avatar_url: string;
        html_url: string;
        contributions: number;
      }[];
    };
  }): ProjectData & {
    projectStats: ProjectStats;
    author: Author;
  } {
    const { project, projectStats, author } = props;
    return {
      author,
      ...project.toPrimitive(),
      projectStats: {
        forks: projectStats.forks_count,
        stars: projectStats.stargazers_count,
        watchers: projectStats.watchers_count,
        openIssues: projectStats.open_issues_count,
        commits: projectStats.commits_count,
        lastCommit: projectStats.lastCommit,
        contributors: projectStats.contributors,
      },
    };
  }
}
