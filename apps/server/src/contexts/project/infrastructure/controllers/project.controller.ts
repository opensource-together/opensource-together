import { Project } from '@/contexts/project/domain/project.entity';
import { Result } from '@/libs/result';
import {
  Body,
  Controller,
  Get,
  Param,
  // Query,
  HttpException,
  HttpStatus,
  Post,
  Patch,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateProjectCommand } from '@/contexts/project/use-cases/commands/create/create-project.command';
import { DeleteProjectCommand } from '@/contexts/project/use-cases/commands/delete/delete-project.command';
import { UpdateProjectCommand } from '@/contexts/project/use-cases/commands/update/update-project.command';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Session, PublicAccess } from 'supertokens-nestjs';
import { GetProjectsQuery } from '@/contexts/project/use-cases/queries/get-all/get-projects.handler';
import { FindProjectByIdQuery } from '@/contexts/project/use-cases/queries/find-by-id/find-project-by-id.handler';
import { GitHubOctokit } from '@/contexts/github/infrastructure/decorators/github-octokit.decorator';
import { GithubAuthGuard } from '@/contexts/github/infrastructure/guards/github-auth.guard';
import { Octokit } from '@octokit/rest';
import { CreateProjectDtoRequest } from './dto/create-project-request.dto';
import { CreateProjectResponseDto } from './dto/create-project-response.dto';
import { GetProjectsResponseDto } from './dto/get-projects-response.dto';
import { GetProjectByIdResponseDto } from './dto/get-project-by-id-response.dto';
import { UpdateProjectDtoRequest } from './dto/update-project-request.dto';
import { UpdateProjectResponseDto } from './dto/update-project-response.dto';
import { ProjectRoleApplication } from '@/contexts/project-role-application/domain/project-role-application.entity';
import { GetAllProjectApplicationsQuery } from '@/contexts/project-role-application/use-cases/queries/get-all-project-application.query';

