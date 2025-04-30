import { ProjectTestBuilder } from '../project/ProjectTestBuilder';

const defaultTechStacks = [
  { getName: () => 'React' },
  { getName: () => 'Node.js' },
];

describe('Gestion des TechStacks', () => {
  it('devrait accepter un projet sans techStack', () => {
    const project = new ProjectTestBuilder().withTechStacks([]).build();
    expect(project.getTechStacks()).toHaveLength(0);
  });

  it('devrait correctement gérer plusieurs techStacks', () => {
    const project = new ProjectTestBuilder()
      .withTechStacks(defaultTechStacks as any)
      .build();

    const techStacks = project.getTechStacks();
    expect(techStacks).toHaveLength(2);
    expect(techStacks[0].getName()).toBe('React');
    expect(techStacks[1].getName()).toBe('Node.js');
  });

  // TODO: Ajouter des tests pour la validation des techStacks invalides
});
