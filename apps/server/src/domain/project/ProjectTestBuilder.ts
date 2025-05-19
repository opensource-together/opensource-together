import { TechStackFactory } from '../techStack/techStack.factory';
import { TechStack } from '../techStack/techstack.entity';
import { ProjectFactory } from './factory/project.factory';
import { unwrapResult } from '../../shared/test-utils';

export class ProjectTestBuilder {
  private id: string | null = '1';
  private title: string = 'Test Project';
  private description: string = 'Test Description';
  private link: string | null = null;
  private techStacks: TechStack[] = [
    unwrapResult(TechStackFactory.create('1', 'React', 'https://react.dev/')),
    unwrapResult(
      TechStackFactory.create('2', 'Node.js', 'https://nodejs.org/en/'),
    ),
  ];
  private ownerId: string = '1';

  withId(id: string | null) {
    this.id = id;
    return this;
  }

  withTitle(title: string) {
    this.title = title;
    return this;
  }

  withDescription(description: string) {
    this.description = description;
    return this;
  }

  withLink(link: string | null) {
    this.link = link;
    return this;
  }

  withOwnerId(ownerId: string) {
    this.ownerId = ownerId;
    return this;
  }

  withTechStacks(techStacks: TechStack[]) {
    this.techStacks = techStacks;
    return this;
  }

  build() {
    const result = ProjectFactory.create({
      title: this.title,
      description: this.description,
      link: this.link,
      ownerId: this.ownerId,
      techStacks: this.techStacks,
    });

    if (!result.success) {
      throw new Error(result.error);
    }

    return result.value;
  }
}
