import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProjectRepositoryPort } from '@/contexts/project/use-cases/ports/project.repository.port';
import { Inject } from '@nestjs/common';
import { PROJECT_REPOSITORY_PORT } from '@/contexts/project/use-cases/ports/project.repository.port';
import { Result } from '@/libs/result';
import { IQuery } from '@nestjs/cqrs';
import { ProjectWithDetails } from '@/contexts/project/infrastructure/repositories/prisma.project.mapper';

// Type optimisé pour les informations essentielles des team members
export type TeamMemberEssentialInfo = {
  id: string;
  userId: string;
  joinedAt: Date;
  user: {
    id: string;
    username: string;
    avatarUrl: string | null;
    jobTitle: string | null;
    company: string | null;
    location: string | null;
    techStacks: Array<{
      id: string;
      name: string;
      iconUrl: string;
      type: 'LANGUAGE' | 'TECH';
    }>;
  };
  projectRole: Array<{
    id: string;
    title: string;
    description: string;
    techStacks: Array<{
      id: string;
      name: string;
      iconUrl: string;
      type: 'LANGUAGE' | 'TECH';
    }>;
  }>;
};

export type ProjectWithEssentialTeamMembers = {
  project: ProjectWithDetails['project'];
  projectRoleApplication: ProjectWithDetails['projectRoleApplication'];
  projectMembers: TeamMemberEssentialInfo[];
};

export class FindUserProjectsWithDetailsQuery implements IQuery {
  constructor(public readonly userId: string) {}
}

@QueryHandler(FindUserProjectsWithDetailsQuery)
export class FindUserProjectsWithDetailsHandler
  implements IQueryHandler<FindUserProjectsWithDetailsQuery>
{
  constructor(
    @Inject(PROJECT_REPOSITORY_PORT)
    private readonly projectRepo: ProjectRepositoryPort,
  ) {}

  async execute(
    query: FindUserProjectsWithDetailsQuery,
  ): Promise<Result<ProjectWithEssentialTeamMembers[], string>> {
    const result: Result<ProjectWithDetails[], string> =
      await this.projectRepo.findUserProjectsWithDetails(query.userId);

    if (!result.success) {
      return Result.fail(result.error);
    }

    // Transformer les données pour inclure les informations essentielles des team members
    const projectsWithEssentialTeamMembers: ProjectWithEssentialTeamMembers[] =
      result.value.map((projectWithDetails) => {
        const essentialTeamMembers: TeamMemberEssentialInfo[] =
          projectWithDetails.projectMembers
            .filter((member) => member.user) // Filtrer les membres sans utilisateur
            .map((member) => ({
              id: member.id,
              userId: member.userId,
              joinedAt: new Date(member.joinedAt),
              user: {
                id: member.user.id,
                username: member.user.username,
                avatarUrl: member.user.avatarUrl,
                jobTitle: member.user.jobTitle,
                company: member.user.company,
                location: member.user.location,
                techStacks: member.user.techStacks.map((techStack) => ({
                  id: techStack.id,
                  name: techStack.name,
                  iconUrl: techStack.iconUrl,
                  type: techStack.type,
                })),
              },
              projectRole: member.projectRole.map((role) => ({
                id: role.id,
                title: role.title,
                description: role.description,
                techStacks: role.techStacks.map((techStack) => ({
                  id: techStack.id,
                  name: techStack.name,
                  iconUrl: techStack.iconUrl,
                  type: techStack.type,
                })),
              })),
            }));

        return {
          project: projectWithDetails.project,
          projectRoleApplication: projectWithDetails.projectRoleApplication,
          projectMembers: essentialTeamMembers,
        };
      });

    return Result.ok(projectsWithEssentialTeamMembers);
  }
}
