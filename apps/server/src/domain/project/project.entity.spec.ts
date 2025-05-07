import { TechStackFactory } from '../techStack/techStack.factory';
import { TechStack } from '../techStack/techstack.entity';
import { unwrapResult } from '../../shared/test-utils';
import { ProjectStatus } from '@prisma/client';
import { ProjectTestBuilder } from './ProjectTestBuilder';

describe('Project Entity', () => {
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

  describe('Gestion des TechStacks', () => {
    it('devrait accepter un projet sans techStack', () => {
      const project = new ProjectTestBuilder().withTechStacks([]).build();

      expect(project.getTechStacks()).toHaveLength(0);
    });

    it('devrait correctement gérer plusieurs techStacks', () => {
      const project = new ProjectTestBuilder().build();

      const techStacks = project.getTechStacks();
      expect(techStacks).toHaveLength(2);
      expect(techStacks[0].getName()).toBe('React');
      expect(techStacks[1].getName()).toBe('Node.js');
    });
  });

  describe('Gestion du statut', () => {
    it('devrait accepter un statut PUBLISHED', () => {
      const project = new ProjectTestBuilder().withStatus('PUBLISHED').build();

      expect(project.getStatus()).toBe('PUBLISHED');
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
