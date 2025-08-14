import { Project } from '@/contexts/project/domain/project.entity';
import { TechStack } from '@/contexts/techstack/domain/techstack.entity';
import { Result } from '@/libs/result';
import { CLOCK_PORT, ClockPort } from '@/libs/time';
import { Inject, Injectable } from '@nestjs/common';

type ProjectInMemory = {
  id: string;
  ownerId: string;
  title: string;
  shortDescription: string;
  description: string;
  externalLinks?: { type: string; url: string }[];
  techStacks: {
    id: string;
    name: string;
    iconUrl: string;
    type: 'LANGUAGE' | 'TECH';
  }[];
  projectRoles: {
    id?: string;
    title: string;
    description: string;
    isFilled: boolean;
    techStacks: {
      id: string;
      name: string;
      iconUrl: string;
      type: 'LANGUAGE' | 'TECH';
    }[];
  }[];
  categories: { id: string; name: string }[];
  keyFeatures: { id?: string; feature: string }[];
  projectGoals: { id?: string; goal: string }[];
  projectMembers: { id: string; userId: string }[];
  owner?: {
    id: string;
    username: string;
    login: string;
    avatarUrl: string;
    email: string;
    provider: string;
    techStacks: {
      id: string;
      name: string;
      iconUrl: string;
      type: 'LANGUAGE' | 'TECH';
    }[];
    createdAt: Date;
    updatedAt: Date;
  };
  createdAt?: Date;
  updatedAt?: Date;
};

@Injectable()
export class InMemoryProjectRepository {
  // implements ProjectRepositoryPort {
  constructor(@Inject(CLOCK_PORT) private clock: ClockPort) {}

