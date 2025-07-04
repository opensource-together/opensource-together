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
  ProjectValidationErrors,
} from '@/contexts/project/domain/project.entity';
import { TechStackRepositoryPort } from '@/contexts/techstack/use-cases/ports/techstack.repository.port';
import { TECHSTACK_REPOSITORY_PORT } from '@/contexts/techstack/use-cases/ports/techstack.repository.port';
import { InMemoryTechStackRepository } from '@/contexts/techstack/infrastructure/repositories/mock.techstack.repository';
import { InMemoryProjectRepository } from '@/contexts/project/infrastructure/repositories/mock.project.repository';
import { TechStack } from '@/contexts/techstack/domain/techstack.entity';
import { Result } from '@/shared/result';
import { MockClock } from '@/shared/time/mock-clock';
import { PROJECT_VALIDATION_SERVICE_PORT } from '../../ports/project-validation.service.port';
import { ProjectValidationService } from '@/contexts/project/infrastructure/services/project-validation.service';
import { PROJECT_ROLE_REPOSITORY_PORT } from '@/contexts/project-role/use-cases/ports/project-role.repository.port';
import { InMemoryProjectRoleRepository } from '@/contexts/project-role/infrastructure/repositories/mock.project-role.repository';

// Type pour les props du CreateProjectCommand
type CreateProjectCommandProps = {
  ownerId: string;
  title: string;
  shortDescription: string;
  description: string;
  externalLinks: { type: string; url: string }[];
  techStacks: { id: string; name: string; iconUrl: string }[];
  projectRoles: {
    id: string;
    title: string;
    description: string;
    isFilled: boolean;
    techStacks: { id: string; name: string; iconUrl: string }[];
  }[];
};

