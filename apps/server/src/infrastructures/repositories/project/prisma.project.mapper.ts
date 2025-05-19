import { Project as DomainProject } from '@/domain/project/project.entity';
import { ProjectFactory } from '@/domain/project/factory/project.factory';
import { TechStackFactory } from '@/domain/techStack/techStack.factory';
import { Result } from '@/shared/result';
import { Project as PrismaProject, TechStack, Prisma } from '@prisma/client';
type PrismaProjectWithIncludes = PrismaProject & {
  techStacks: TechStack[];
};

export class PrismaProjectMapper {
  static toRepo(project: DomainProject): Result<Prisma.ProjectCreateInput> {
    return Result.ok({
      title: project.getTitle(),
      description: project.getDescription(),
      link: project.getLink(),
      ownerId: project.getOwnerId(),
      techStacks: {
        connect: project.getTechStacks().map((techStack) => ({
          id: techStack.getId(),
        })),
      },
    });
  }

  static toDomain(
    prismaProject: PrismaProjectWithIncludes,
  ): Result<DomainProject> {
    const techStacks = TechStackFactory.createMany(prismaProject.techStacks);
    if (!techStacks.success) return Result.fail(techStacks.error);

    const projectResult: Result<DomainProject> = ProjectFactory.fromPersistence(
      {
        id: prismaProject.id,
        title: prismaProject.title,
        description: prismaProject.description,
        link: prismaProject.link,
        ownerId: prismaProject.ownerId,
        techStacks: techStacks.value,
        createdAt: prismaProject.createAt,
        updatedAt: prismaProject.updatedAt,
      },
    );
    if (!projectResult.success) return Result.fail(projectResult.error);

    return Result.ok(projectResult.value);
  }
}
