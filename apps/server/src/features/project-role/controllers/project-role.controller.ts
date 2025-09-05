import {
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProjectRoleService } from '../services/project-role.service';
import { Body } from '@nestjs/common';
import { Session, UserSession } from '@thallesp/nestjs-better-auth';
import { AuthGuard } from '@thallesp/nestjs-better-auth';
import { CreateProjectRoleRequestDto } from './dto/create-project-role.request.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@Controller('projects/:projectId/roles')
export class ProjectRoleController {
  constructor(private readonly projectRoleService: ProjectRoleService) {}

  @ApiOperation({ summary: 'Create a project role' })
  @ApiBody({
    type: CreateProjectRoleRequestDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Project role created successfully',
    example: [
      {
        id: 'c3e87112-bf1e-47b3-b45b-b20a89c72c4c',
        projectId: 'be761cee-3f97-4400-be83-f6d18f981ce0',
        title: 'Devops',
        description: 'Devops pro',
        isFilled: false,
        createdAt: '2025-09-05T16:20:43.597Z',
        updatedAt: '2025-09-05T16:20:43.597Z',
      },
    ],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    example: {
      error: 'Bad request',
    },
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Post()
  async createProjectRole(
    @Session() session: UserSession,
    @Param('projectId') projectId: string,
    @Body() projectRoles: CreateProjectRoleRequestDto,
  ) {
    const roles = projectRoles.projectRoles;
    const result = await this.projectRoleService.createProjectRole(
      projectId,
      roles,
    );
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }
    return result.value;
  }
}
