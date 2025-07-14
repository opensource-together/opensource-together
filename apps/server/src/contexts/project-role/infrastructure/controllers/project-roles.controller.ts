import { Body, Controller, Param, Post, Patch, Delete } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateProjectRoleCommand } from '@/contexts/project-role/use-cases/commands/create-project-role.command';
import { UpdateProjectRoleCommand } from '@/contexts/project-role/use-cases/commands/update-project-role.command';
import { DeleteProjectRoleCommand } from '@/contexts/project-role/use-cases/commands/delete-project-role.command';
import { Session } from 'supertokens-nestjs';
import { CreateProjectRoleDtoRequest } from './dto/create-project-role-request.dto';
import { UpdateProjectRoleDtoRequest } from './dto/update-project-role-request.dto';
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

  @Patch(':roleId')
  async updateProjectRole(
    @Session('userId') userId: string,
    @Param('projectId') projectId: string,
    @Param('roleId') roleId: string,
    @Body() body: UpdateProjectRoleDtoRequest,
  ) {
    const command = new UpdateProjectRoleCommand(roleId, projectId, userId, {
      title: body.title,
      description: body.description,
      techStacks: body.techStacks,
    });

    const result: Result<ProjectRole, string> =
      await this.commandBus.execute(command);

    if (!result.success) {
      if (result.error === 'Project role not found') {
        throw new HttpException(result.error, HttpStatus.NOT_FOUND);
      }
      if (result.error === 'Project not found') {
        throw new HttpException(result.error, HttpStatus.NOT_FOUND);
      }
      if (
        result.error === 'You are not allowed to update roles in this project'
      ) {
        throw new HttpException(result.error, HttpStatus.FORBIDDEN);
      }
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return result.value;
  }

  @Delete(':roleId')
  async deleteProjectRole(
    @Session('userId') userId: string,
    @Param('projectId') projectId: string,
    @Param('roleId') roleId: string,
  ) {
    const command = new DeleteProjectRoleCommand(roleId, projectId, userId);

    const result: Result<boolean, string> =
      await this.commandBus.execute(command);

    if (!result.success) {
      if (result.error === 'Project role not found') {
        throw new HttpException(result.error, HttpStatus.NOT_FOUND);
      }
      if (result.error === 'Project not found') {
        throw new HttpException(result.error, HttpStatus.NOT_FOUND);
      }
      if (
        result.error === 'You are not allowed to delete roles in this project'
      ) {
        throw new HttpException(result.error, HttpStatus.FORBIDDEN);
      }
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return { message: 'Project role deleted successfully' };
  }
}
