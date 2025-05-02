import { ProjectRepositoryPort } from '@/application/ports/project.repository.port';
import { CreateProjectHandler } from '../create-project.handler';
import { Test } from '@nestjs/testing';
import { PROJECT_REPOSITORY_PORT } from '@/application/ports/project.repository.port';
import { ProjectTestBuilder } from '@/infrastructures/repositories/__tests__/ProjectTestBuilder';
import { CreateProjectCommand } from '../create-project.command';
import { ProjectStatus, TechStack } from '@prisma/client';
import { toProjectResponseDto } from '@/application/dto/adapters/project-response.adapter';

describe('CreateProjectHandler', () => {
  let handler: CreateProjectHandler;
  let projectRepositoryMock: jest.Mocked<ProjectRepositoryPort>;

  beforeEach(async () => {
    projectRepositoryMock = {
      save: jest.fn(),
      findProjectById: jest.fn(),
      findProjectByTitle: jest.fn(),
      getAllProjects: jest.fn(),
    } as jest.Mocked<ProjectRepositoryPort>;

    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateProjectHandler,
        {
          provide: PROJECT_REPOSITORY_PORT,
          useValue: projectRepositoryMock,
        },
      ],
    }).compile();

    handler = moduleRef.get<CreateProjectHandler>(CreateProjectHandler);
  });

  describe('execute', () => {
    it('devrais retourner le projet crée', async () => {
      const projectInput = ProjectTestBuilder.aProject().buildAsInput();

      const command = new CreateProjectCommand(
        projectInput.title,
        projectInput.description,
        projectInput.link,
        projectInput.status as ProjectStatus,
        projectInput.techStacks as unknown as TechStack[],
        projectInput.userId,
      );
      const result = await handler.execute(command);
      const project = result.success
        ? toProjectResponseDto(result.value)
        : null;

      projectRepositoryMock.save.mockResolvedValueOnce(projectInput);

      expect(result).toBeDefined();
      expect(project).toEqual(projectInput);
    });
  });
});
