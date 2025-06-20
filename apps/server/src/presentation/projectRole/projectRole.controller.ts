import {
  Controller,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
  Patch,
  Delete,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Session } from 'supertokens-nestjs';
import { Result } from '@/shared/result';
import { ProjectRole } from '@/domain/projectRole/projectRole.entity';
import { CreateProjectRoleCommand } from '@/application/projectRole/commands/create/create-project-role.command';
import { DeleteProjectRoleCommand } from '@/application/projectRole/commands/delete/delete-project-role.command';
import { UpdateProjectRoleCommand } from '@/application/projectRole/commands/update/update-project-role.command';
import { CreateProjectRoleDto } from './dto/CreateProjectRoleDto.request';
import { UpdateProjectRoleDto } from './dto/UpdateProjectRoleDto.request';
import { toProjectRoleResponseDto } from '@/application/dto/adapters/project-role-response.adapter';

@Controller('projects/:projectId/roles')
export class ProjectRoleController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async createProjectRole(
    @Session('userId') ownerId: string,
    @Param('projectId') projectId: string,
    @Body() roleData: CreateProjectRoleDto,
  ) {
    const result: Result<ProjectRole> = await this.commandBus.execute(
      new CreateProjectRoleCommand(
        projectId,
        ownerId,
        roleData.roleTitle,
        roleData.description,
        roleData.isFilled,
        roleData.skillSet,
      ),
    );

    if (!result.success) {
      if (result.error === 'Project not found') {
        throw new HttpException(result.error, HttpStatus.NOT_FOUND);
      }
      if (result.error === 'You are not allowed to add roles to this project') {
        throw new HttpException(result.error, HttpStatus.FORBIDDEN);
      }
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return {
      message: 'Project role created successfully',
      role: toProjectRoleResponseDto(result.value),
    };
  }

  @Patch(':roleId')
  async updateProjectRole(
    @Session('userId') ownerId: string,
    @Param('projectId') projectId: string,
    @Param('roleId') roleId: string,
    @Body() roleData: UpdateProjectRoleDto,
  ) {
    const result = await this.commandBus.execute(
      new UpdateProjectRoleCommand(projectId, roleId, ownerId, {
        roleTitle: roleData.roleTitle,
        description: roleData.description,
        isFilled: roleData.isFilled,
        skillSet: roleData.skillSet,
      }),
    );

    if (!result.success) {
      if (
        result.error === 'Project not found' ||
        result.error === 'Role not found in this project'
      ) {
        throw new HttpException(result.error, HttpStatus.NOT_FOUND);
      }
      if (result.error === 'You are not allowed to update this project role') {
        throw new HttpException(result.error, HttpStatus.FORBIDDEN);
      }
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return {
      message: 'Project role updated successfully',
      role: toProjectRoleResponseDto(result.value),
    };
  }

  @Delete(':roleId')
  async deleteProjectRole(
    @Session('userId') ownerId: string,
    @Param('projectId') projectId: string,
    @Param('roleId') roleId: string,
  ) {
    const result = await this.commandBus.execute(
      new DeleteProjectRoleCommand(projectId, roleId, ownerId),
    );

    if (!result.success) {
      if (
        result.error === 'Project not found' ||
        result.error === 'Role not found in this project'
      ) {
        throw new HttpException(result.error, HttpStatus.NOT_FOUND);
      }
      if (
        result.error === 'You are not allowed to delete roles from this project'
      ) {
        throw new HttpException(result.error, HttpStatus.FORBIDDEN);
      }
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return {
      message: 'Project role deleted successfully',
    };
  }
}
