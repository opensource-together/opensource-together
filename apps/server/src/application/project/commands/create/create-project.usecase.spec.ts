import { CreateProjectCommand } from './create-project.command';
import { ProjectRepositoryPort } from '@/application/project/ports/project.repository.port';
import { Result } from '@/shared/result';
import { ProjectTestBuilder } from '@/shared/__test__/ProjectTestBuilder';
import { CreateProjectDtoInput } from '@/application/dto/inputs/create-project-inputs.dto';

describe('CreateProjectUseCase', () => {
  let useCase: CreateProjectUseCase;
  let mockProjectRepo: jest.Mocked<ProjectRepositoryPort>;

  const validProjectInput: CreateProjectDtoInput =
    new ProjectTestBuilder().buildAsDtoInput();

  beforeEach(() => {
    mockProjectRepo = {
      save: jest.fn(),
      findProjectById: jest.fn(),
      findProjectByTitle: jest.fn(),
      getAllProjects: jest.fn(),
    };

    useCase = new CreateProjectUseCase(mockProjectRepo);
  });

  describe('Succès', () => {
    it('devrait créer un projet avec succès quand les données sont valides', async () => {
      // Arrange
      const savedProject = new ProjectTestBuilder().buildAsMock();

      mockProjectRepo.save.mockResolvedValue(Result.ok(savedProject));

      // Act
      const result = await useCase.execute(validProjectInput);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(savedProject);
        expect(mockProjectRepo.save).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('Échecs', () => {
    it('devrait échouer si le projet est invalide', async () => {
      // Arrange
      const invalidInput = {
        ...validProjectInput,
        title: '', // Titre invalide
      };

      // Act
      const result = await useCase.execute(invalidInput);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('titre');
        expect(mockProjectRepo.save).not.toHaveBeenCalled();
      }
    });

    it('devrait échouer si la sauvegarde échoue', async () => {
      // Arrange
      mockProjectRepo.save.mockResolvedValue(
        Result.fail('Erreur de sauvegarde'),
      );

      // Act
      const result = await useCase.execute(validProjectInput);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('sauvegarde');
        expect(mockProjectRepo.save).toHaveBeenCalledTimes(1);
      }
    });
  });
});