describe('CreateProjectCommandHandler', () => {
  let handler: CreateProjectCommandHandler;
  let projectRepo: ProjectRepositoryPort;
  let techStackRepo: TechStackRepositoryPort;
  const mockTechStackRepo = new InMemoryTechStackRepository();
  const mockClock = new MockClock(new Date('2024-01-01T09:00:00Z'));
  const mockProjectRepo = new InMemoryProjectRepository(mockClock);
  const mockProjectRoleRepo = new InMemoryProjectRoleRepository(mockClock);
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
        {
          provide: PROJECT_VALIDATION_SERVICE_PORT,
          useClass: ProjectValidationService,
        },
        {
          provide: PROJECT_ROLE_REPOSITORY_PORT,
          useValue: mockProjectRoleRepo,
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

  afterEach(() => {
    mockProjectRepo.reset();
    mockTechStackRepo.reset();
    mockProjectRoleRepo.reset();
  });

  describe('Success', () => {
    it('should create and save a project successfully with minimal props needed', async () => {
      await createTechStacksInMemory(techStackRepo);
      // Arrange
      const projectResultExpected = Project.reconstitute({
        id: '1',
        title: 'minimal project',
        description: 'une description',
        shortDescription: 'une description',
        externalLinks: [],
        projectRoles: [],
        techStacks: [
          {
            id: '1',
            name: 'react',
            iconUrl: 'https://reactjs.org/favicon.ico',
          },
        ],
        ownerId: '1',
        createdAt: mockClock.now(),
        updatedAt: mockClock.now(),
      });
      if (!projectResultExpected.success) {
        throw new Error(JSON.stringify(projectResultExpected.error));
      }
      const minimalPropsNeeded = getMinimalPropsNeeded();
      const command = new CreateProjectCommand(minimalPropsNeeded);

      // createTechStacksInMemory(techStackRepo);
      const result: Result<Project, ProjectValidationErrors | string> =
        await handler.execute(command);

      // Assert
      if (result.success) {
        expect(result.value).toBeInstanceOf(Project);
        expect(result.value.toPrimitive()).toMatchObject(
          projectResultExpected.value.toPrimitive(),
        );
        await projectRepo.delete(result.value.toPrimitive().id as string);
        // await deleteTechStacksInMemory(
        //   techStackRepo,
        //   minimalPropsNeeded.techStacks,
        // );
      } else {
        throw new Error(JSON.stringify(result.error));
      }
    });
    it('should create and save a project successfully with project roles', async () => {
      // Arrange
      await createTechStacksInMemory(techStackRepo);
      const props = getCommandProps({
        projectRoles: [
          {
            id: '1',
            title: 'Fullstack Developer',
            description: 'Need a fullstack developer for a new project',
            isFilled: false,
            techStacks: [
              {
                id: '1',
                name: 'react',
                iconUrl: 'https://reactjs.org/favicon.ico',
              },
            ],
          },
        ],
      });
      const projectResultExpected = Project.reconstitute({
        id: '1',
        title: 'command props',
        description: 'une description',
        shortDescription: 'une description courte',
        externalLinks: [],
        projectRoles: [
          {
            id: '1',
            title: 'Fullstack Developer',
            description: 'Need a fullstack developer for a new project',
            isFilled: false,
            techStacks: [
              {
                id: '1',
                name: 'react',
                iconUrl: 'https://reactjs.org/favicon.ico',
              },
            ],
            createdAt: mockClock.now(),
            updatedAt: mockClock.now(),
          },
        ],
        techStacks: [
          {
            id: '1',
            name: 'react',
            iconUrl: 'https://reactjs.org/favicon.ico',
          },
        ],
        ownerId: '1',
        createdAt: mockClock.now(),
        updatedAt: mockClock.now(),
      });
      if (!projectResultExpected.success) {
        throw new Error(JSON.stringify(projectResultExpected.error));
      }
      const command = new CreateProjectCommand({
        title: 'command props',
        description: 'une description',
        shortDescription: 'une description courte',
        externalLinks: [],
        projectRoles: [
          {
            title: 'Fullstack Developer',
            description: 'Need a fullstack developer for a new project',
            isFilled: false,
            techStacks: [
              {
                id: '1',
                name: 'react',
                iconUrl: 'https://reactjs.org/favicon.ico',
              },
            ],
          },
        ],
        techStacks: [
          {
            id: '1',
            name: 'react',
            iconUrl: 'https://reactjs.org/favicon.ico',
          },
        ],
        ownerId: '1',
      });

      const result: Result<Project, ProjectValidationErrors | string> =
        await handler.execute(command);

      // Assert
      if (result.success) {
        expect(result.value).toBeInstanceOf(Project);
        expect(result.value.toPrimitive()).toMatchObject(
          projectResultExpected.value.toPrimitive(),
        );
        console.log('result.value', result.value.toPrimitive());
        await projectRepo.delete(result.value.toPrimitive().id as string);
        await deleteTechStacksInMemory(techStackRepo, props.techStacks);
      } else {
        throw new Error(JSON.stringify(result.error));
      }
    });
  });

  describe('Failures', () => {
    it('should return an error when tech stacks are not found', async () => {
      createTechStacksInMemory(techStackRepo);
      const props = getCommandProps({
        techStacks: [
          {
            id: '999', // ID qui n'existe pas
            name: 'nonexistent',
            iconUrl: 'https://example.com/icon.svg',
          },
        ],
      });
      console.log('props', props);
      const command = new CreateProjectCommand(props);
      const result = await handler.execute(command);
      if (!result.success) {
        console.log('result', result.error);
        expect(result.error).toContain('Tech stacks not found');
        await deleteTechStacksInMemory(techStackRepo, props.techStacks);
      } else {
        throw new Error('Test should have failed but succeeded');
      }
    });
  });
});

const getCommandProps = (
  override: Partial<CreateProjectCommandProps> = {},
): CreateProjectCommandProps => {
  return {
    ownerId: '1',
    title: 'command props',
    shortDescription: 'une description courte',
    description: 'une description',
    externalLinks: [],
    projectRoles: [],
    techStacks: [
      { id: '1', name: 'react', iconUrl: 'https://reactjs.org/favicon.ico' },
      { id: '2', name: 'angular', iconUrl: 'https://angular.io/favicon.ico' },
    ],
    ...override,
  };
};

const getMinimalPropsNeeded = (): CreateProjectCommandProps => {
  return {
    ownerId: '1',
    title: 'minimal project',
    description: 'une description',
    shortDescription: 'une description',
    externalLinks: [],
    projectRoles: [],
    techStacks: [
      { id: '1', name: 'react', iconUrl: 'https://reactjs.org/favicon.ico' },
    ],
  };
};

const createTechStacksInMemory = async (
  techStackRepo: TechStackRepositoryPort,
): Promise<void> => {
  //create tech stacks in memory
  const techStack1 = TechStack.reconstitute({
    id: '1',
    name: 'react',
    iconUrl: 'https://reactjs.org/favicon.ico',
  });
  const techStack2 = TechStack.reconstitute({
    id: '2',
    name: 'angular',
    iconUrl: 'https://angular.io/favicon.ico',
  });
  if (!techStack1.success || !techStack2.success) {
    throw new Error('Tech stacks not created');
  }
  await Promise.all([
    techStackRepo.create(techStack1.value),
    techStackRepo.create(techStack2.value),
  ]);
};

const deleteTechStacksInMemory = async (
  techStackRepo: TechStackRepositoryPort,
  techStacks: { id: string; name: string; iconUrl: string }[],
) => {
  await Promise.all(
    techStacks.map((techStack) => techStackRepo.delete(techStack.id)),
  );
};
