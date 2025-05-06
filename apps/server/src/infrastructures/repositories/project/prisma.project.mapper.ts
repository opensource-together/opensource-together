import { Project as DomainProject } from '@/domain/project/project.entity';
import { ProjectFactory } from '@/domain/project/factory/project.factory';
import { TechStackFactory } from '@/domain/techStack/techStack.factory';
import { Result } from '@/shared/result';
import {
  Project as PrismaProject,
  ProjectStatus,
  TechStack,
  Prisma,
} from '@prisma/client';
type PrismaProjectWithIncludes = PrismaProject & {
  techStacks: TechStack[];
};

export class PrismaProjectMapper {
  static toRepo(project: DomainProject): Result<Prisma.ProjectCreateInput> {
    const status = PrismaProjectMapper.domainStatusToPrismaStatus(
      project.getStatus(),
    );
    if (!status.success) return Result.fail(status.error);

    return Result.ok({
      title: project.getTitle(),
      description: project.getDescription(),
      link: project.getLink(),
      status: status.value,
      userId: project.getUserId(),
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

    const domainStatus = PrismaProjectMapper.prismaStatusToDomainStatus(
      prismaProject.status,
    );
    if (!domainStatus.success) return Result.fail(domainStatus.error);

    const projectResult: Result<DomainProject> = ProjectFactory.fromPersistence(
      {
        id: prismaProject.id,
        title: prismaProject.title,
        description: prismaProject.description,
        link: prismaProject.link,
        status: domainStatus.value,
        userId: prismaProject.userId,
        techStacks: techStacks.value,
      },
    );
    if (!projectResult.success) return Result.fail(projectResult.error);

    return Result.ok(projectResult.value);
  }

  private static domainStatusToPrismaStatus(
    domainStatus: string | null,
  ): Result<ProjectStatus> {
    if (!domainStatus) return Result.fail('Project status is null');

    switch (domainStatus) {
      case 'PUBLISHED':
        return Result.ok(ProjectStatus.PUBLISHED);
      case 'ARCHIVED':
        return Result.ok(ProjectStatus.ARCHIVED);
      case 'DRAFT':
        return Result.ok(ProjectStatus.DRAFT);
      default:
        return Result.fail(`Invalid project status mapping: ${domainStatus}`);
    }
  }
  private static prismaStatusToDomainStatus(
    prismaStatus: ProjectStatus | null,
  ): Result<string> {
    if (!prismaStatus)
      return Result.fail('Project status is unexpectedly null in database.');
    switch (prismaStatus) {
      case ProjectStatus.PUBLISHED:
        return Result.ok('PUBLISHED');
      case ProjectStatus.ARCHIVED:
        return Result.ok('ARCHIVED');
      case ProjectStatus.DRAFT:
        return Result.ok('DRAFT');
      default:
        return Result.fail(`Invalid project status found in database.`);
    }
  }
}
