import { Project } from '@/domain/project/project.entity';
import { Result } from '@/shared/result';
import {
  PROJECT_REPOSITORY_PORT,
  ProjectRepositoryPort,
} from '@/application/project/ports/project.repository.port';
import { ProjectFactory } from '@/domain/project/factory/project.factory';
import { TechStackFactory } from '@/domain/techStack/techStack.factory';
import { CommandHandler, ICommand } from '@nestjs/cqrs';
import { TechStackDto } from '@/presentation/project/dto/TechStackDto.request';
import { Inject } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { ProjectRoleFactory } from '@/domain/projectRole/projectRole.factory';
import TeamMemberFactory from '@/domain/teamMember/teamMember.factory';
import { CreateProjectRoleDto } from '@/presentation/project/dto/ProjectRoleDto.request';
import { TeamMemberDto } from '@/presentation/project/dto/TeamMemberDto.request';

export class CreateProjectCommand implements ICommand {
  constructor(
    public readonly ownerId: string,
    public readonly title: string,
    public readonly description: string,
    public readonly difficulty: 'easy' | 'medium' | 'hard',
    public readonly link: string | null,
    public readonly githubLink: string,
    public readonly techStacks: TechStackDto[],
    public readonly projectRoles: CreateProjectRoleDto[],
    public readonly projectMembers: TeamMemberDto[],
  ) {}
}

@CommandHandler(CreateProjectCommand)
export class CreateProjectCommandHandler
  implements ICommandHandler<CreateProjectCommand>
{
  constructor(
    @Inject(PROJECT_REPOSITORY_PORT)
    private readonly projectRepo: ProjectRepositoryPort,
  ) {}

  async execute(
    createProjectCommand: CreateProjectCommand,
  ): Promise<Result<Project>> {
    const techStacks = TechStackFactory.createMany(
      createProjectCommand.techStacks,
    );
    if (!techStacks.success) {
      return Result.fail(techStacks.error);
    }

    const projectRoles = ProjectRoleFactory.createMany(
      createProjectCommand.projectRoles,
    );
    if (!projectRoles.success) {
      return Result.fail(projectRoles.error);
    }

    const projectMembers = TeamMemberFactory.createMany(
      createProjectCommand.projectMembers,
    );
    if (!projectMembers.success) {
      return Result.fail(projectMembers.error);
    }

    const project = ProjectFactory.create({
      ...createProjectCommand,
      techStacks: techStacks.value,
      projectRoles: projectRoles.value,
      teamMembers: projectMembers.value,
    });
    if (!project.success) {
      return Result.fail(project.error);
    }
    const savedProject = await this.projectRepo.save(project.value);
    if (!savedProject.success) {
      return Result.fail(savedProject.error);
    }

    return Result.ok(savedProject.value);
  }
}
