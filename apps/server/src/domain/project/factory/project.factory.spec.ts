import { Project } from '../project.entity';
import { ProjectFactory } from './project.factory';
import { TechStack } from '../../techStack/techstack.entity';

describe('ProjectFactory', () => {
  const validProjectData = {
    title: 'Mon Projet',
    description: 'Une description valide du projet',
    link: 'https://github.com/test',
    status: 'DRAFT',
    userId: 'user-123',
    techStacks: [] as TechStack[],
  };

  describe('Tests Unitaires - Validation des champs', () => {
    it('devrait échouer si le titre est invalide', () => {
      const result = ProjectFactory.create({
        ...validProjectData,
        title: '', // Titre invalide
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('titre');
      }
    });

    it('devrait échouer si la description est trop courte', () => {
      const result = ProjectFactory.create({
        ...validProjectData,
        description: 'a', // Description trop courte
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('description');
      }
    });
  });

  describe("Tests d'Intégration - Création de Projet", () => {
    it('devrait créer un projet valide avec tous les champs renseignés', () => {
      const result = ProjectFactory.create(validProjectData);

      expect(result.success).toBe(true);
      if (result.success) {
        const project = result.value;
        expect(project).toBeInstanceOf(Project);
        expect(project.getTitle()).toBe(validProjectData.title);
        expect(project.getDescription()).toBe(validProjectData.description);
        expect(project.getLink()).toBe(validProjectData.link);
      }
    });

    it('devrait créer un projet valide avec des champs optionnels non renseignés', () => {
      const result = ProjectFactory.create({
        ...validProjectData,
        link: null,
        status: null as unknown as string,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        const project = result.value;
        expect(project).toBeInstanceOf(Project);
        expect(project.getLink()).toBeNull();
        expect(project.getStatus()).toBeNull();
      }
    });
  });

  describe("Tests d'Intégration - fromPersistence", () => {
    it('devrait reconstruire un projet depuis la persistence', () => {
      const persistedData = {
        ...validProjectData,
        id: 'project-123',
      };

      const result = ProjectFactory.fromPersistence(persistedData);

      expect(result.success).toBe(true);
      if (result.success) {
        const project = result.value;
        expect(project).toBeInstanceOf(Project);
        expect(project.getId()).toBe('project-123');
        expect(project.getTitle()).toBe(persistedData.title);
      }
    });
  });
});
