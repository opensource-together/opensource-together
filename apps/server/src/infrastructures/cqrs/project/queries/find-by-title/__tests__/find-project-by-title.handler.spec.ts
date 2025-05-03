import { Test } from '@nestjs/testing';
import { FindProjectByTitleHandler } from '../find-project-by-title.handler';
import { FindProjectByTitleQuery } from '../find-project-by-title.query';
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

describe('FindProjectByTitleHandler', () => {
  let handler: FindProjectByTitleHandler;
  let projectRepositoryMock: jest.Mocked<ProjectRepositoryPort>;

  beforeEach(async () => {
    projectRepositoryMock = {
      findProjectByTitle: jest.fn(),
      save: jest.fn(),
      findProjectById: jest.fn(),
      getAllProjects: jest.fn(),
    } as jest.Mocked<ProjectRepositoryPort>;

    const moduleRef = await Test.createTestingModule({
      providers: [
        FindProjectByTitleHandler,
        {
          provide: PROJECT_REPOSITORY_PORT,
          useValue: projectRepositoryMock,
        },
      ],
    }).compile();

    handler = moduleRef.get<FindProjectByTitleHandler>(
      FindProjectByTitleHandler,
    );
  });

  describe('execute', () => {
    it('devrait retourner une liste de projets quand ils existent', async () => {
      // Arrange
      const searchTitle = 'Test';
      const mockProjects = [
        new Project({
          id: '1',
          title: Title.fromPersistence('Test Project 1'),
          description: Description.fromPersistence('Test Description 1'),
          link: Link.fromPersistence('https://test1.com'),
          status: Status.fromPersistence('DRAFT'),
          techStacks: [],
          userId: 'user-1',
        }),
        new Project({
          id: '2',
          title: Title.fromPersistence('Test Project 2'),
          description: Description.fromPersistence('Test Description 2'),
          link: Link.fromPersistence('https://test2.com'),
          status: Status.fromPersistence('DRAFT'),
          techStacks: [],
          userId: 'user-2',
        }),
      ];
      projectRepositoryMock.findProjectByTitle.mockResolvedValue(
        Result.ok(mockProjects),
      );

      // Act
      const query = new FindProjectByTitleQuery(searchTitle);
      const result = await handler.execute(query);

      // Assert
      expect(result).toBeDefined();
      expect(result).toEqual(mockProjects);
      expect(result).toHaveLength(2);
      expect(projectRepositoryMock.findProjectByTitle).toHaveBeenCalledWith(
        searchTitle,
      );
    });

    it('devrait retourner un tableau vide quand aucun projet ne correspond', async () => {
      // Arrange
      const searchTitle = 'NonExistent';
      projectRepositoryMock.findProjectByTitle.mockResolvedValue(Result.ok([]));

      // Act
      const query = new FindProjectByTitleQuery(searchTitle);
      const result = await handler.execute(query);

      // Assert
      expect(result).toBeDefined();
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
      expect(projectRepositoryMock.findProjectByTitle).toHaveBeenCalledWith(
        searchTitle,
      );
    });
  });
});
