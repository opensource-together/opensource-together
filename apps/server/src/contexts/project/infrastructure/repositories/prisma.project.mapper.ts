import {
  Project as DomainProject,
  Project,
  ProjectData,
  ProjectValidationErrors,
} from '@/contexts/project/domain/project.entity';
import { Result } from '@/libs/result';
import {
  Category,
  KeyFeature,
  Prisma,
  Project as PrismaProject,
  ProjectExternalLink,
  ProjectGoal,
  ProjectRole,
  teamMember,
  TechStack,
} from '@prisma/client';

// Type temporaire en attendant la génération du client Prisma

type PrismaProjectWithIncludes = PrismaProject & {
  techStacks: TechStack[];
  projectMembers: teamMember[];
  projectRoles: (ProjectRole & { techStacks: TechStack[] })[];
  categories: Category[];
  keyFeatures: KeyFeature[];
  projectGoals: ProjectGoal[];
  externalLinks: ProjectExternalLink[];
  image?: string | null;
  readme?: string | null;
  ownerId: string;
  owner: {
    id: string;
    username: string;
    email: string;
    provider: string;
    login: string;
    avatarUrl: string | null;
    location: string | null;
    company: string | null;
    bio: string | null;
    jobTitle: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
};

export class PrismaProjectMapper {
  static toRepo(project: DomainProject): Result<Prisma.ProjectCreateInput> {
    const projectData = project.toPrimitive();
    const projectCreateInput: Prisma.ProjectCreateInput = {
      title: projectData.title,
      description: projectData.description,
      shortDescription: projectData.shortDescription,
      readme: projectData.readme,
      image: projectData.image,
      coverImages: projectData.coverImages || [],
      externalLinks: {
        create:
          projectData.externalLinks
            ?.filter((link) => link && link.url && link.type)
            ?.map((link) => ({
              type: link.type,
              url: link.url,
            })) || [],
      },
      owner: {
        connect: {
          id: projectData.ownerId,
        },
      },
      techStacks: {
        connect: projectData.techStacks.map((techStack) => ({
          id: techStack.id,
        })),
      },
      categories: {
        connect: projectData.categories.map((category) => ({
          id: category.id,
        })),
      },
      keyFeatures: {
        create: projectData.keyFeatures.map((keyFeature) => ({
          feature: keyFeature.feature,
        })),
      },
      projectGoals: {
        create: projectData.projectGoals.map((goal) => ({
          goal: goal.goal,
        })),
      },
      projectRoles: {
        create: projectData.projectRoles.map((role) => ({
          title: role.title,
          description: role.description,
          isFilled: role.isFilled,
          techStacks: {
            connect: role.techStacks.map((techStack) => ({
              id: techStack.id,
            })),
          },
        })),
      },
    };
    return Result.ok(projectCreateInput);
  }

  static toDomain(
    prismaProject: PrismaProjectWithIncludes,
  ): Result<Project, ProjectValidationErrors | string> {
    const projectData: ProjectData = {
      id: prismaProject.id,
      ownerId: prismaProject.ownerId,
      title: prismaProject.title,
      shortDescription: prismaProject.shortDescription,
      description: prismaProject.description,
      externalLinks: prismaProject.externalLinks.map((link) => ({
        type: link.type,
        url: link.url,
      })),
      createdAt: prismaProject.createdAt,
      updatedAt: prismaProject.updatedAt,
      coverImages: prismaProject.coverImages || [],
      readme: prismaProject.readme || undefined,
      techStacks: prismaProject.techStacks.map((techStack) => ({
        id: techStack.id,
        name: techStack.name,
        iconUrl: techStack.iconUrl,
        type: techStack.type,
      })),
      owner: {
        id: prismaProject.owner.id,
        username: prismaProject.owner.username,
        login: prismaProject.owner.login,
        avatarUrl: prismaProject.owner.avatarUrl || '',
        email: prismaProject.owner.email,
        provider: prismaProject.owner.provider,
        createdAt: prismaProject.owner.createdAt,
        updatedAt: prismaProject.owner.updatedAt,
      },
      categories: prismaProject.categories.map((c) => ({
        id: c.id,
        name: c.name,
      })),
      keyFeatures: prismaProject.keyFeatures.map((keyFeature) => ({
        id: keyFeature.id,
        projectId: prismaProject.id,
        feature: keyFeature.feature,
      })),
      projectGoals: prismaProject.projectGoals.map((goal) => ({
        id: goal.id,
        projectId: prismaProject.id,
        goal: goal.goal,
      })),
      projectRoles: prismaProject.projectRoles.map((role) => ({
        id: role.id,
        projectId: prismaProject.id,
        title: role.title,
        description: role.description,
        isFilled: role.isFilled,
        techStacks: role.techStacks.map((techStack) => ({
          id: techStack.id,
          name: techStack.name,
          iconUrl: techStack.iconUrl,
          type: techStack.type,
        })),
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
      })),
      image: prismaProject.image || undefined,
    };
    const project = Project.reconstitute(projectData);
    if (!project.success)
      return Result.fail(project.error as ProjectValidationErrors);
    return Result.ok(project.value);
  }

  //   public static toPrismaDifficulty(
  //     difficulty: 'easy' | 'medium' | 'hard',
  //   ): Difficulty {
  //     switch (difficulty) {
  //       case 'easy':
  //         return Difficulty.EASY;
  //       case 'medium':
  //         return Difficulty.MEDIUM;
  //       case 'hard':
  //         return Difficulty.HARD;
  //     }
  //   }

  //   public static fromPrismaDifficulty(
  //     difficulty: Difficulty,
  //   ): 'easy' | 'medium' | 'hard' {
  //     switch (difficulty) {
  //       case Difficulty.EASY:
  //         return 'easy';
  //       case Difficulty.MEDIUM:
  //         return 'medium';
  //       case Difficulty.HARD:
  //         return 'hard';
  //     }
  //   }
}
