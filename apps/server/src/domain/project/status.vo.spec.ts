import { ProjectTestBuilder } from './ProjectTestBuilder';

describe('Status VO', () => {
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
