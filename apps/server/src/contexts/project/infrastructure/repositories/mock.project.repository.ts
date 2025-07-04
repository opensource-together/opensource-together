import { ProjectRepositoryPort } from '../../use-cases/ports/project.repository.port';
import { Project } from '@/contexts/project/domain/project.entity';
import { Result } from '@/libs/result';
import { Inject, Injectable } from '@nestjs/common';
import { CLOCK_PORT, ClockPort } from '@/libs/time';
import { TechStack } from '@/contexts/techstack/domain/techstack.entity';

type ProjectInMemory = {
  id: string;
  ownerId: string;
  title: string;
  shortDescription: string;
  description: string;
  externalLinks?: { type: string; url: string }[];
  techStacks: { id: string; name: string; iconUrl: string }[];
  projectRoles: {
    id?: string;
    title: string;
    description: string;
    isFilled: boolean;
    techStacks: { id: string; name: string; iconUrl: string }[];
  }[];
  createdAt?: Date;
  updatedAt?: Date;
};

@Injectable()
export class InMemoryProjectRepository implements ProjectRepositoryPort {
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
        { id: '1', name: 'php', iconUrl: 'https://php.net/favicon.ico' },
        { id: '2', name: 'react', iconUrl: 'https://reactjs.org/favicon.ico' },
        { id: '3', name: 'nodejs', iconUrl: 'https://nodejs.org/favicon.ico' },
      ],
      projectRoles: [],
      createdAt: new Date('2024-01-01T09:00:00Z'),
      updatedAt: new Date('2024-01-01T10:00:00Z'),
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
      })),
      projectRoles: [],
      createdAt: this.clock.now(),
      updatedAt: this.clock.now(),
    };
    this.projects.push(newProject);

    return this.reconstructProject(newProject);
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
      createdAt: projectInMemory.createdAt,
      updatedAt: projectInMemory.updatedAt,
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
        })),
      })),
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

  getAllProjects(): Promise<Result<Project[], string>> {
    const projectPromises = this.projects.map((project) =>
      this.reconstructProject(project),
    );

    return Promise.all(projectPromises).then((results) => {
      const failures = results.filter((r) => !r.success);
      if (failures.length > 0) {
        return Result.fail('Failed to reconstitute some projects');
      }

      const projects = results.filter((r) => r.success).map((r) => r.value);
      return Result.ok(projects);
    });
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
          { id: '1', name: 'php', iconUrl: 'https://php.net/favicon.ico' },
          {
            id: '2',
            name: 'react',
            iconUrl: 'https://reactjs.org/favicon.ico',
          },
          {
            id: '3',
            name: 'nodejs',
            iconUrl: 'https://nodejs.org/favicon.ico',
          },
        ],
        projectRoles: [],
        createdAt: new Date('2024-01-01T09:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
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