@Controller('projects')
export class ProjectController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  // Route publique pour récupérer tous les projets
  @PublicAccess()
  @Get()
  async getProjects() {
    const projects: Result<Project[]> = await this.queryBus.execute(
      new GetProjectsQuery(),
    );
    if (!projects.success) {
      throw new HttpException(projects.error, HttpStatus.BAD_REQUEST);
    }
    return GetProjectsResponseDto.toResponse(projects.value);
  }

  // Route publique pour récupérer un projet par son ID
  // @PublicAccess()
  @UseGuards(GithubAuthGuard)
  @Get(':id')
  async getProject(@Param('id') id: string, @GitHubOctokit() octokit: Octokit) {
    const projectRes: Result<
      {
        project: Project;
        projectStats: {
          forks_count: number;
          stargazers_count: number;
          watchers_count: number;
          open_issues_count: number;
          commits_count: number;
        };
      },
      string
    > = await this.queryBus.execute(
      new FindProjectByIdQuery({ id: id, octokit: octokit }),
    );
    if (!projectRes.success) {
      throw new HttpException(projectRes.error, HttpStatus.NOT_FOUND);
    }
    return GetProjectByIdResponseDto.toResponse({
      project: projectRes.value.project,
      projectStats: projectRes.value.projectStats,
    });
  }

  //   @Get('search')
  //   async getProjectsFiltered(
  //     @Query() filters: FilterProjectsDto,
  //   ): Promise<ProjectResponseDto[]> {
  //     // Construction de l'objet de filtres pour la Query interne
  //     const filterInputs = {
  //       title: filters.title,
  //       difficulty: filters.difficulty?.toLowerCase() as
  //         | 'easy'
  //         | 'medium'
  //         | 'hard',
  //       sortOrder: filters.sortOrder || 'desc',
  //       roles: filters.roles || [],
  //       techStacks: filters.techStacks || [],
  //     };

  //     const projectsFiltered: Result<Project[] | null> =
  //       await this.queryBus.execute(new FindProjectByFiltersQuery(filterInputs)); // TODO: Implement this query

  //     if (!projectsFiltered.success) {
  //       throw new HttpException(projectsFiltered.error, HttpStatus.BAD_REQUEST);
  //     }

  //     // Gestion du cas où aucun projet n'est trouvé
  //     if (!projectsFiltered.value) {
  //       return [];
  //     }

  //     return projectsFiltered.value.map((project: Project) =>
  //       toProjectResponseDto(project),
  //     );
  //   }

  // Route privée pour créer un projet (nécessite authentification GitHub)
  @Post()
  @UseGuards(GithubAuthGuard)
  async createProject(
    @Session('userId') ownerId: string,
    @Req() req: Request,
    @GitHubOctokit() octokit: Octokit,
    @Body() project: CreateProjectDtoRequest,
  ) {
    const projectRes: Result<Project> = await this.commandBus.execute(
      new CreateProjectCommand({
        ownerId: ownerId,
        title: project.title,
        description: project.description,
        shortDescription: project.shortDescription,
        externalLinks: project.externalLinks || [],
        techStacks: project.techStacks,
        projectRoles: project.projectRoles.map((role) => ({
          title: role.title,
          description: role.description,
          techStacks: role.techStacks,
        })),
        categories: project.categories,
        keyFeatures: project.keyFeatures.map((feature) => ({
          feature: feature,
        })),
        projectGoals: project.projectGoals.map((goal) => ({
          goal: goal,
        })),
        octokit: octokit,
      }),
    );
    if (!projectRes.success) {
      throw new HttpException(projectRes.error, HttpStatus.BAD_REQUEST);
    }
    return CreateProjectResponseDto.toResponse(projectRes.value);
  }

  // Route privée pour mettre à jour un projet
  @Patch(':id')
  @UseGuards(GithubAuthGuard)
  async updateProject(
    @Session('userId') ownerId: string,
    @Param('id') id: string,
    @Body() project: UpdateProjectDtoRequest,
  ) {
    const projectRes: Result<Project> = await this.commandBus.execute(
      new UpdateProjectCommand(id, ownerId, {
        title: project.title,
        description: project.description,
        shortDescription: project.shortDescription,
        externalLinks: project.externalLinks,
        techStacks: project.techStacks,
        categories: project.categories,
        keyFeatures: project.keyFeatures,
        projectGoals: project.projectGoals,
        projectRoles: project.projectRoles,
      }),
    );

    if (!projectRes.success) {
      if (projectRes.error === 'Project not found') {
        throw new HttpException(projectRes.error, HttpStatus.NOT_FOUND);
      }
      if (projectRes.error === 'You are not allowed to update this project') {
        throw new HttpException(projectRes.error, HttpStatus.FORBIDDEN);
      }
      throw new HttpException(projectRes.error, HttpStatus.BAD_REQUEST);
    }

    return UpdateProjectResponseDto.toResponse(projectRes.value);
  }

  // Route privée pour supprimer un projet
  @Delete(':id')
  @UseGuards(GithubAuthGuard)
  async deleteProject(
    @Session('userId') ownerId: string,
    @Param('id') id: string,
  ) {
    const result: Result<boolean> = await this.commandBus.execute(
      new DeleteProjectCommand(id, ownerId),
    );

    if (!result.success) {
      if (result.error === 'Project not found') {
        throw new HttpException(result.error, HttpStatus.NOT_FOUND);
      }
      if (result.error === 'You are not allowed to delete this project') {
        throw new HttpException(result.error, HttpStatus.FORBIDDEN);
      }
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return { message: 'Project deleted successfully' };
  }

  @Get(':projectId/applications')
  async getProjectApplications(
    @Session('userId') userId: string,
    @Param('projectId') projectId: string,
  ) {
    // const projectResult: Result<Project> = await this.queryBus.execute(
    //   new FindProjectByIdQuery({ id: projectId }),
    // );
    // if (!projectResult.success) {
    //   throw new HttpException(projectResult.error, HttpStatus.BAD_REQUEST);
    // }
    const applications: Result<ProjectRoleApplication[]> =
      await this.queryBus.execute(
        new GetAllProjectApplicationsQuery({ projectId, userId }),
      );
    if (!applications.success) {
      throw new HttpException(applications.error, HttpStatus.BAD_REQUEST);
    }
    return applications.value;
  }
}
