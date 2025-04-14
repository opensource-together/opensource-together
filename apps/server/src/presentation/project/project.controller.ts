import { Controller, Post, Body } from '@nestjs/common';
import { CreateProjectCommand } from '@/infrastructures/cqrs/project/use-case-handlers/create-project.command';
import { CreateProjectDtoRequest } from '@/presentation/project/dto/CreateaProjectDtoRequest';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Session } from 'supertokens-nestjs';
@Controller('projects')
export class ProjectController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async createProject(
    @Session('userId') userId: string,
    @Body() project: CreateProjectDtoRequest,
  ) {
    console.log('Post request received !!!!!');
    return await this.commandBus.execute(
      new CreateProjectCommand(
        'test',
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
