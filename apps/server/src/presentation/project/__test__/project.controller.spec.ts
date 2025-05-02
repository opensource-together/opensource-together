import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { ProjectController } from '../project.controller';
import { FindProjectByIdQuery } from '@/infrastructures/cqrs/project/queries/find-by-id/find-project-by-id.query';
import { ProjectTestBuilder } from '@/domain/project/ProjectTestBuilder';

describe('ProjectController', () => {
  let controller: ProjectController;
  let commandBus: jest.Mocked<CommandBus>;
  let queryBus: jest.Mocked<QueryBus>;

  beforeEach(async () => {
    // 1. Création des mocks
    const mockCommandBus = {
      execute: jest.fn(),
    };

    const mockQueryBus = {
      execute: jest.fn(),
    };

    // 2. Configuration du module de test
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [
        {
          provide: CommandBus,
          useValue: mockCommandBus,
        },
        {
          provide: QueryBus,
          useValue: mockQueryBus,
        },
      ],
    }).compile();

    // 3. Récupération des instances
    controller = module.get<ProjectController>(ProjectController);
    commandBus = module.get(CommandBus);
    queryBus = module.get(QueryBus);
  });

  describe('getProjectById', () => {
    it('should return a single project by id', async () => {
      // 1. Arrangement (Setup)
      const projectId = '1';
      const mockProjectResponse = {
        value: new ProjectTestBuilder().build(),
      };
      queryBus.execute.mockResolvedValue(mockProjectResponse);

      // 2. Action
      const result = await controller.getProject(projectId);

      // 3. Assertions
      expect(queryBus.execute).toHaveBeenCalledWith(
        new FindProjectByIdQuery(projectId),
      );
      expect(result.success).toBe(true);
      expect(result.value.id).toBe(projectId);
    });

    it('should return a 404 error if the project is not found', async () => {
      const projectId = '1';
      const mockProjectResponse = {
        value: new ProjectTestBuilder().build(),
      };

      queryBus.execute.mockResolvedValue(null);

      const result = await controller.getProject(projectId);

      expect(result).resolves.toThrow('Error project not found');
    });
  });
});
