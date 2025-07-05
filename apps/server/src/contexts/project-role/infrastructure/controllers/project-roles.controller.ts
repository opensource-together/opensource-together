import { Body, Controller, Param, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateProjectRoleCommand } from '@/contexts/project-role/use-cases/commands/create-project-role.command';
import { Session } from 'supertokens-nestjs';
import { CreateProjectRoleDtoRequest } from './dto/create-project-role-request.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Result } from '@/libs/result';
import { ProjectRole } from '@/contexts/project-role/domain/project-role.entity';

@Controller('projects/:projectId/roles')
export class ProjectRolesController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async createProjectRole(
    @Session('userId') userId: string,
    @Param('projectId') projectId: string,
    @Body() body: CreateProjectRoleDtoRequest,
  ) {
    console.log('body', body);
    console.log('projectId', projectId);
    const { title, description, techStacks } = body;
    const command = new CreateProjectRoleCommand({
      projectId,
      userId,
      title,
      description,
      techStacks,
      isFilled: false,
    });
    const result: Result<ProjectRole, string> =
      await this.commandBus.execute(command);
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }
    return result.value;
  }
}
