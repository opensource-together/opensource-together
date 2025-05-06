import { ProjectTestBuilder } from '../ProjectTestBuilder';

describe('Title VO', () => {
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
