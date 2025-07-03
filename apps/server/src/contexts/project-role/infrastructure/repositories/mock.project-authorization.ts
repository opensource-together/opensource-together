import { Injectable } from '@nestjs/common';
import { Result } from '@/shared/result';
import { ProjectAuthorizationPort } from '../../use-cases/ports/project-authorization.port';

type ProjectInMemory = {
  id: string;
  ownerId: string;
  title: string;
};

@Injectable()
export class InMemoryProjectAuthorization implements ProjectAuthorizationPort {
  private projects: ProjectInMemory[] = [
    {
      id: '123',
      ownerId: 'user-123',
      title: 'Test Project',
    },
    {
      id: '456',
      ownerId: 'user-456',
      title: 'Another Project',
    },
  ];

  async isProjectOwner(
    projectId: string,
    userId: string,
  ): Promise<Result<boolean, string>> {
    const project = this.projects.find((p) => p.id === projectId);

    if (!project) {
      return Result.fail('Project not found');
    }

    return Result.ok(project.ownerId === userId);
  }

  async projectExists(projectId: string): Promise<Result<boolean, string>> {
    const exists = this.projects.some((p) => p.id === projectId);
    return Result.ok(exists);
  }

  // Helper methods for tests
  addProject(project: ProjectInMemory): void {
    this.projects.push(project);
  }

  reset(): void {
    this.projects = [
      {
        id: '123',
        ownerId: 'user-123',
        title: 'Test Project',
      },
      {
        id: '456',
        ownerId: 'user-456',
        title: 'Another Project',
      },
    ];
  }
}
