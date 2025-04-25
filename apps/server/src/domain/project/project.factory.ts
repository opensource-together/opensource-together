import { Result } from '@/shared/result';
import { Project } from './project.entity';
import { TechStack } from '../techStack/techstack.entity';
import { Title } from './title.vo';
import { Description } from './description.vo';
import { Status } from './status.vo';
import { Link } from './link.vo';
import { ProjectStatus } from '@prisma/client';

export class ProjectFactory {
  static create(
    id: string | null,
    title: string,
    description: string,
    link: string | null,
    status: ProjectStatus | null,
    userId: string,
    techStacks: TechStack[],
  ): Result<Project> {
    const titleResult = Title.create(title);
    const descriptionResult = Description.create(description);
    const statusResult = status ? Status.create(status) : Result.ok(null);
    const linkResult = link ? Link.create(link) : Result.ok(null);

    if (!titleResult.success) {
      return Result.fail(titleResult.error);
    }

    if (!descriptionResult.success) {
      return Result.fail(descriptionResult.error);
    }

    if (!statusResult.success) {
      return Result.fail(statusResult.error);
    }

    if (!linkResult.success) {
      return Result.fail(linkResult.error);
    }

    return Result.ok(
      new Project({
        id: id,
        title: titleResult.value,
        description: descriptionResult.value,
        link: linkResult.value,
        status: statusResult.value,
        userId: userId,
        techStacks: techStacks,
      }),
    );
  }
}
