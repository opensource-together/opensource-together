import { Status } from './status.vo';
describe('Status VO', () => {
  it('devrait accepter un statut PUBLISHED', () => {
    const project = Status.create('PUBLISHED');
    expect(project.success).toBe(true);
    if (project.success) {
      expect(project.value.getStatus()).toBe('PUBLISHED');
    }
  });

  it('devrait accepter un statut ARCHIVED', () => {
    const project = Status.create('ARCHIVED');
    expect(project.success).toBe(true);
    if (project.success) {
      expect(project.value.getStatus()).toBe('ARCHIVED');
    }
  });

  it('devrait rejeter un statut invalide', () => {
    const project = Status.create('Pending' as any);
    expect(project.success).toBe(false);
    if (!project.success) {
      expect(project.error).toBe(
        'Status must be PUBLISHED or ARCHIVED or DRAFT',
      );
    }
  });

  it('devrait accepter un statut null', () => {
    const project = Status.create(null as any);
    expect(project.success).toBe(false);
    if (!project.success) {
      expect(project.error).toBe(
        'Status must be PUBLISHED or ARCHIVED or DRAFT',
      );
    }
  });

  it('devrait throw une erreur si le status est corrompu', () => {
    expect(() => {
      Status.fromPersistence('Pending' as any);
    }).toThrow('Status must be PUBLISHED or ARCHIVED or DRAFT');
  });
});
