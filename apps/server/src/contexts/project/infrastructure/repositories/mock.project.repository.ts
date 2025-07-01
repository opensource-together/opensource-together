import { ProjectRepositoryPort } from '../../use-cases/ports/project.repository.port';
import { Project } from '@/contexts/project/domain/project.entity';
import { Result } from '@/shared/result';
import { Inject, Injectable } from '@nestjs/common';
import { CLOCK_PORT, ClockPort } from '@/shared/time';
import { TechStackPrimitive } from '@/domain/techStack/techstack.entity';

interface TechStackInMemory extends TechStackPrimitive {
  id: string;
  name: string;
  iconUrl: string;
}
type ProjectInMemory = {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  externalLinks?: { type: string; url: string }[] | undefined;
  projectImages?: string[];
  githubLink: string | null;
  techStacks: TechStackInMemory[];
  projectRoles?: { id?: string; title: string; description: string }[];
  projectMembers?: { userId: string; name: string; role: string }[];
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
      description: 'une description',
      difficulty: 'easy',
      externalLinks: undefined,
      projectImages: [],
      githubLink: 'https://github.com/test',
      techStacks: [
        { id: '1', name: 'php', iconUrl: 'https://php.net/favicon.ico' },
        { id: '2', name: 'react', iconUrl: 'https://reactjs.org/favicon.ico' },
        { id: '3', name: 'nodejs', iconUrl: 'https://nodejs.org/favicon.ico' },
      ],
      projectRoles: [
        { id: 'role-1', title: 'test', description: 'test' },
        { id: 'role-2', title: 'test2', description: 'test2' },
      ],
      projectMembers: [],
      createdAt: new Date('2024-01-01T09:00:00Z'), // 1h avant updatedAt
      updatedAt: new Date('2024-01-01T10:00:00Z'),
    },
  ];
  create(project: Project): Promise<Result<Project, string>> {
    const projectToRepo = project.toPrimitive();
    const newProject: ProjectInMemory = {
      ...projectToRepo,
      techStacks: projectToRepo.techStacks.map((techStack) => ({
        id: techStack.toPrimitive().id as string,
        name: techStack.toPrimitive().name,
        iconUrl: techStack.toPrimitive().iconUrl,
      })),
      id: randomString(),
      createdAt: this.clock.now(),
      updatedAt: this.clock.now(),
    };
    this.projects.push(newProject);
    const projectCreated = Project.reconstitute(newProject);
    if (!projectCreated.success) {
      return Promise.resolve(Result.fail(projectCreated.error as string));
    }
    return Promise.resolve(Result.ok(projectCreated.value));
  }
  findProjectByTitle(title: string): Promise<Result<Project, string>> {
    const projectFound: ProjectInMemory | undefined = this.projects.find(
      (p) => p.title === title,
    );
    if (!projectFound) {
      return Promise.resolve(Result.fail('Project not found'));
    }
    const projectReconstituted = Project.reconstitute(projectFound);
    if (!projectReconstituted.success) {
      return Promise.resolve(Result.fail(projectReconstituted.error as string));
    }
    return Promise.resolve(Result.ok(projectReconstituted.value));
  }
  delete(id: string): Promise<Result<boolean>> {
    const projectFound = this.projects.find((p) => p.id === id);
    if (!projectFound) {
      return Promise.resolve(Result.fail('Project not found'));
    }
    this.projects = this.projects.filter((p) => p.id !== id);
    return Promise.resolve(Result.ok(true));
  }
  update(id: string, project: Project): Promise<Result<Project>> {
    const foundedProject = this.projects.find((p) => p.id === id);
    if (!foundedProject) {
      return Promise.resolve(Result.fail('Project not found'));
    }
    const index = this.projects.findIndex((p) => p.id === id);
    const projectToUpdate = project.toPrimitive();
    this.projects[index] = {
      ...projectToUpdate,
      techStacks: projectToUpdate.techStacks.map((techStack) => ({
        id: techStack.toPrimitive().id as string,
        name: techStack.toPrimitive().name,
        iconUrl: techStack.toPrimitive().iconUrl,
      })),
      id: id,
      createdAt: foundedProject.createdAt,
      updatedAt: this.clock.now(),
    };
    const projectReconstituted = Project.reconstitute(this.projects[index]);
    if (!projectReconstituted.success) {
      return Promise.resolve(Result.fail(projectReconstituted.error as string));
    }
    return Promise.resolve(Result.ok(projectReconstituted.value));
  }
  findById(id: string): Promise<Result<Project>> {
    const projectFound = this.projects.find((p) => p.id === id);
    if (!projectFound) {
      return Promise.resolve(Result.fail('Project not found'));
    }
    const projectReconstituted = Project.reconstitute(projectFound);
    if (!projectReconstituted.success) {
      return Promise.resolve(Result.fail(projectReconstituted.error as string));
    }
    return Promise.resolve(Result.ok(projectReconstituted.value));
  }
}
const randomString = (length = 10): string => {
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
