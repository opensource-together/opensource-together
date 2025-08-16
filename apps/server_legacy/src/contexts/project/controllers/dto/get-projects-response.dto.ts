import { Project } from '@/contexts/project/domain/project.entity';
import { RepositoryInfo } from '@/contexts/github/use-cases/ports/github-repository.port';
import { LastCommit } from '@/contexts/github/use-cases/ports/github-repository.port';
import { Contributor } from '@/contexts/github/use-cases/ports/github-repository.port';

export class GetProjectsResponseDto {
  public static toResponse(
    projects: {
      author: {
        ownerId: string;
        name: string;
        avatarUrl: string;
      };
      repositoryInfo: RepositoryInfo;
      lastCommit: LastCommit;
      commits: number;
      contributors: Contributor[];
      project: Project;
    }[],
  ): {
    author: {
      ownerId: string;
      name: string;
      avatarUrl: string;
    };
    repositoryInfo: RepositoryInfo;
    lastCommit: LastCommit;
    commits: number;
    contributors: Contributor[];
  }[] {
    return projects.map((project) => {
      const projectData = project.project.toPrimitive();
      return {
        author: {
          ownerId: project.author.ownerId,
          name: project.author.name,
          avatarUrl: project.author.avatarUrl,
        },
        ...projectData,
        repositoryInfo: project.repositoryInfo,
        lastCommit: project.lastCommit,
        commits: project.commits,
        contributors: project.contributors,
      };
    });
  }
}
