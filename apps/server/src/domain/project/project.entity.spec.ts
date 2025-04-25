import { TechStackFactory } from '../techStack/techStack.factory';
import { TechStack } from '../techStack/techstack.entity';
import { ProjectFactory } from './project.factory';
import { unwrapResult } from '../../shared/test-utils';
import { ProjectStatus } from '@prisma/client';

class ProjectTestBuilder {
  private id: string | null = '1';
  private title: string = 'Test Project';
  private description: string = 'Test Description';
  private link: string | null = null;
  private status: ProjectStatus = 'PUBLISHED';
  private techStacks: TechStack[] = [
    unwrapResult(TechStackFactory.create('1', 'React', 'https://react.dev/')),
    unwrapResult(
      TechStackFactory.create('2', 'Node.js', 'https://nodejs.org/en/'),
    ),
  ];
  private userId: string = '1';

  withId(id: string | null) {
    this.id = id;
    return this;
  }

  withTitle(title: string) {
    this.title = title;
    return this;
  }

  withDescription(description: string) {
    this.description = description;
    return this;
  }

  withStatus(status: ProjectStatus) {
    this.status = status;
    return this;
  }

  withLink(link: string | null) {
    this.link = link;
    return this;
  }

  withUserId(userId: string) {
    this.userId = userId;
    return this;
  }

  withTechStacks(techStacks: TechStack[]) {
    this.techStacks = techStacks;
    return this;
  }

  build() {
    const result = ProjectFactory.create(
      this.id,
      this.title,
      this.description,
      this.link,
      this.status,
      this.userId,
      this.techStacks,
    );

    if (!result.success) {
      throw new Error(result.error);
    }

    return result.value;
  }
}

describe('Project Entity', () => {
  let defaultTechStacks: TechStack[];

  // Setup commun pour tous les tests
  beforeEach(() => {
    defaultTechStacks = [
      unwrapResult(TechStackFactory.create('1', 'React', 'https://react.dev/')),
      unwrapResult(
        TechStackFactory.create('2', 'Node.js', 'https://nodejs.org/en/'),
      ),
    ];
  });

  describe('Création', () => {
    it('devrait créer un projet avec des valeurs valides', () => {
      const project = new ProjectTestBuilder().build();

      expect(project).toBeDefined();
      expect(project.getTitle()).toBe('Test Project');
      expect(project.getDescription()).toBe('Test Description');
      expect(project.getStatus()).toBe('PUBLISHED');
      expect(project.getUserId()).toBe('1');
      expect(project.getTechStacks()).toHaveLength(2);
    });

    it('devrait renvoyer une erreur si le titre est absent', () => {
      expect(() => {
        new ProjectTestBuilder().withTitle(null as any).build();
      }).toThrow('Le titre du projet est requis');
    });

    it('devrait renvoyer une erreur si la description est absente', () => {
      expect(() => {
        new ProjectTestBuilder().withDescription(null as any).build();
      }).toThrow('La description du projet est requise');
    });
  });

  describe('Validation du titre', () => {
    it('devrait rejeter un titre trop court (moins de 2 caractères)', () => {
      expect(() => {
        new ProjectTestBuilder().withTitle('a').build();
      }).toThrow('Le titre du projet doit comporter au minimum 2 caracteres');
    });

    it('devrait accepter un titre à la limite minimale (2 caractères)', () => {
      const project = new ProjectTestBuilder().withTitle('ab').build();

      expect(project.getTitle()).toBe('ab');
    });
  });

  describe('Validation de la description', () => {
    describe('Contraintes de longueur', () => {
      it('devrait rejeter une description trop longue', () => {
        expect(() => {
          new ProjectTestBuilder().withDescription('a'.repeat(101)).build();
        }).toThrow(
          'La description du projet doit comporter au maximum 100 caracteres',
        );
      });

      it('devrait accepter une description à la limite maximale', () => {
        const project = new ProjectTestBuilder()
          .withDescription('a'.repeat(100))
          .build();

        expect(project.getDescription()).toBe('a'.repeat(100));
      });
    });

    it('devrait rejeter une description trop courte (10 caracteres min)', () => {
      expect(() => {
        new ProjectTestBuilder().withDescription('a'.repeat(9)).build();
      }).toThrow(
        'La description du projet doit comporter au minimum 10 caracteres',
      );
    });
  });

  describe('Gestion des TechStacks', () => {
    it('devrait accepter un projet sans techStack', () => {
      const project = new ProjectTestBuilder().withTechStacks([]).build();

      expect(project.getTechStacks()).toHaveLength(0);
    });

    it('devrait correctement gérer plusieurs techStacks', () => {
      const project = new ProjectTestBuilder()
        .withTechStacks(defaultTechStacks)
        .build();

      const techStacks = project.getTechStacks();
      expect(techStacks).toHaveLength(2);
      expect(techStacks[0].getName()).toBe('React');
      expect(techStacks[1].getName()).toBe('Node.js');
    });

    // TODO: Ajouter des tests pour la validation des techStacks invalides
  });

  describe('Gestion du statut', () => {
    it('devrait accepter un statut PUBLISHED', () => {
      const project = new ProjectTestBuilder().withStatus('PUBLISHED').build();

      expect(project.getStatus()).toBe('PUBLISHED');
    });

    it('devrait accepter un statut ARCHIVED', () => {
      const project = new ProjectTestBuilder().withStatus('ARCHIVED').build();

      expect(project.getStatus()).toBe('ARCHIVED');
    });

    it('devrait rejeter un statut invalide', () => {
      expect(() => {
        new ProjectTestBuilder().withStatus('Pending' as any).build();
      }).toThrow('Status must be PUBLISHED or ARCHIVED');
    });

    it('devrait accepter un statut null', () => {
      const project = new ProjectTestBuilder().withStatus(null as any).build();

      expect(project.getStatus()).toBeNull();
    });
  });

  describe('Gestion du lien', () => {
    it('devrait accepter un projet sans lien', () => {
      const project = new ProjectTestBuilder().withLink(null).build();

      expect(project.getLink()).toBeNull();
    });

    it('devrait accepter un lien valide', () => {
      const validUrl = 'https://github.com/mon-projet';
      const project = new ProjectTestBuilder().withLink(validUrl).build();

      expect(project.getLink()).toBe(validUrl);
    });

    // TODO: Ajouter des tests pour les URLs malformées si nécessaire
  });

  describe('Invariants et règles métier', () => {
    it("devrait préserver l'immutabilité de l'ID", () => {
      const project = new ProjectTestBuilder().withId('123').build();

      expect(project.getId()).toBe('123');
      // TODO: Vérifier qu'on ne peut pas modifier l'ID après création
    });

    // TODO: Ajouter d'autres tests d'invariants
  });

  // Tests des cas d'erreur combinés
  describe('Validation combinée', () => {
    it('devrait rejeter un projet avec plusieurs violations', () => {
      expect(() => {
        new ProjectTestBuilder()
          .withTitle('a') // Trop court
          .withDescription('a'.repeat(101)) // Trop long
          .build();
      }).toThrow('Le titre du projet doit comporter au minimum 2 caracteres');
    });
  });
});
