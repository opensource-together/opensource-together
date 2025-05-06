import { Result } from '@/shared/result';
import { Project } from '../project.entity';
import { TechStack } from '../../techStack/techstack.entity';
import { Title } from '../title/title.vo';
import { Description } from '../description/description.vo';
import { Status } from '../status/status.vo';
import { Link } from '../link/link.vo';

export class ProjectFactory {
  static create({
    title,
    description,
    link,
    status,
    userId,
    techStacks,
  }: {
    title: string;
    description: string;
    link: string | null;
    status: string;
    userId: string;
    techStacks: TechStack[];
  }): Result<Project> {
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
        id: null,
        title: titleResult.value,
        description: descriptionResult.value,
        link: linkResult.value,
        status: statusResult.value,
        userId,
        techStacks,
      }),
    );
  }

  static fromPersistence({
    id,
    title,
    description,
    link,
    status,
    userId,
    techStacks,
  }: {
    id: string;
    title: string;
    description: string;
    link: string | null;
    status: string;
    userId: string;
    techStacks: TechStack[];
  }): Result<Project> {
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
        id,
        title: titleResult.value,
        description: descriptionResult.value,
        link: linkResult.value,
        status: statusResult.value,
        userId,
        techStacks,
      }),
    );
  }
}
