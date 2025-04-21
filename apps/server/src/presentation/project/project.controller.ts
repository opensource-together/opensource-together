import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { CreateProjectCommand } from '@/infrastructures/cqrs/project/use-case-handlers/create-project.command';
import { CreateProjectDtoRequest } from '@/presentation/project/dto/CreateaProjectDtoRequest';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Session } from 'supertokens-nestjs';
import { Project } from '@/domain/project/project.entity';
import { findTitleQuery } from '@/infrastructures/cqrs/project/queries/find-title.query';
@Controller('projects')
export class ProjectController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getProjects(@Query('title') title: string): Promise<Project> {
    console.log('Title rechercher : ', title);
    return await this.queryBus.execute(new findTitleQuery(title));
  }

  // @Get(':id')
  // async getProject(@Param('id') id: string) {
  //   return await this.queryBus.execute(new GetProjectQuery(id));
  // }

  @Post()
  async createProject(
    @Session('userId') userId: string,
    @Body() project: CreateProjectDtoRequest,
  ) {
    console.log('Post request received !!!');
    return await this.commandBus.execute(
      new CreateProjectCommand(
        project.title,
        project.description,
        project.link,
        project.status,
        project.techStacks,
        userId,
      ),
    );
  }
}
