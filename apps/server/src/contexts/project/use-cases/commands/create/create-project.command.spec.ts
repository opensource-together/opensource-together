import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateProjectCommand,
  CreateProjectCommandHandler,
} from './create-project.command';
import {
  PROJECT_REPOSITORY_PORT,
  ProjectRepositoryPort,
} from '../../ports/project.repository.port';
import {
  Project,
  ProjectPrimitive,
  ProjectValidationErrors,
} from '@/contexts/project/domain/project.entity';
import { TechStackRepositoryPort } from '@/application/teckstack/ports/techstack.repository.port';
import { TECHSTACK_REPOSITORY_PORT } from '@/application/teckstack/ports/techstack.repository.port';
import { InMemoryTechStackRepository } from '@/infrastructures/repositories/teckstack/mock.teckstack.repository';
import { InMemoryProjectRepository } from '@/contexts/project/infrastructure/repositories/mock.project.repository';
import {
  TechStack,
  TechStackPrimitive,
} from '@/domain/techStack/techstack.entity';
import { Result } from '@/shared/result';
describe('CreateProjectCommandHandler', () => {
  let handler: CreateProjectCommandHandler;
  let projectRepo: ProjectRepositoryPort;
  let techStackRepo: TechStackRepositoryPort;

  const mockTechStackRepo = new InMemoryTechStackRepository();
  const mockProjectRepo = new InMemoryProjectRepository();
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProjectCommandHandler,
        {
          provide: PROJECT_REPOSITORY_PORT,
          useValue: mockProjectRepo,
        },
        {
          provide: TECHSTACK_REPOSITORY_PORT,
          useValue: mockTechStackRepo,
        },
      ],
    }).compile();

    //command handler
    handler = module.get<CreateProjectCommandHandler>(
      CreateProjectCommandHandler,
    );
    //repository dependency
    projectRepo = module.get<ProjectRepositoryPort>(PROJECT_REPOSITORY_PORT);
    techStackRepo = module.get<TechStackRepositoryPort>(
      TECHSTACK_REPOSITORY_PORT,
    );
  });

  describe('Success', () => {
    it('should create and save a project successfully with minimal props needed', async () => {
      // Arrange
      const minimalPropsNeeded: ProjectPrimitive = getMinimalPropsNeeded();
      const command = new CreateProjectCommand(minimalPropsNeeded);

      await createTechStacksInMemory(techStackRepo);
      const result: Result<Project, ProjectValidationErrors | string> =
        await handler.execute(command);

      // Assert
      if (result.success) {
        expect(result.value).toBeInstanceOf(Project);
        await projectRepo.delete(result.value.toPrimitive().id as string);
        await deleteTechStacksInMemory(
          techStackRepo,
          minimalPropsNeeded.techStacks,
        );
      } else {
        throw new Error(result.error as string);
      }
    });
  });

  describe('Failures', () => {
    it('should return an error when tech stacks are not found', async () => {
      await createTechStacksInMemory(techStackRepo);
      const props = getCommandProps({
        techStacks: [
          {
            id: '1',
            name: 'php',
            iconUrl: 'https://php.net/favicon.ico',
          },
          {
            id: '2',
            name: 'angular',
            iconUrl: 'https://angular.io/favicon.ico',
          },
        ],
      });
      console.log('props', props);
      const command = new CreateProjectCommand(props as ProjectPrimitive);
      const result = await handler.execute(command);
      if (!result.success) {
        expect(result.error).toEqual('Tech stacks not found');
        await deleteTechStacksInMemory(techStackRepo, props.techStacks);
      }
    });

    it('should return an error when project with this title already exists', async () => {
      // Arrange
      const props1 = getCommandProps({ title: 'test1' });
      const project1 = Project.create(props1 as ProjectPrimitive);
      if (!project1.success) {
        throw new Error(project1.error as string);
      }
      const projectCreated1 = await projectRepo.create(project1.value);
      if (!projectCreated1.success) {
        throw new Error(projectCreated1.error);
      }
      await createTechStacksInMemory(techStackRepo);
      const command = new CreateProjectCommand(props1 as ProjectPrimitive);
      const result = await handler.execute(command);
      if (!result.success) {
        await deleteTechStacksInMemory(techStackRepo, props1.techStacks);
        await projectRepo.delete(
          projectCreated1.value.toPrimitive().id as string,
        );
        expect(result.error).toEqual('Project with this title already exists');
      }
    });
  });
});

const getCommandProps = (override: Partial<ProjectPrimitive>) => {
  return {
    ownerId: '1',
    title: 'command props',
    description: 'une description',
    difficulty: 'easy',
    externalLinks: undefined,
    projectImages: [],
    githubLink: 'https://github.com/test',
    techStacks: [
      { id: '1', name: 'react', iconUrl: 'https://reactjs.org/favicon.ico' },
      { id: '2', name: 'angular', iconUrl: 'https://angular.io/favicon.ico' },
    ],
    projectRoles: [
      { name: 'test', description: 'test' },
      { name: 'test', description: 'test' },
    ],
    projectMembers: [],
    ...override,
  };
};

const getMinimalPropsNeeded = (): ProjectPrimitive => {
  return {
    ownerId: '1',
    title: 'minimal project',
    description: 'une description',
    difficulty: 'easy',
    externalLinks: undefined,
    projectImages: [],
    githubLink: 'https://github.com/test',
    techStacks: [
      { id: '1', name: 'react', iconUrl: 'https://reactjs.org/favicon.ico' },
      { id: '2', name: 'angular', iconUrl: 'https://angular.io/favicon.ico' },
    ],
    projectRoles: [
      { name: 'test', description: 'test' },
      { name: 'test', description: 'test' },
    ],
    projectMembers: [],
  };
};

const createTechStacksInMemory = async (
  techStackRepo: TechStackRepositoryPort,
) => {
  //create tech stacks in memory
  const techStack1 = TechStack.create({
    name: 'php',
    iconUrl: 'https://php.net/favicon.ico',
  });
  const techStack2 = TechStack.create({
    name: 'react',
    iconUrl: 'https://reactjs.org/favicon.ico',
  });
  if (!techStack1.success) {
    throw new Error(techStack1.error as string);
  }
  if (!techStack2.success) {
    throw new Error(techStack2.error as string);
  }
  const [techStack1Created, techStack2Created] = await Promise.all([
    techStackRepo.create(techStack1.value),
    techStackRepo.create(techStack2.value),
  ]);
  if (!techStack1Created.success || !techStack2Created.success) {
    throw new Error('Tech stacks not created');
  }
};

const deleteTechStacksInMemory = async (
  techStackRepo: TechStackRepositoryPort,
  techStacks: TechStackPrimitive[],
) => {
  await Promise.all(
    techStacks.map((techStack) => techStackRepo.delete(techStack.id as string)),
  );
};
