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
import { CreateProjectCommand } from '@/application/project/commands/create/create-project.usecase';
import { FindProjectByIdQuery } from '@/application/project/queries/find-by-id/find-project-by-id.handler';
import { FindProjectByTitleQuery } from '@/application/project/queries/find-by-title/find-project-by-title.handler';
import { GetProjectsQuery } from '@/application/project/queries/get-all/get-projects.handler';
import { CreateProjectDtoRequest } from '@/presentation/project/dto/CreateaProjectDtoRequest';
import { UpdateProjectDtoRequest } from './dto/UpdateProjectDto.request';
import { UpdateProjectCommand } from '@/application/project/commands/update/update-project.usecase';
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
    @Session('userId') ownerId: string,
    @Body() project: CreateProjectDtoRequest,
  ) {
    const projectRes: Result<Project> = await this.commandBus.execute(
      new CreateProjectCommand(
        project.title,
        project.description,
        project.link,
        project.techStacks,
        ownerId,
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
        project.techStacks,
        ownerId,
      ),
    );
    if (!projectRes.success) {
      throw new HttpException(projectRes.error, HttpStatus.BAD_REQUEST);
    }
    return toProjectResponseDto(projectRes.value);
  }
}
