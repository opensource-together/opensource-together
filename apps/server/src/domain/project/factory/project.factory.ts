import { Result } from '@/shared/result';
import { Project } from '../project.entity';
import { TechStack } from '../../techStack/techstack.entity';
import { Title } from '../title/title.vo';
import { Description } from '../description/description.vo';
import { Status } from '../status/status.vo';
import { Link } from '../link/link.vo';

export class ProjectFactory {
  /**
   * @description
   * Create a new Project entity with validated value objects,
   *
   * if the value objects are not valid, the factory will return an error
   * @param {Object} params - The project creation parameters
   * @param {string} params.title - The title of the project
   * @param {string} params.description - The description of the project
   * @param {string|null} params.link - Optional URL link for the project
   * @param {string} params.status - The status of the project
   * @param {string} params.userId - The ID of the user who owns the project
   * @param {TechStack[]} params.techStacks - Array of technology stacks used in the project
   * @returns {Result<Project>} Result containing either the created Project or an error
   */
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

  /**
   * @description
   * Reconstruct a Project entity from a persistence object,
   *
   * ensure the data is valid and the business rules are respected
   * @param {Object} params - The project persistence parameters
   * @param {string} params.id - The ID of the project
   * @param {string} params.title - The title of the project
   * @param {string} params.description - The description of the project
   * @param {string|null} params.link - Optional URL link for the project
   * @param {string} params.status - The status of the project
   * @param {string} params.userId - The ID of the user who owns the project
   * @param {TechStack[]} params.techStacks - Array of technology stacks used in the project
   * @returns {Result<Project>} Result containing either the created Project or an error
   */
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
