import { Test } from '@nestjs/testing';
import { FindProjectByIdHandler } from '../find-project-by-id.handler';
import { FindProjectByIdQuery } from '../find-project-by-id.query';
import {
  PROJECT_REPOSITORY_PORT,
  ProjectRepositoryPort,
} from '@/application/ports/project.repository.port';
import { Project } from '@/domain/project/project.entity';
import { Title } from '@/domain/project/title.vo';
import { Description } from '@/domain/project/description.vo';
import { Link } from '@/domain/project/link.vo';
import { Status } from '@/domain/project/status.vo';

describe('FindProjectByIdHandler', () => {
  let handler: FindProjectByIdHandler; // Instance du handler qu'on teste
  let projectRepositoryMock: jest.Mocked<ProjectRepositoryPort>; // Mock du repository

  beforeEach(async () => {
    // Création du mock du repository
    projectRepositoryMock = {
      findProjectById: jest.fn(),
      findProjectByTitle: jest.fn(),
      getAllProjects: jest.fn(),
      save: jest.fn(),
    } as jest.Mocked<ProjectRepositoryPort>;
    // Configuration du module de test NestJS
    const moduleRef = await Test.createTestingModule({
      providers: [
        FindProjectByIdHandler,
        {
          provide: PROJECT_REPOSITORY_PORT, // Token d'injection
          useValue: projectRepositoryMock, // Notre mock
        },
      ],
    }).compile();

    // Récupération d'une instance du handler
    handler = moduleRef.get<FindProjectByIdHandler>(FindProjectByIdHandler);
  });

  describe('execute', () => {
    it('devrait retourner un projet quand il existe', async () => {
      // Arrange (Préparation)
      const projectId = '123';
      const mockProject = new Project({
        id: projectId,
        title: Title.fromPersistence('Test Project'),
        description: Description.fromPersistence('Test Description'),
        link: Link.fromPersistence('https://test.com'),
        status: Status.fromPersistence('DRAFT'),
        techStacks: [],
        userId: 'user-1',
      });

      // On configure le comportement du mock
      projectRepositoryMock.findProjectById.mockResolvedValue(mockProject);

      // Act (Action)
      const query = new FindProjectByIdQuery(projectId);
      const result = await handler.execute(query);

      // Assert (Vérification)
      expect(result).toBeDefined();
      expect(result).toEqual(mockProject);
      expect(projectRepositoryMock.findProjectById).toHaveBeenCalledWith(
        projectId,
      );
    });

    it("devrait retourner null quand le projet n'existe pas", async () => {
      // Arrange
      const projectId = 'non-existent';
      projectRepositoryMock.findProjectById.mockResolvedValue(null);

      // Act
      const query = new FindProjectByIdQuery(projectId);
      const result = await handler.execute(query);

      // Assert
      expect(result).toBeNull();
      expect(projectRepositoryMock.findProjectById).toHaveBeenCalledWith(
        projectId,
      );
    });
  });
});
