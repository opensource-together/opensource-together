import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { CreateProjectCommand } from '@/infrastructures/cqrs/project/use-case-handlers/create-project.command';
import { CreateProjectDtoRequest } from '@/presentation/project/dto/CreateaProjectDtoRequest';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Session } from 'supertokens-nestjs';
import { Project } from '@/domain/project/project.entity';
import { findProjectByTitleQuery } from '@/infrastructures/cqrs/project/queries/find-project-by-title.query';
import { FindProjectByIdQuery } from '@/infrastructures/cqrs/project/queries/find-project-by-id.query';
import { GetProjectsQuery } from '@/infrastructures/cqrs/project/queries/get-projects.query';
import { toProjectResponseDto } from '@/application/dto/response/project-response.adapter';
@Controller('projects')
export class ProjectController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getProjects(): Promise<Project[]> {
    const projects = await this.queryBus.execute(new GetProjectsQuery());
    return projects.map((project: Project) => toProjectResponseDto(project));
  }

  @Get('search')
  async getProjectsFiltered(@Query('title') title: string): Promise<Project[]> {
    const projectsFiltered = await this.queryBus.execute(
      new findProjectByTitleQuery(title),
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