  private projects: ProjectInMemory[] = [
    {
      id: 'i39pYIlZKF',
      ownerId: '123',
      title: 'existing project',
      shortDescription: 'A test project for demonstration',
      description: 'une description plus détaillée du projet de test',
      externalLinks: [{ type: 'github', url: 'https://github.com/test/repo' }],
      techStacks: [
        {
          id: '1',
          name: 'php',
          iconUrl: 'https://php.net/favicon.ico',
          type: 'LANGUAGE',
        },
        {
          id: '2',
          name: 'react',
          iconUrl: 'https://reactjs.org/favicon.ico',
          type: 'TECH',
        },
        {
          id: '3',
          name: 'nodejs',
          iconUrl: 'https://nodejs.org/favicon.ico',
          type: 'TECH',
        },
      ],
      projectRoles: [],
      categories: [{ id: '1', name: 'Web Development' }],
      keyFeatures: [{ id: '1', feature: 'Test Key Feature' }],
      projectGoals: [{ id: '1', goal: 'Test Project Goal' }],
      projectMembers: [
        { id: 'member1', userId: '456' }, // Utilisateur 456 est membre de ce projet
        { id: 'member2', userId: '789' }, // Utilisateur 789 est membre de ce projet
      ],
      owner: {
        id: '123',
        username: 'testuser',
        login: 'testuser',
        avatarUrl: 'https://avatars.githubusercontent.com/u/123?v=4',
        email: 'test@example.com',
        provider: 'github',
        techStacks: [
          {
            id: '1',
            name: 'php',
            iconUrl: 'https://php.net/favicon.ico',
            type: 'LANGUAGE',
          },
        ],
        createdAt: new Date('2024-01-01T09:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      },
      createdAt: new Date('2024-01-01T09:00:00Z'),
      updatedAt: new Date('2024-01-01T10:00:00Z'),
    },
    {
      id: 'project2',
      ownerId: '456',
      title: 'second project',
      shortDescription: 'A second test project',
      description: 'Description du deuxième projet',
      externalLinks: [],
      techStacks: [
        {
          id: '1',
          name: 'php',
          iconUrl: 'https://php.net/favicon.ico',
          type: 'LANGUAGE',
        },
      ],
      projectRoles: [],
      categories: [{ id: '1', name: 'Web Development' }],
      keyFeatures: [{ id: '1', feature: 'Second Key Feature' }],
      projectGoals: [{ id: '1', goal: 'Second Project Goal' }],
      projectMembers: [
        { id: 'member3', userId: '123' }, // Utilisateur 123 est membre de ce projet
      ],
      owner: {
        id: '456',
        username: 'seconduser',
        login: 'seconduser',
        avatarUrl: 'https://avatars.githubusercontent.com/u/456?v=4',
        email: 'second@example.com',
        provider: 'github',
        techStacks: [],
        createdAt: new Date('2024-01-02T09:00:00Z'),
        updatedAt: new Date('2024-01-02T10:00:00Z'),
      },
      createdAt: new Date('2024-01-02T09:00:00Z'),
      updatedAt: new Date('2024-01-02T10:00:00Z'),
    },
  ];

  create(project: Project): Promise<Result<Project, string>> {
    const projectPrimitive = project.toPrimitive();
    const newProject: ProjectInMemory = {
      id: '1',
      ownerId: projectPrimitive.ownerId,
      title: projectPrimitive.title,
      shortDescription: projectPrimitive.shortDescription,
      description: projectPrimitive.description,
      externalLinks: projectPrimitive.externalLinks,
      techStacks: projectPrimitive.techStacks.map((tech) => ({
        id: tech.id,
        name: tech.name,
        iconUrl: tech.iconUrl,
        type: tech.type,
      })),
      projectRoles: projectPrimitive.projectRoles.map((role) => ({
        id: '1',
        title: role.title,
        description: role.description,
        isFilled: role.isFilled,
        techStacks: role.techStacks.map((tech) => ({
          id: tech.id,
          name: tech.name,
          iconUrl: tech.iconUrl,
          type: tech.type,
        })),
        projectId: '1',
        createdAt: this.clock.now(),
        updatedAt: this.clock.now(),
      })),
      categories: projectPrimitive.categories,
      keyFeatures: projectPrimitive.keyFeatures,
      projectGoals: projectPrimitive.projectGoals,
      projectMembers: [],
      owner: projectPrimitive.owner,
      createdAt: this.clock.now(),
      updatedAt: this.clock.now(),
    };
    this.projects.push(newProject);

    return this.reconstructProject(newProject);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private reconstructProject(
    projectInMemory: ProjectInMemory,
  ): Promise<Result<Project, string>> {
    // Reconstruct TechStacks
    const techStackResults = projectInMemory.techStacks.map((ts) =>
      TechStack.reconstitute({
        id: ts.id,
        name: ts.name,
        iconUrl: ts.iconUrl,
        type: ts.type,
      }),
    );

    if (!techStackResults.every((result) => result.success)) {
      return Promise.resolve(Result.fail('Failed to reconstitute tech stacks'));
    }

    const techStacks = techStackResults.map((result) => result.value);

    // Reconstruct Project
    const projectResult = Project.reconstitute({
      id: projectInMemory.id,
      ownerId: projectInMemory.ownerId,
      title: projectInMemory.title,
      shortDescription: projectInMemory.shortDescription,
      description: projectInMemory.description,
      externalLinks: projectInMemory.externalLinks,
      techStacks: techStacks.map((ts) => ts.toPrimitive()),
      projectRoles: projectInMemory.projectRoles,
      categories: projectInMemory.categories,
      keyFeatures: projectInMemory.keyFeatures,
      projectGoals: projectInMemory.projectGoals,
      createdAt: projectInMemory.createdAt,
      updatedAt: projectInMemory.updatedAt,
      owner: projectInMemory.owner || {
        id: projectInMemory.ownerId,
        username: 'testuser',
        login: 'testuser',
        avatarUrl: 'https://avatars.githubusercontent.com/u/123?v=4',
        email: 'test@example.com',
        provider: 'github',
        createdAt: projectInMemory.createdAt || new Date(),
        updatedAt: projectInMemory.updatedAt || new Date(),
        techStacks: projectInMemory.techStacks,
      },
    });

    if (!projectResult.success) {
      return Promise.resolve(Result.fail(projectResult.error as string));
    }

    return Promise.resolve(Result.ok(projectResult.value));
  }

  findByTitle(title: string): Promise<Result<Project, string>> {
    const projectFound = this.projects.find((p) => p.title === title);
    if (!projectFound) {
      return Promise.resolve(Result.fail('Project not found'));
    }
    return this.reconstructProject(projectFound);
  }

  delete(id: string): Promise<Result<boolean, string>> {
    const projectFound = this.projects.find((p) => p.id === id);
    if (!projectFound) {
      return Promise.resolve(Result.fail('Project not found'));
    }
    this.projects = this.projects.filter((p) => p.id !== id);
    return Promise.resolve(Result.ok(true));
  }

  update(id: string, project: Project): Promise<Result<Project, string>> {
    const foundProject = this.projects.find((p) => p.id === id);
    if (!foundProject) {
      return Promise.resolve(Result.fail('Project not found'));
    }

    const index = this.projects.findIndex((p) => p.id === id);
    const projectPrimitive = project.toPrimitive();

    this.projects[index] = {
      ...foundProject,
      ownerId: projectPrimitive.ownerId,
      title: projectPrimitive.title,
      shortDescription: projectPrimitive.shortDescription,
      description: projectPrimitive.description,
      externalLinks: projectPrimitive.externalLinks,
      techStacks: projectPrimitive.techStacks.map((tech) => ({
        id: tech.id,
        name: tech.name,
        iconUrl: tech.iconUrl,
        type: tech.type,
      })),
      projectRoles: projectPrimitive.projectRoles.map((role) => ({
        id: role.id,
        title: role.title,
        description: role.description,
        isFilled: role.isFilled,
        techStacks: role.techStacks.map((tech) => ({
          id: tech.id,
          name: tech.name,
          iconUrl: tech.iconUrl,
          type: tech.type,
        })),
      })),
      categories: projectPrimitive.categories,
      keyFeatures: projectPrimitive.keyFeatures,
      projectGoals: projectPrimitive.projectGoals,
      createdAt: foundProject.createdAt,
      updatedAt: this.clock.now(),
    };

    return this.reconstructProject(this.projects[index]);
  }

  findById(id: string): Promise<Result<Project, string>> {
    const projectFound = this.projects.find((p) => p.id === id);
    if (!projectFound) {
      return Promise.resolve(Result.fail('Project not found'));
    }
    return this.reconstructProject(projectFound);
  }

  async getAllProjects(): Promise<Result<Project[], string>> {
    const projectPromises = this.projects.map((project) =>
      this.reconstructProject(project),
    );

    const results = await Promise.all(projectPromises);
    const failures = results.filter((r) => !r.success);
    if (failures.length > 0) {
      return Result.fail('Failed to reconstitute some projects');
    }

    const projects = results.filter((r) => r.success).map((r) => r.value);
    return Result.ok(projects);
  }

  async findProjectsByUserId(
    userId: string,
  ): Promise<Result<Project[], string>> {
    // Récupérer les projets où l'utilisateur est propriétaire OU membre
    const userProjects = this.projects.filter(
      (p) =>
        p.ownerId === userId ||
        p.projectMembers.some((member) => member.userId === userId),
    );

    if (userProjects.length === 0) {
      return Result.ok([]);
    }

    const projectPromises = userProjects.map((project) =>
      this.reconstructProject(project),
    );

    const results = await Promise.all(projectPromises);
    const failures = results.filter((r) => !r.success);
    if (failures.length > 0) {
      return Result.fail('Failed to reconstitute some projects');
    }

    const projects = results.filter((r) => r.success).map((r) => r.value);
    return Result.ok(projects);
  }

  reset(): void {
    this.projects = [
      {
        id: 'i39pYIlZKF',
        ownerId: '123',
        title: 'existing project',
        shortDescription: 'A test project for demonstration',
        description: 'une description plus détaillée du projet de test',
        externalLinks: [
          { type: 'github', url: 'https://github.com/test/repo' },
        ],
        techStacks: [
          {
            id: '1',
            name: 'php',
            iconUrl: 'https://php.net/favicon.ico',
            type: 'LANGUAGE',
          },
          {
            id: '2',
            name: 'react',
            iconUrl: 'https://reactjs.org/favicon.ico',
            type: 'TECH',
          },
          {
            id: '3',
            name: 'nodejs',
            iconUrl: 'https://nodejs.org/favicon.ico',
            type: 'TECH',
          },
        ],
        projectRoles: [],
        categories: [{ id: '1', name: 'Web Development' }],
        keyFeatures: [{ id: '1', feature: 'Test Key Feature' }],
        projectGoals: [{ id: '1', goal: 'Test Project Goal' }],
        projectMembers: [
          { id: 'member1', userId: '456' },
          { id: 'member2', userId: '789' },
        ],
        owner: {
          id: '123',
          username: 'testuser',
          login: 'testuser',
          avatarUrl: 'https://avatars.githubusercontent.com/u/123?v=4',
          email: 'test@example.com',
          provider: 'github',
          techStacks: [
            {
              id: '1',
              name: 'php',
              iconUrl: 'https://php.net/favicon.ico',
              type: 'LANGUAGE',
            },
          ],
          createdAt: new Date('2024-01-01T09:00:00Z'),
          updatedAt: new Date('2024-01-01T10:00:00Z'),
        },
        createdAt: new Date('2024-01-01T09:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      },
      {
        id: 'project2',
        ownerId: '456',
        title: 'second project',
        shortDescription: 'A second test project',
        description: 'Description du deuxième projet',
        externalLinks: [],
        techStacks: [
          {
            id: '1',
            name: 'php',
            iconUrl: 'https://php.net/favicon.ico',
            type: 'LANGUAGE',
          },
        ],
        projectRoles: [],
        categories: [{ id: '1', name: 'Web Development' }],
        keyFeatures: [{ id: '1', feature: 'Second Key Feature' }],
        projectGoals: [{ id: '1', goal: 'Second Project Goal' }],
        projectMembers: [
          { id: 'member3', userId: '123' }, // Utilisateur 123 est membre de ce projet
        ],
        createdAt: new Date('2024-01-02T09:00:00Z'),
        updatedAt: new Date('2024-01-02T10:00:00Z'),
      },
    ];
  }
}

// const randomString = (length = 10): string => {
//   const chars =
//     'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//   let result = '';
//   for (let i = 0; i < length; i++) {
//     result += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return result;
// };
