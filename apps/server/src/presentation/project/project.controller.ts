import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  HttpException,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { Project } from '@/domain/project/project.entity';
import { Result } from '@shared/result';
import { ProjectResponseDto } from '@/application/dto/adapters/project-response.dto';
import { toProjectResponseDto } from '@/application/dto/adapters/project-response.adapter';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Session } from 'supertokens-nestjs';
import { CreateProjectCommand } from '@/application/project/commands/create/create-project.command';
import { FindProjectByIdQuery } from '@/application/project/queries/find-by-id/find-project-by-id.handler';
import { FindProjectByFiltersQuery } from '@/application/project/queries/find-by-filters/find-project-by-filters.handler';
import { GetProjectsQuery } from '@/application/project/queries/get-all/get-projects.handler';
import { CreateProjectDtoRequest } from '@/presentation/project/dto/CreateaProjectDtoRequest';
import { UpdateProjectDtoRequest } from './dto/UpdateProjectDto.request';
import { UpdateProjectCommand } from '@/application/project/commands/update/update-project.usecase';
import { FilterProjectsDto } from '@/presentation/project/dto/SearchFilterProject.dto';
import { CreateGitHubRepositoryCommand } from '@/application/github/commands/create-github-repository.command';
@Controller('projects')
export class ProjectController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getProjects(): Promise<ProjectResponseDto[]> {
    const projects: Result<Project[]> = await this.queryBus.execute(
      new GetProjectsQuery(),
    );
    if (!projects.success) {
      throw new HttpException(projects.error, HttpStatus.BAD_REQUEST);
    }
    return projects.value.map((project: Project) =>
      toProjectResponseDto(project),
    );
  }

  @Get('search')
  async getProjectsFiltered(
    @Query() filters: FilterProjectsDto,
  ): Promise<ProjectResponseDto[]> {
    // Construction de l'objet de filtres pour la Query interne
    const filterInputs = {
      title: filters.title,
      difficulty: filters.difficulty?.toLowerCase() as
        | 'easy'
        | 'medium'
        | 'hard',
      sortOrder: filters.sortOrder || 'desc',
      roles: filters.roles || [],
      techStacks: filters.techStacks || [],
    };

    const projectsFiltered: Result<Project[] | null> =
      await this.queryBus.execute(new FindProjectByFiltersQuery(filterInputs));

    if (!projectsFiltered.success) {
      throw new HttpException(projectsFiltered.error, HttpStatus.BAD_REQUEST);
    }

    // Gestion du cas où aucun projet n'est trouvé
    if (!projectsFiltered.value) {
      return [];
    }

    return projectsFiltered.value.map((project: Project) =>
      toProjectResponseDto(project),
    );
  }

  @Get(':id')
  async getProject(@Param('id') id: string) {
    const projectRes: Result<Project> = await this.queryBus.execute(
      new FindProjectByIdQuery(id),
    );
    if (!projectRes.success) {
      throw new HttpException(projectRes.error, HttpStatus.NOT_FOUND);
    }
    return toProjectResponseDto(projectRes.value);
  }

  @Post()
  async createProject(
    @Session('userId') ownerId: string,
    @Body() project: CreateProjectDtoRequest,
  ) {
    // Convertir les DTOs en commandes
    const projectRolesCommands =
      project.projectRoles.map((role) => ({
        projectId: '', // Sera défini après la création du projet
        roleTitle: role.roleTitle,
        skillSet: role.skillSet,
        description: role.description,
        isFilled: role.isFilled,
      })) || [];

    const projectMembersCommands =
      project.projectMembers.map((member) => ({
        projectId: '',
        userId: member.userId,
      })) || [];

    const projectRes: Result<Project> = await this.commandBus.execute(
      new CreateProjectCommand(
        ownerId,
        project.title,
        project.description,
        project.difficulty,
        project.link,
        project.githubLink,
        project.techStacks,
        projectRolesCommands,
        projectMembersCommands,
      ),
    );
    if (!projectRes.success) {
      throw new HttpException(projectRes.error, HttpStatus.BAD_REQUEST);
    }
    return toProjectResponseDto(projectRes.value);
  }

  @Patch(':id')
  async updateProject(
    @Session('userId') ownerId: string,
    @Param('id') id: string,
    @Body() project: UpdateProjectDtoRequest,
  ) {
    const projectRes: Result<Project> = await this.commandBus.execute(
      new UpdateProjectCommand(
        id,
        project.title,
        project.description,
        project.link,
        project.projectRoles,
        project.techStacks,
        ownerId,
      ),
    );
    if (!projectRes.success) {
      throw new HttpException(projectRes.error, HttpStatus.BAD_REQUEST);
    }
    return toProjectResponseDto(projectRes.value);
  }
  //endpoint pour tester la création d'un repository GitHub
  @Post('github')
  async createGitHubRepository(
    @Session('userId') ownerId: string,
    @Body()
    project: { name: string; description?: string; isPrivate?: boolean },
  ) {
    const projectRes: Result<Project> = await this.commandBus.execute(
      new CreateGitHubRepositoryCommand(
        ownerId,
        project.name,
        project.description,
        project.isPrivate,
      ),
    );
    if (!projectRes.success) {
      throw new HttpException(projectRes.error, HttpStatus.BAD_REQUEST);
    }
    return projectRes.value;
  }
}
