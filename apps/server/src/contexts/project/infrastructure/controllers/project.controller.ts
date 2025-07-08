import {
  Controller,
  Post,
  Body,
  // Get,
  // Param,
  // Query,
  HttpException,
  HttpStatus,
  // Patch,
  // Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Project } from '@/contexts/project/domain/project.entity';
import { Result } from '@/libs/result';
// import { ProjectResponseDto } from '@/application/dto/adapters/project-response.dto';
// import { toProjectResponseDto } from '@/application/dto/adapters/project-response.adapter';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Session } from 'supertokens-nestjs';
import { CreateProjectCommand } from '@/contexts/project/use-cases/commands/create/create-project.command';
// import { FindProjectByIdQuery } from '@/contexts/project/use-cases/queries/find-by-id/find-project-by-id.handler';
// import { FindProjectByFiltersQuery } from '@/contexts/project/use-cases/queries/find-by-filters/find-project-by-filters.handler';
// import { GetProjectsQuery } from '@/contexts/project/use-cases/queries/get-all/get-projects.handler';
// import { CreateProjectDtoRequest } from './dto/CreateaProjectDtoRequest';
// import { UpdateProjectDtoRequest } from './dto/UpdateProjectDto.request';
// import { UpdateProjectCommand } from '@/contexts/project/use-cases/commands/update/update-project.usecase';
// import { DeleteProjectCommand } from '@/contexts/project/use-cases/commands/delete/delete-project.command';
// import { FilterProjectsDto } from './dto/SearchFilterProject.dto';
import { Octokit } from '@octokit/rest';
import { GitHubOctokit } from '@/contexts/github/infrastructure/decorators/github-octokit.decorator';
import { GithubAuthGuard } from '@/contexts/github/infrastructure/guards/github-auth.guard';
import { CreateProjectDtoRequest } from './dto/create-project-request.dto';
import { CreateProjectResponseDto } from './dto/create-project-response.dto';
// import { CreateGitHubRepositoryCommand } from '@/contexts/github/use-cases/commands/create-github-repository.command';
@UseGuards(GithubAuthGuard)
@Controller('projects')
export class ProjectController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  //   @Get()
  //   async getProjects(): Promise<ProjectResponseDto[]> {
  //     const projects: Result<Project[]> = await this.queryBus.execute(
  //       new GetProjectsQuery(),
  //     );
  //     if (!projects.success) {
  //       throw new HttpException(projects.error, HttpStatus.BAD_REQUEST);
  //     }
  //     return projects.value.map((project: Project) => toProjectResponseDto(project));
  //   }

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

  //   @Get(':id')
  //   async getProject(@Param('id') id: string) {
  //     const projectRes: Result<Project> = await this.queryBus.execute(
  //       new FindProjectByIdQuery(id),
  //     );
  //     if (!projectRes.success) {
  //       throw new HttpException(projectRes.error, HttpStatus.NOT_FOUND);
  //     }
  //     return toProjectResponseDto(projectRes.value);
  //   }

  @Post()
  async createProject(
    @Session('userId') ownerId: string,
    @Req() req: Request,
    @GitHubOctokit() octokit: Octokit,
    @Body() project: CreateProjectDtoRequest,
  ) {
    console.log('project', project);
    const projectRes: Result<Project> = await this.commandBus.execute(
      new CreateProjectCommand({
        ownerId: ownerId,
        title: project.title,
        description: project.description,
        shortDescription: project.shortDescription,
        // externalLinks:
        //   project.externalLinks?.map((link) => ({
        //     type: 'github',
        //     url: link,
        //   })) || [],
        techStacks: project.techStacks,
        projectRoles: project.projectRoles.map((role) => ({
          title: role.title,
          description: role.description,
          techStacks: role.techStacks,
        })),
        categories: project.categories,
        octokit: octokit,
      }),
    );
    console.log('projectRes', projectRes);
    if (!projectRes.success) {
      throw new HttpException(projectRes.error, HttpStatus.BAD_REQUEST);
    }
    return CreateProjectResponseDto.toResponse(projectRes.value);
  }

  //   @Patch(':id') async updateProject(
  //     @Session('userId') ownerId: string,
  //     @Param('id') id: string,
  //     @Body() project: UpdateProjectDtoRequest,
  //   ) {
  //     const projectRes: Result<Project> = await this.commandBus.execute(
  //       new UpdateProjectCommand(
  //         id,
  //         project.title,
  //         project.description,
  //         project.link,
  //         project.projectRoles,
  //         project.techStacks,
  //         ownerId,
  //       ),
  //     );
  //     if (!projectRes.success) {
  //       throw new HttpException(projectRes.error, HttpStatus.BAD_REQUEST);
  //     }
  //     return toProjectResponseDto(projectRes.value);
  //   }

  //   @Delete(':id')
  //   async deleteProject(
  //     @Session('userId') ownerId: string,
  //     @Param('id') id: string,
  //   ) {
  //     const result: Result<boolean> = await this.commandBus.execute(
  //       new DeleteProjectCommand(id, ownerId),
  //     );

  //     if (!result.success) {
  //       if (result.error === 'Project not found') {
  //         throw new HttpException(result.error, HttpStatus.NOT_FOUND);
  //       }
  //       if (result.error === 'You are not allowed to delete this project') {
  //         throw new HttpException(result.error, HttpStatus.FORBIDDEN);
  //       }
  //       throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
  //     }

  //     return { message: 'Project deleted successfully' };
  //   }

  //   //endpoint pour tester la création d'un repository GitHub
  //   @Post('github')
  //   async createGitHubRepository(
  //     @Session('userId') ownerId: string,
  //     @Body()
  //     project: { name: string; description?: string; isPrivate?: boolean },
  //   ) {
  //     const projectRes: Result<Project> = await this.commandBus.execute(
  //       new CreateGitHubRepositoryCommand(
  //         ownerId,
  //         project.name,
  //         project.description,
  //         project.isPrivate,
  //       ),
  //     );
  //     if (!projectRes.success) {
  //       throw new HttpException(projectRes.error, HttpStatus.BAD_REQUEST);
  //     }
  //     return projectRes.value;
  //   }
}
