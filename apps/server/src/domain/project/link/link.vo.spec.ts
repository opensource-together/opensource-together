import { ProjectTestBuilder } from '../ProjectTestBuilder';

describe('Link VO', () => {
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
