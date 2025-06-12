import { Project as DomainProject } from '@/domain/project/project.entity';
import { ProjectFactory } from '@/domain/project/factory/project.factory';
import { TechStackFactory } from '@/domain/techStack/techStack.factory';
import { Result } from '@/shared/result';
import {
  Project as PrismaProject,
  TechStack,
  Prisma,
  Difficulty,
  ProjectRole,
  teamMember,
} from '@prisma/client';
import { ProjectRoleFactory } from '@/domain/projectRole/projectRole.factory';
import TeamMemberFactory from '@/domain/teamMember/teamMember.factory';

type PrismaProjectWithIncludes = PrismaProject & {
  techStacks: TechStack[];
  projectMembers: teamMember[];
  projectRoles: (ProjectRole & { skillSet: TechStack[] })[];
};

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
          skillSet: {
            connect: role.getSkillSet().map((tech) => ({
              id: tech.getId(),
            })),
          },
          description: role.getDescription(),
          isFilled: role.getIsFilled(),
        })),
      },
      projectMembers: {
        create: project.getTeamMembers().map((member) => ({
          userId: member.getUserId(),
        })),
      },
    });
  }

  static toDomain(
    prismaProject: PrismaProjectWithIncludes,
  ): Result<DomainProject> {
    // Transformer les techStacks (relation existante)
    const techStacksResult = TechStackFactory.createMany(
      prismaProject.techStacks,
    );
    if (!techStacksResult.success) return Result.fail(techStacksResult.error);

    // Transformer les projectRoles
    const projectRolesResult =
      prismaProject.projectRoles.length > 0
        ? ProjectRoleFactory.fromPersistence(prismaProject.projectRoles)
        : Result.ok([]);
    if (!projectRolesResult.success)
      return Result.fail(projectRolesResult.error);

    // Transformer les teamMembers (en supposant qu'il existe un TeamMemberFactory)
    const teamMembersResult =
      prismaProject.projectMembers.length > 0
        ? TeamMemberFactory.fromPersistence(prismaProject.projectMembers)
        : Result.ok([]);
    if (!teamMembersResult.success) return Result.fail(teamMembersResult.error);

    // Créer l'entité de domaine avec toutes les relations
    return ProjectFactory.fromPersistence({
      id: prismaProject.id,
      title: prismaProject.title,
      description: prismaProject.description,
      link: prismaProject.link,
      ownerId: prismaProject.ownerId,
      techStacks: techStacksResult.value,
      difficulty: PrismaProjectMapper.fromPrismaDifficulty(
        prismaProject.difficulty,
      ),
      githubLink: prismaProject.github,
      createdAt: prismaProject.createAt,
      updatedAt: prismaProject.updatedAt,
      projectRoles: projectRolesResult.value,
      teamMembers: teamMembersResult.value,
    });
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
    }
  }
}
