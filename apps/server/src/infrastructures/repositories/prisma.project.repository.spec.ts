// On importe ce qu'il faut
import { PrismaProjectRepository } from './prisma.project.repository';
import { Project } from '@/domain/project/project.entity';
import { ProjectFactory } from '@/domain/project/project.factory';
import { TechStackFactory } from '@/domain/techStack/techStack.factory';
import { TechStack } from '@/domain/techStack/techstack.entity';
import { toProjectResponseDto } from '@/application/dto/adapters/project-response.adapter';
import { ProjectTestBuilder } from './__tests__/ProjectTestBuilder';
import { TechStackTestBuilder } from './__tests__/TechStackTestBuilder';
import { PrismaMock } from './__tests__/PrismaMock';

describe('PrismaProjectRepository', () => {
  let repo: PrismaProjectRepository;
  let prismaMock: PrismaMock;

  beforeEach(() => {
    prismaMock = PrismaMock.create();
    repo = new PrismaProjectRepository(prismaMock as any);
    prismaMock.reset();
  });

  describe('save', () => {
    it('doit sauvegarder un projet avec succès', async () => {
      const techStack = TechStackTestBuilder.aTechStack().buildAsMock();
      const project = ProjectTestBuilder.aProject()
        .withTechStacks([techStack])
        .buildAsMock();

      prismaMock.project.create.mockResolvedValueOnce({});

      await expect(repo.save(project)).resolves.toMatchObject({
        success: true,
        value: project,
      });

      expect(prismaMock.project.create).toHaveBeenCalledWith({
        data: {
          techStacks: { connect: [{ id: techStack.getId() }] },
          title: project.getTitle(),
          description: project.getDescription(),
          link: project.getLink(),
          status: project.getStatus(),
          userId: project.getUserId(),
        },
      });
      expect(prismaMock.project.create).toHaveBeenCalledTimes(1);
    });

    it('doit lever une erreur si le projet existe déjà', async () => {
      const project = ProjectTestBuilder.aProject()
        .withTechStacks([TechStackTestBuilder.aTechStack().buildAsMock()])
        .buildAsMock();

      prismaMock.project.create.mockRejectedValueOnce({ code: 'P2002' });
      await expect(repo.save(project)).resolves.toMatchObject({
        success: false,
        error: 'Project already exists',
      });
    });

    it('doit lever une erreur si une stack est inexistante', async () => {
      prismaMock.project.create.mockRejectedValueOnce({ code: 'P2025' });
      await expect(
        repo.save(ProjectTestBuilder.aProject().buildAsMock()),
      ).resolves.toMatchObject({
        success: false,
        error: 'TechStack not found',
      });
    });

    it("doit lever une unknown erreur si l'enregistrement en db echoue", async () => {
      prismaMock.project.create.mockRejectedValueOnce({});
      await expect(
        repo.save(ProjectTestBuilder.aProject().buildAsMock()),
      ).resolves.toMatchObject({
        success: false,
        error: 'Unknown error',
      });
    });
  });

  describe('findProjectByTitle', () => {
    it("doit retourner un tableau d'entités", async () => {
      // 1. Arrange
      const techStack = TechStackTestBuilder.aTechStack().buildAsMock();
      const prismaResult = ProjectTestBuilder.aProject()
        .withTechStacks([techStack])
        .buildAsPrismaResult();

      prismaMock.project.findMany.mockResolvedValueOnce([prismaResult]);

      // On mock les factories uniquement pour ce test car on teste le cas nominal
      jest.spyOn(TechStackFactory, 'createMany').mockReturnValue({
        success: true,
        value: [techStack],
      });

      jest.spyOn(ProjectFactory, 'create').mockReturnValue({
        success: true,
        value: ProjectTestBuilder.aProject()
          .withTechStacks([techStack])
          .buildAsMock(),
      });

      // 2. Act
      const projects = await repo.findProjectByTitle('Mon projet');

      // 3. Assert
      expect(projects.success).toBe(true);
      expect(projects.success ? projects.value : null).toBe(
        ProjectTestBuilder.aProject().withTechStacks([techStack]).buildAsMock(),
      );
    });

    it("doit gérer le cas où aucun projet n'est trouvé", async () => {
      prismaMock.project.findMany.mockResolvedValueOnce([]);
      const result = await repo.findProjectByTitle('Projet inexistant');
      expect(result).toBeNull();
    });

    it('doit appeler Prisma avec les bons critères', async () => {
      const searchTitle = 'Mon projet';
      prismaMock.project.findMany.mockResolvedValueOnce([]);

      await repo.findProjectByTitle(searchTitle);

      expect(prismaMock.project.findMany).toHaveBeenCalledWith({
        where: { title: { contains: searchTitle } },
        include: { techStacks: true },
      });
    });
  });

  describe('findProjectById', () => {
    it('doit retourner un projet par son ID avec ses techStacks', async () => {
      // 1. Arrange
      const techStack = TechStackTestBuilder.aTechStack().buildAsMock();
      const expectedProject = ProjectTestBuilder.aProject()
        .withTechStacks([techStack])
        .buildAsMock();

      const prismaResult = ProjectTestBuilder.aProject()
        .withTechStacks([techStack])
        .buildAsPrismaResult();

      prismaMock.project.findUnique.mockResolvedValueOnce(prismaResult);

      // On mock les factories car on veut vérifier la transformation complète
      jest.spyOn(TechStackFactory, 'createMany').mockReturnValue({
        success: true,
        value: [techStack],
      });

      jest.spyOn(ProjectFactory, 'create').mockReturnValue({
        success: true,
        value: expectedProject,
      });

      // 2. Act
      const project = await repo.findProjectById('1');

      // 3. Assert
      expect(project.success).toBe(true);
      expect(
        project.success ? toProjectResponseDto(project.value!) : null,
      ).toEqual(prismaResult);
    });

    it("doit lever une erreur si le projet n'existe pas", async () => {
      prismaMock.project.findUnique.mockResolvedValueOnce(null);
      await expect(repo.findProjectById('999')).resolves.toMatchObject({
        success: false,
        error: 'Error project not found',
      });
    });

    it('doit lever une erreur si la création des techStacks échoue', async () => {
      const prismaResult = ProjectTestBuilder.aProject()
        .withTechStacks([TechStackTestBuilder.aTechStack().buildAsMock()])
        .buildAsPrismaResult();

      prismaMock.project.findUnique.mockResolvedValueOnce(prismaResult);

      // On mock uniquement TechStackFactory car on teste spécifiquement ce cas d'erreur
      jest.spyOn(TechStackFactory, 'createMany').mockReturnValue({
        success: false,
        error: 'Erreur creation techStacks',
      });

      await expect(repo.findProjectById('1')).resolves.toMatchObject({
        success: false,
        error: "Erreur lors de la creation de l'entité techStacks",
      });
    });

    it('doit lever une erreur si la création du projet échoue', async () => {
      const prismaResult = ProjectTestBuilder.aProject()
        .withTechStacks([TechStackTestBuilder.aTechStack().buildAsMock()])
        .buildAsPrismaResult();

      prismaMock.project.findUnique.mockResolvedValueOnce(prismaResult);

      // On mock TechStackFactory pour le cas nominal
      jest.spyOn(TechStackFactory, 'createMany').mockReturnValue({
        success: true,
        value: [TechStackTestBuilder.aTechStack().buildAsMock()],
      });

      // On mock uniquement ProjectFactory car on teste spécifiquement ce cas d'erreur
      jest.spyOn(ProjectFactory, 'create').mockReturnValue({
        success: false,
        error: 'Erreur creation project',
      });

      await expect(repo.findProjectById('1')).resolves.toMatchObject({
        success: false,
        error: "Erreur lors de la creation de l'entité project",
      });
    });
  });

  describe('getAllProjects', () => {
    it('doit retourner tous les projets', async () => {
      // 1. Arrange
      const techStack = TechStackTestBuilder.aTechStack().buildAsMock();
      const expectedProject = ProjectTestBuilder.aProject()
        .withTechStacks([techStack])
        .buildAsMock();

      const prismaResults = [
        ProjectTestBuilder.aProject()
          .withId('1')
          .withTechStacks([techStack])
          .buildAsPrismaResult(),
        ProjectTestBuilder.aProject()
          .withId('1')
          .withTechStacks([techStack])
          .buildAsPrismaResult(),
      ];

      prismaMock.project.findMany.mockResolvedValueOnce(prismaResults);

      // On mock les factories car on veut vérifier la transformation complète
      jest.spyOn(TechStackFactory, 'createMany').mockReturnValue({
        success: true,
        value: [techStack],
      });

      jest.spyOn(ProjectFactory, 'create').mockReturnValue({
        success: true,
        value: expectedProject,
      });

      // 2. Act
      const projects = await repo.getAllProjects();

      // 3. Assert
      expect(projects.success).toBe(true);
      expect(projects.success ? projects.value : null).toEqual(prismaResults);
    });

    it("doit lever une erreur si aucun projet n'est trouvé", async () => {
      prismaMock.project.findMany.mockResolvedValueOnce(null);
      await expect(repo.getAllProjects()).resolves.toMatchObject({
        success: false,
        error: 'Error projects not found',
      });
    });

    it('doit lever une erreur si la création des techStacks échoue', async () => {
      const prismaResults = [
        ProjectTestBuilder.aProject().buildAsPrismaResult(),
      ];
      prismaMock.project.findMany.mockResolvedValueOnce(prismaResults);

      jest.spyOn(TechStackFactory, 'createMany').mockReturnValue({
        success: false,
        error: 'Erreur creation techStacks',
      });

      await expect(repo.getAllProjects()).resolves.toMatchObject({
        success: false,
        error: 'Error creation techStacks',
      });
    });

    it("doit lever une erreur si la création d'un projet échoue", async () => {
      const prismaResults = [
        ProjectTestBuilder.aProject().buildAsPrismaResult(),
      ];
      prismaMock.project.findMany.mockResolvedValueOnce(prismaResults);

      jest.spyOn(TechStackFactory, 'createMany').mockReturnValue({
        success: true,
        value: [TechStackTestBuilder.aTechStack().buildAsMock()],
      });

      jest.spyOn(ProjectFactory, 'create').mockReturnValue({
        success: false,
        error: 'Erreur creation project',
      });

      await expect(repo.getAllProjects()).resolves.toMatchObject({
        success: false,
        error: 'Error creation project',
      });
    });
  });
});
