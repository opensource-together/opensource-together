import { ProjectTestBuilder } from '../ProjectTestBuilder';

describe('Description VO', () => {
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
