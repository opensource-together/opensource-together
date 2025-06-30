import { Description } from './description.vo';

describe('Description VO', () => {
  describe('Contraintes de longueur', () => {
    it('devrait rejeter une description trop longue', () => {
      const project = Description.create('a'.repeat(101));
      expect(project.success).toBe(false);
      if (!project.success) {
        expect(project.error).toBe(
          'La description du projet doit comporter au maximum 100 caracteres',
        );
      }
    });

    it('devrait accepter une description à la limite maximale', () => {
      const project = Description.create('a'.repeat(100));
      expect(project.success).toBe(true);
      if (project.success) {
        expect(project.value.getDescription()).toBe('a'.repeat(100));
      }
    });
  });

  it('devrait rejeter une description trop courte (10 caracteres min)', () => {
    const project = Description.create('a'.repeat(9));
    expect(project.success).toBe(false);
    if (!project.success) {
      expect(project.error).toBe(
        'La description du projet doit comporter au minimum 10 caracteres',
      );
    }
  });
});
