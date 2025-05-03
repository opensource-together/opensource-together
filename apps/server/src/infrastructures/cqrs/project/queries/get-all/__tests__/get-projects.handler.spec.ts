import { Test } from '@nestjs/testing';
import { GetProjectsHandler } from '../get-projects.handler';
import {
  PROJECT_REPOSITORY_PORT,
  ProjectRepositoryPort,
} from '@/application/ports/project.repository.port';
import { Project } from '@/domain/project/project.entity';
import { Title } from '@/domain/project/title.vo';
import { Description } from '@/domain/project/description.vo';
import { Link } from '@/domain/project/link.vo';
import { Status } from '@/domain/project/status.vo';
import { Result } from '@/shared/result';

describe('GetProjectsHandler', () => {
  let handler: GetProjectsHandler;
  let projectRepositoryMock: jest.Mocked<ProjectRepositoryPort>;

  beforeEach(async () => {
    projectRepositoryMock = {
      getAllProjects: jest.fn(),
      save: jest.fn(),
      findProjectById: jest.fn(),
      findProjectByTitle: jest.fn(),
    } as jest.Mocked<ProjectRepositoryPort>;

    const moduleRef = await Test.createTestingModule({
      providers: [
        GetProjectsHandler,
        {
          provide: PROJECT_REPOSITORY_PORT,
          useValue: projectRepositoryMock,
        },
      ],
    }).compile();

    handler = moduleRef.get<GetProjectsHandler>(GetProjectsHandler);
  });

  describe('execute', () => {
    it('devrait retourner tous les projets', async () => {
      // Arrange
      const mockProjects = [
        new Project({
          id: '1',
          title: Title.fromPersistence('Project 1'),
          description: Description.fromPersistence('Description 1'),
          link: Link.fromPersistence('https://project1.com'),
          status: Status.fromPersistence('DRAFT'),
          techStacks: [],
          userId: 'user-1',
        }),
        new Project({
          id: '2',
          title: Title.fromPersistence('Project 2'),
          description: Description.fromPersistence('Description 2'),
          link: Link.fromPersistence('https://project2.com'),
          status: Status.fromPersistence('DRAFT'),
          techStacks: [],
          userId: 'user-2',
        }),
        new Project({
          id: '3',
          title: Title.fromPersistence('Project 3'),
          description: Description.fromPersistence('Description 3'),
          link: Link.fromPersistence('https://project3.com'),
          status: Status.fromPersistence('DRAFT'),
          techStacks: [],
          userId: 'user-3',
        }),
      ];
      projectRepositoryMock.getAllProjects.mockResolvedValue(
        Result.ok(mockProjects),
      );

      // Act
      const result = await handler.execute();

      // Assert
      expect(result).toBeDefined();
      expect(result).toEqual(mockProjects);
      expect(result).toHaveLength(3);
      expect(projectRepositoryMock.getAllProjects).toHaveBeenCalled();
    });

    it("devrait retourner un tableau vide quand il n'y a pas de projets", async () => {
      // Arrange
      projectRepositoryMock.getAllProjects.mockResolvedValue(Result.ok([]));

      // Act
      const result = await handler.execute();

      // Assert
      expect(result).toBeDefined();
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
      expect(projectRepositoryMock.getAllProjects).toHaveBeenCalled();
    });
  });
});
