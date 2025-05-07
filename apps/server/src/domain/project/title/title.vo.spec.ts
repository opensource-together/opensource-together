import { Title } from './title.vo';

describe('Title VO', () => {
  it('devrait accepter un titre qui respecte les contraintes de longueur', () => {
    const project = Title.create('abc');
    expect(project.success).toBe(true);
    if (project.success) {
      expect(project.value.getTitle()).toBe('abc');
    }
  });

  it('devrait rejeter un titre trop court (moins de 2 caractères)', () => {
    const project = Title.create('a');
    expect(project.success).toBe(false);
    if (!project.success) {
      expect(project.error).toBe(
        'Le titre du projet doit comporter au minimum 2 caracteres',
      );
    }
  });

  it('devrait rejeter un titre trop long (plus de 20 caractères)', () => {
    const project = Title.create('a'.repeat(21));
    expect(project.success).toBe(false);
    if (!project.success) {
      expect(project.error).toBe(
        'Le titre du projet doit comporter au maximum 20 caracteres',
      );
    }
  });

  it('devrait rejeter un titre corrompu', () => {
    expect(() => {
      Title.fromPersistence('a'.repeat(21));
    }).toThrow('Le titre du projet doit comporter au maximum 20 caracteres');
  });
});
