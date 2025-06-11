/*import { ProjectTestBuilder } from '../project/ProjectTestBuilder';
import { TechStackFactory } from './techStack.factory';

const defaultTechStacks = [
  { getName: () => 'React' },
  { getName: () => 'Node.js' },
];

describe('Gestion des TechStacks', () => {
  it('devrait refuser un projet sans techStack', () => {
    const result = TechStackFactory.createMany([]);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Aucune techStack n'ont été selectionnées");
    }
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
});*/
