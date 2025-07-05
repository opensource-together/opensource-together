import { Injectable } from '@nestjs/common';
import { Result } from '@/libs/result';
import { ProjectRole } from '../../domain/project-role.entity';
import { ProjectRoleRepositoryPort } from '../../use-cases/ports/project-role.repository.port';
import { TechStack } from '@/contexts/techstack/domain/techstack.entity';
import { MockClock } from '@/libs/time/mock-clock';

type ProjectRoleInMemory = {
  id: string;
  projectId?: string;
  title: string;
  description: string;
  isFilled: boolean;
  skillSet: { id: string; name: string; iconUrl: string }[];
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class InMemoryProjectRoleRepository
  implements ProjectRoleRepositoryPort
{
  constructor(private readonly clock: MockClock) {}
  private projectRoles: ProjectRoleInMemory[] = [
    {
      id: 'role-1',
      title: 'Frontend Developer',
      description: 'Responsible for UI development',
      isFilled: false,
      skillSet: [
        { id: '1', name: 'React', iconUrl: 'https://reactjs.org/favicon.ico' },
        {
          id: '2',
          name: 'TypeScript',
          iconUrl: 'https://typescriptlang.org/favicon.ico',
        },
      ],
      createdAt: new Date('2024-01-01T09:00:00Z'),
      updatedAt: new Date('2024-01-01T09:00:00Z'),
    },
  ];

  async create(projectRole: ProjectRole): Promise<Result<ProjectRole, string>> {
    const primitive = projectRole.toPrimitive();
    const newRole: ProjectRoleInMemory = {
      id: '1',
      projectId: primitive.projectId,
      title: primitive.title,
      description: primitive.description,
      isFilled: primitive.isFilled,
      skillSet: primitive.techStacks.map((ts) => ({
        id: ts.id,
        name: ts.name,
        iconUrl: ts.iconUrl,
      })),
      createdAt: this.clock.now(),
      updatedAt: this.clock.now(),
    };

    this.projectRoles.push(newRole);

    return this.reconstitute(newRole);
  }

  async update(projectRole: ProjectRole): Promise<Result<ProjectRole, string>> {
    const primitive = projectRole.toPrimitive();
    const index = this.projectRoles.findIndex(
      (role) => role.id === primitive.id,
    );

    if (index === -1) {
      return Result.fail('Project role not found');
    }

    const existingRole = this.projectRoles[index];
    const updatedRole: ProjectRoleInMemory = {
      ...existingRole,
      title: primitive.title,
      description: primitive.description,
      isFilled: primitive.isFilled,
      skillSet: primitive.techStacks.map((ts) => ({
        id: ts.id,
        name: ts.name,
        iconUrl: ts.iconUrl,
      })),
      updatedAt: new Date(),
    };

    this.projectRoles[index] = updatedRole;

    return this.reconstitute(updatedRole);
  }

  async findById(id: string): Promise<Result<ProjectRole, string>> {
    const role = this.projectRoles.find((role) => role.id === id);
    if (!role) {
      return Result.fail('Project role not found');
    }

    return this.reconstitute(role);
  }

  async findByProjectId(
    projectId: string,
  ): Promise<Result<ProjectRole[], string>> {
    const roles = this.projectRoles.filter(
      (role) => role.projectId === projectId,
    );

    const reconstitutedRoles: ProjectRole[] = [];
    for (const role of roles) {
      const result = await this.reconstitute(role);
      if (!result.success) {
        return Result.fail(result.error);
      }
      reconstitutedRoles.push(result.value);
    }

    return Result.ok(reconstitutedRoles);
  }

  async findByProjectIdAndRoleId(
    projectId: string,
    roleId: string,
  ): Promise<Result<ProjectRole, string>> {
    const role = this.projectRoles.find(
      (role) => role.projectId === projectId && role.id === roleId,
    );

    if (!role) {
      return Result.fail('Project role not found');
    }

    return this.reconstitute(role);
  }

  async delete(id: string): Promise<Result<boolean, string>> {
    const index = this.projectRoles.findIndex((role) => role.id === id);

    if (index === -1) {
      return Promise.resolve(Result.fail('Project role not found'));
    }

    this.projectRoles.splice(index, 1);
    return Promise.resolve(Result.ok(true));
  }

  async existsByProjectIdAndRoleTitle(
    projectId: string,
    roleTitle: string,
  ): Promise<Result<boolean, string>> {
    const exists = this.projectRoles.some(
      (role) => role.projectId === projectId && role.title === roleTitle,
    );

    return Promise.resolve(Result.ok(exists));
  }

  private async reconstitute(
    roleData: ProjectRoleInMemory,
  ): Promise<Result<ProjectRole, string>> {
    // Reconstitute TechStack entities
    const techStacks: TechStack[] = [];
    for (const skillData of roleData.skillSet) {
      const techStackResult = TechStack.reconstitute({
        id: skillData.id,
        name: skillData.name,
        iconUrl: skillData.iconUrl,
      });

      if (!techStackResult.success) {
        return Promise.resolve(
          Result.fail(
            `Failed to reconstitute tech stack: ${JSON.stringify(
              techStackResult.error,
            )}`,
          ),
        );
      }

      techStacks.push(techStackResult.value);
    }

    // Reconstitute ProjectRole entity
    const projectRoleResult = ProjectRole.reconstitute({
      id: roleData.id,
      projectId: roleData.projectId,
      title: roleData.title,
      description: roleData.description,
      isFilled: roleData.isFilled,
      techStacks: techStacks.map((ts) => ({
        id: ts.toPrimitive().id,
        name: ts.toPrimitive().name,
        iconUrl: ts.toPrimitive().iconUrl,
      })),
      createdAt: roleData.createdAt,
      updatedAt: roleData.updatedAt,
    });

    if (!projectRoleResult.success) {
      return Promise.resolve(
        Result.fail(
          typeof projectRoleResult.error === 'string'
            ? projectRoleResult.error
            : JSON.stringify(projectRoleResult.error),
        ),
      );
    }

    return Promise.resolve(Result.ok(projectRoleResult.value));
  }

  private generateId(): string {
    return `role-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Helper method for tests
  reset(): void {
    this.projectRoles = [
      {
        id: 'role-1',
        projectId: '123',
        title: 'Frontend Developer',
        description: 'Responsible for UI development',
        isFilled: false,
        skillSet: [
          {
            id: '1',
            name: 'React',
            iconUrl: 'https://reactjs.org/favicon.ico',
          },
          {
            id: '2',
            name: 'TypeScript',
            iconUrl: 'https://typescriptlang.org/favicon.ico',
          },
        ],
        createdAt: new Date('2024-01-01T09:00:00Z'),
        updatedAt: new Date('2024-01-01T09:00:00Z'),
      },
    ];
  }

  // Helper method for tests
  addRole(role: ProjectRoleInMemory): void {
    this.projectRoles.push(role);
  }
}
