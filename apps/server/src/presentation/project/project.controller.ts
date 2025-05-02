import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { CreateProjectCommand } from '@/infrastructures/cqrs/project/commands/create-project/create-project.command';
import { CreateProjectDtoRequest } from '@/presentation/project/dto/CreateaProjectDtoRequest';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Session } from 'supertokens-nestjs';
import { Project } from '@/domain/project/project.entity';
import { toProjectResponseDto } from '@/application/dto/adapters/project-response.adapter';
import { GetProjectsQuery } from '@/infrastructures/cqrs/project/queries/get-all/get-projects.query';
import { FindProjectByTitleQuery } from '@/infrastructures/cqrs/project/queries/find-by-title/find-project-by-title.query';
import { FindProjectByIdQuery } from '@/infrastructures/cqrs/project/queries/find-by-id/find-project-by-id.query';
@Controller('projects')
export class ProjectController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getProjects(): Promise<Project[]> {
    console.log('Get all projects');
    const projects = await this.queryBus.execute(new GetProjectsQuery());
    return projects.map((project: Project) => toProjectResponseDto(project));
  }

  @Get('search')
  async getProjectsFiltered(@Query('title') title: string): Promise<Project[]> {
    const projectsFiltered = await this.queryBus.execute(
      new FindProjectByTitleQuery(title),
    );
    return projectsFiltered.map((project: Project) =>
      toProjectResponseDto(project),
    );
  }

  @Get(':id')
  async getProject(@Param('id') id: string) {
    const projectRes = await this.queryBus.execute(
      new FindProjectByIdQuery(id),
    );
    return { success: true, value: toProjectResponseDto(projectRes.value) };
  }

  @Post()
  async createProject(
    @Session('userId') userId: string,
    @Body() project: CreateProjectDtoRequest,
  ) {
    const projectRes = await this.commandBus.execute(
      new CreateProjectCommand(
        project.title,
        project.description,
        project.link,
        project.status,
        project.techStacks,
        userId,
      ),
    );
    return { success: true, value: toProjectResponseDto(projectRes.value) };
  }
}
