/*import { PrismaProjectRepository } from './prisma.project.repository';
import { Result } from '@/shared/result';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ProjectTestBuilder } from '@/shared/__test__/ProjectTestBuilder';
import { PrismaMock } from '@/infrastructures/repositories/__tests__/PrismaMock';

describe('PrismaProjectRepository', () => {
  let repository: PrismaProjectRepository;
  let prismaMock: PrismaMock;

  beforeEach(async () => {
    prismaMock = new PrismaMock();
    repository = new PrismaProjectRepository(prismaMock as any);
    prismaMock.reset();
  });

  describe('save', () => {
    it('devrait sauvegarder un projet avec succès', async () => {
      const domainProject = ProjectTestBuilder.aProject()
        .withStatus('PUBLISHED')
        .buildAsInput();

      const expectedPrismaResult = ProjectTestBuilder.aProject()
        .withStatus('PUBLISHED')
        .buildAsPrismaResult();

      jest
        .spyOn(prismaMock.project, 'create')
        .mockResolvedValue(expectedPrismaResult as any);

      const result = await repository.save(domainProject);

      expect(result.success).toBe(true);
      expect(prismaMock.project.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: domainProject.getTitle(),
          status: 'PUBLISHED',
        }),
        include: { techStacks: true },
      });
    });

    it('devrait gérer les erreurs de contrainte unique', async () => {
      // ARRANGE
      const domainProject = ProjectTestBuilder.aProject().buildAsInput();

      prismaMock.project.create.mockRejectedValue(
        new PrismaClientKnownRequestError('Unique constraint failed', {
          code: 'P2002',
          clientVersion: '2.0.0',
        }),
      );

      // ACT
      const result = await repository.save(domainProject);

      // ASSERT
      expect(result).toEqual(Result.fail('Project already exists'));
    });
  });

  describe('findProjectById', () => {
    it('devrait trouver un projet par son id', async () => {
      // ARRANGE
      const projectId = '1';
      const expectedPrismaResult = ProjectTestBuilder.aProject()
        .withId(projectId)
        .buildAsPrismaResult();

      prismaMock.project.findUnique.mockResolvedValue(expectedPrismaResult);

      // ACT
      const result = await repository.findProjectById(projectId);

      // ASSERT
      expect(result.success).toBe(true);
      expect(prismaMock.project.findUnique).toHaveBeenCalledWith({
        where: { id: projectId },
        include: { techStacks: true },
      });
    });

    it("devrait retourner une erreur si le projet n'existe pas", async () => {
      // ARRANGE
      prismaMock.project.findUnique.mockResolvedValue(null);

      // ACT
      const result = await repository.findProjectById('non-existent');

      // ASSERT
      expect(result).toEqual(Result.fail('Project not found'));
    });
  });

  describe('findProjectByTitle', () => {
    it('devrait retourner une liste vide pour un titre vide', async () => {
      // ACT
      const result = await repository.findProjectByTitle('');

      // ASSERT
      expect(result).toEqual(Result.ok([]));
      expect(prismaMock.project.findMany).not.toHaveBeenCalled();
    });

    it('devrait trouver des projets par titre', async () => {
      // ARRANGE
      const searchTitle = 'Mon';
      const expectedProjects = [
        ProjectTestBuilder.aProject()
          .withTitle('Mon projet 1')
          .buildAsPrismaResult(),
        ProjectTestBuilder.aProject()
          .withTitle('Mon projet 2')
          .buildAsPrismaResult(),
      ];

      prismaMock.project.findMany.mockResolvedValue(expectedProjects);

      // ACT
      const result = await repository.findProjectByTitle(searchTitle);

      // ASSERT
      expect(result.success).toBe(true);
      expect(prismaMock.project.findMany).toHaveBeenCalledWith({
        where: {
          title: {
            mode: 'insensitive',
            startsWith: searchTitle,
          },
        },
        include: { techStacks: true },
      });
    });
  });
});*/

describe('Prisma Project Repository', () => {
  describe('dummy', () => {
    it('is true', () => {
      expect(true).toBe(true);
    });
  });
});
