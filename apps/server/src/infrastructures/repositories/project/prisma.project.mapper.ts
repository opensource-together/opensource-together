import { Project as DomainProject } from '@/domain/project/project.entity';
import { ProjectFactory } from '@/domain/project/factory/project.factory';
import { TechStackFactory } from '@/domain/techStack/techStack.factory';
import { Result } from '@/shared/result';
import {
  Project as PrismaProject,
  TechStack,
  Prisma,
  Difficulty,
} from '@prisma/client';

type PrismaProjectWithIncludes = PrismaProject & {
  techStacks: TechStack[];
};

export interface ProjectRole {
  role: string;
  skill_set: string[];
  description: string;
}

export class PrismaProjectMapper {
  static toRepo(project: DomainProject): Result<Prisma.ProjectCreateInput> {
    return Result.ok({
      title: project.getTitle(),
      description: project.getDescription(),
      difficulty: PrismaProjectMapper.toPrismaDifficulty(
        project.getDifficulty(),
      ),
      link: project.getLink(),
      github: project.getGithubLink() || '',
      ownerId: project.getOwnerId(),
      techStacks: {
        connect: project.getTechStacks().map((techStack) => ({
          id: techStack.getId(),
        })),
      },
      projectRoles: {
        create: project.getProjectRoles().map((role) => ({
          roleTitle: role.getRoleTitle(),
          skillSet: role.getSkillSet().map((tech) => tech.getName()),
          description: role.getDescription(),
          isFilled: role.getIsFilled(),
        })),
      },
      teamMembers: {
        create: project.getTeamMembers().map((member) => ({
          user_id: member.getUserId(),
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
        difficulty: PrismaProjectMapper.fromPrismaDifficulty(
          prismaProject.difficulty,
        ),
        githubLink: prismaProject.github,
        createdAt: prismaProject.createAt,
        updatedAt: prismaProject.updatedAt,
        projectRoles: [],
        teamMembers: [],
      },
    );
    if (!projectResult.success) return Result.fail(projectResult.error);

    return Result.ok(projectResult.value);
  }

  public static toPrismaDifficulty(
    difficulty: 'easy' | 'medium' | 'hard',
  ): Difficulty {
    switch (difficulty) {
      case 'easy':
        return Difficulty.EASY;
      case 'medium':
        return Difficulty.MEDIUM;
      case 'hard':
        return Difficulty.HARD;
      default:
        throw new Error(`Invalid difficulty: ${difficulty}`);
    }
  }

  public static fromPrismaDifficulty(
    difficulty: Difficulty,
  ): 'easy' | 'medium' | 'hard' {
    switch (difficulty) {
      case Difficulty.EASY:
        return 'easy';
      case Difficulty.MEDIUM:
        return 'medium';
      case Difficulty.HARD:
        return 'hard';
      default:
        throw new Error(`Invalid difficulty: ${difficulty}`);
    }
  }
}
