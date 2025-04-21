import { Result } from '@/shared/result';
import { Project } from './project.entity';
import { TechStack } from '../techStack/techstack.entity';
import { UUID } from 'crypto';
export class ProjectFactory {
  static create(
    id: string | null,
    title: string,
    description: string,
    link: string | null,
    status: any,
    userId: string,
    techStacks: TechStack[],
  ): Result<Project> {
    return Result.ok(
      new Project({
        id: id,
        title: title,
        description: description,
        link: link,
        status: status,
        userId: userId,
        techStacks: techStacks,
      }),
    );
  }
}
