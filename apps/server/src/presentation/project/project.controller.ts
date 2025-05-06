import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Project } from '@/domain/project/project.entity';
import { Result } from '@shared/result';
import { ProjectResponseDto } from '@/application/dto/adapters/project-response.dto';
import { toProjectResponseDto } from '@/application/dto/adapters/project-response.adapter';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Session } from 'supertokens-nestjs';
import { CreateProjectDtoInput } from '@/application/dto/create-project-inputs.dto';
import { CreateProjectCommand } from '@/infrastructures/cqrs/project/commands/create-project/create-project.command';
import { FindProjectByIdQuery } from '@/infrastructures/cqrs/project/queries/find-by-id/find-project-by-id.query';
import { FindProjectByTitleQuery } from '@/infrastructures/cqrs/project/queries/find-by-title/find-project-by-title.query';
import { GetProjectsQuery } from '@/infrastructures/cqrs/project/queries/get-all/get-projects.query';

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
    @Query('title') title: string,
  ): Promise<ProjectResponseDto[]> {
    const projectsFiltered: Result<Project[]> = await this.queryBus.execute(
      new FindProjectByTitleQuery(title),
    );
    if (!projectsFiltered.success) {
      throw new HttpException(projectsFiltered.error, HttpStatus.BAD_REQUEST);
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
    @Session('userId') userId: string,
    @Body() project: CreateProjectDtoInput,
  ) {
    const projectRes: Result<Project> = await this.commandBus.execute(
      new CreateProjectCommand(
        project.title,
        project.description,
        project.link,
        project.status,
        project.techStacks,
        userId,
      ),
    );
    if (!projectRes.success) {
      throw new HttpException(projectRes.error, HttpStatus.BAD_REQUEST);
    }
    console.log({ projectRes });
    return toProjectResponseDto(projectRes.value);
  }
}
