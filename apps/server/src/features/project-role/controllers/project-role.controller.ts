import {
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProjectRoleService } from '../services/project-role.service';
import { Body } from '@nestjs/common';
import { Session, UserSession } from '@thallesp/nestjs-better-auth';
import { AuthGuard } from '@thallesp/nestjs-better-auth';
import { CreateProjectRoleRequestDto } from './dto/create-project-role.request.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateProjectRoleDto } from './dto/update-project-role.dto';

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

  @Patch(':roleId')
  @ApiOperation({ summary: 'Update a project role' })
  @ApiBody({
    type: UpdateProjectRoleDto,
    description:
      'Update a project role, tout les champs sont obligatoires, plus particulièrement pour les tech stacks',
  })
  @ApiResponse({
    status: 200,
    description: 'Project role updated successfully',
    example: {
      id: 'c3e87112-bf1e-47b3-b45b-b20a89c72c4c',
      projectId: 'be761cee-3f97-4400-be83-f6d18f981ce0',
      title: 'Go Developer',
      description:
        'Développeur backend responsable du développement des APIs et de la logique métier',
      isFilled: true,
      createdAt: '2025-09-05T16:20:43.597Z',
      updatedAt: '2025-09-06T09:49:06.596Z',
      techStacks: [
        {
          id: '2',
          name: 'Next.js',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
          type: 'TECH',
        },
        {
          id: '3',
          name: 'Angular',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angularjs/angularjs-original.svg',
          type: 'TECH',
        },
        {
          id: '4',
          name: 'Vue.js',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg',
          type: 'TECH',
        },
        {
          id: '7',
          name: 'Nest.js',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nestjs/nestjs-original.svg',
          type: 'TECH',
        },
      ],
    },
  })
  async updateProjectRole(
    @Param('roleId') roleId: string,
    @Body() projectRole: UpdateProjectRoleDto,
  ) {
    const result = await this.projectRoleService.updateProjectRole(
      roleId,
      projectRole,
    );
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }
    return result.value;
  }
}
