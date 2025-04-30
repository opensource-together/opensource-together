import { TechStackFactory } from '../techStack/techStack.factory';
import { TechStack } from '../techStack/techstack.entity';
import { unwrapResult } from '../../shared/test-utils';
import { ProjectTestBuilder } from './ProjectTestBuilder';

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
