// On importe ce qu'il faut
import { PrismaProjectRepository } from './prisma.project.repository';
import { Project } from '@/domain/project/project.entity';
import { ProjectFactory } from '@/domain/project/project.factory';
import { TechStackFactory } from '@/domain/techStack/techStack.factory';

// On crée un faux PrismaService avec des fausses fonctions
const prismaMock = {
  project: {
    create: jest.fn(), // fausse fonction pour simuler la création
    findMany: jest.fn(),
  },
};

// On crée un faux projet (tu peux utiliser un vrai Project ou un mock)
const fakeProject = {
  getTechStacks: () => [
    {
      getId: () => '1',
      getName: () => 'python',
      getIconUrl: () => 'http://python',
    },
  ],
  getTitle: () => 'Mon projet',
  getDescription: () => 'Une description',
  getLink: () => 'https://github.com/monprojet',
  getStatus: () => 'ARCHIVED',
  getUserId: () => 'user1',
} as unknown as Project;

const fakePrismaProject = [
  {
    id: '1',
    title: 'Mon projet',
    description: 'Une description',
    link: 'https://github.com/monprojet',
    status: 'ARCHIVED',
    userId: 'user1',
    techStacks: [{ id: '1', name: 'python', iconUrl: 'http://python' }],
  },
  {
    id: '2',
    title: 'My projet',
    description: 'Une description',
    link: 'https://github.com/monprojet',
    status: 'ARCHIVED',
    userId: 'user1',
    techStacks: [{ id: '1', name: 'python', iconUrl: 'http://python' }],
  },
];

describe('PrismaProjectRepository', () => {
  let repo: PrismaProjectRepository;

  beforeEach(() => {
    // Avant chaque test, on crée un nouveau repo avec le mock
    repo = new PrismaProjectRepository(prismaMock as any);
    // On réinitialise les appels du mock
    prismaMock.project.create.mockReset();
  });

  describe('save', () => {
    it('doit sauvegarder un projet avec succès', async () => {
      // On dit à la fausse fonction de retourner une valeur simulée
      prismaMock.project.create.mockResolvedValueOnce({});

      // On appelle la méthode à tester
      await expect(repo.save(fakeProject)).resolves.toBeUndefined();

      // On vérifie que la fausse fonction a bien été appelée avec les bons arguments
      expect(prismaMock.project.create).toHaveBeenCalledWith({
        data: {
          techStacks: { connect: [{ id: '1' }] },
          title: { title: 'Mon projet' },
          description: 'Une description',
          link: 'https://github.com/monprojet',
          status: 'ARCHIVED',
          userId: 'user1',
        },
      });
      expect(prismaMock.project.create).toHaveBeenCalledTimes(1);
    });

    it('doit lever une erreur si le projet existe déjà', async () => {
      // On simule une erreur de doublon (code P2002)
      prismaMock.project.create.mockRejectedValueOnce({ code: 'P2002' });

      // On vérifie que la bonne erreur est levée
      await expect(repo.save(fakeProject)).rejects.toThrow(
        'Project already exists',
      );
    });

    it('doit lever une erreur si une stack est inexistante', async () => {
      prismaMock.project.create.mockRejectedValueOnce({ code: 'P2025' });

      await expect(repo.save(fakeProject)).rejects.toThrow(
        'TechStack not found',
      );
    });

    it("doit lever une unknwo erreur si l'enregistrement en db echoue", async () => {
      prismaMock.project.create.mockRejectedValueOnce({});

      await expect(repo.save(fakeProject)).rejects.toThrow('Unknown error');
    });
  });

  // describe('findProjectByTitle', () => {
  //   it("doit retourner un tableau d'entités", async () => {
  //     prismaMock.project.findMany.mockResolvedValueOnce(fakePrismaProject);

  //     const projects = await repo.findProjectByTitle('Mon projet');

  //     expect(projects).toBe(fakeProject);
  //   });

  //   it('doit appeler Prisma avec les bons critères', async () => {
  //     prismaMock.project.findMany.mockResolvedValueOnce([]);
  //     // On mock les factories pour ne pas dépendre de leur logique ici
  //     jest
  //       .spyOn(TechStackFactory, 'createMany')
  //       .mockReturnValue({ success: true, value: [] });
  //     jest
  //       .spyOn(ProjectFactory, 'create')
  //       .mockReturnValue({ success: true, value: {} as Project });

  //     await repo.findProjectByTitle('Mon projet');

  //     expect(prismaMock.project.findMany).toHaveBeenCalledWith({
  //       where: { title: { contains: 'Mon projet' } },
  //       include: { techStacks: true },
  //     });
  //   });
  // });
});
