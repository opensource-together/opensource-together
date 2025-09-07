import {
  Controller,
  Get,
  Delete,
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

  @Get()
  @ApiOperation({ summary: 'Get all project roles' })
  @ApiResponse({
    status: 200,
    description: 'Project roles retrieved successfully',
    example: [
      {
        id: 'b0f82f52-a673-4615-bd7b-23615c5b7860',
        projectId: 'be761cee-3f97-4400-be83-f6d18f981ce0',
        title: 'Frontend Developer',
        description: 'Développeur React expérimenté',
        isFilled: false,
        techStacks: [
          {
            id: '2',
            name: 'Next.js',
            iconUrl:
              'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
            type: 'TECH',
          },
        ],
      },
      {
        id: 'aa10d1b5-1e02-439f-ae28-bf2f620c3b61',
        projectId: 'be761cee-3f97-4400-be83-f6d18f981ce0',
        title: 'Frontend Developer',
        description: 'Développeur React junior',
        isFilled: false,
        techStacks: [
          {
            id: '2',
            name: 'Next.js',
            iconUrl:
              'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
            type: 'TECH',
          },
        ],
      },
      {
        id: 'd35e9ffa-cddb-412d-9c8b-51c0949e348d',
        projectId: 'be761cee-3f97-4400-be83-f6d18f981ce0',
        title: 'Backend Developer',
        description: 'Développeur php junior',
        isFilled: false,
        techStacks: [
          {
            id: '2',
            name: 'Next.js',
            iconUrl:
              'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
            type: 'TECH',
          },
        ],
      },
      {
        id: 'c3e87112-bf1e-47b3-b45b-b20a89c72c4c',
        projectId: 'be761cee-3f97-4400-be83-f6d18f981ce0',
        title: 'front Developer',
        description:
          'Développeur front responsable du développement des composant et de la connexion au back',
        isFilled: false,
        techStacks: [
          {
            id: '4',
            name: 'Vue.js',
            iconUrl:
              'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg',
            type: 'TECH',
          },
        ],
      },
      {
        id: 'a89c7574-35a1-4bbd-82fd-d801123384a5',
        projectId: 'be761cee-3f97-4400-be83-f6d18f981ce0',
        title: 'Devops',
        description: 'Devops pro',
        isFilled: false,
        techStacks: [
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
      {
        id: '9b7ea925-c401-4005-959a-edf43f665b2e',
        projectId: 'be761cee-3f97-4400-be83-f6d18f981ce0',
        title: 'Devops',
        description: 'Devops pro',
        isFilled: false,
        techStacks: [
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
    ],
  })
  async getAllProjectRoles(@Param('projectId') projectId: string) {
    const result = await this.projectRoleService.getAllProjectRoles(projectId);
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }
    return result.value;
  }

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
    const userId = session.user.id;
    const roles = projectRoles.projectRoles;
    const result = await this.projectRoleService.createProjectRole({
      userId,
      projectId,
      projectRole: roles,
    });
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
    @Session() session: UserSession,
    @Param('roleId') roleId: string,
    @Param('projectId') projectId: string,
    @Body() projectRole: UpdateProjectRoleDto,
  ) {
    const userId = session.user.id;
    const result = await this.projectRoleService.updateProjectRole({
      roleId,
      userId,
      projectId,
      projectRole,
    });
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }
    return result.value;
  }

  @ApiOperation({ summary: 'Get a project role' })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    example: {
      error: 'Bad request',
    },
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({
    status: 200,
    description: 'Project role retrieved successfully',
    example: {
      id: 'c3e87112-bf1e-47b3-b45b-b20a89c72c4c',
      projectId: 'be761cee-3f97-4400-be83-f6d18f981ce0',
      title: 'front Developer',
      description:
        'Développeur front responsable du développement des composant et de la connexion au back',
      isFilled: false,
      createdAt: '2025-09-05T16:20:43.597Z',
      updatedAt: '2025-09-06T09:58:30.015Z',
      techStacks: [
        {
          id: '4',
          name: 'Vue.js',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg',
          type: 'TECH',
        },
      ],
    },
  })
  @Get(':roleId')
  async getProjectRole(@Param('roleId') roleId: string) {
    const result = await this.projectRoleService.getProjectRole(roleId);
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }
    return result.value;
  }

  @ApiOperation({ summary: 'Delete a project role' })
  @ApiResponse({
    status: 200,
    description: 'Project role deleted successfully',
    example: { message: 'Project role deleted successfully' },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    example: {
      error: 'Bad request',
    },
  })
  @Delete(':roleId')
  async deleteProjectRole(
    @Session() session: UserSession,
    @Param('roleId') roleId: string,
    @Param('projectId') projectId: string,
  ) {
    const userId = session.user.id;
    const result = await this.projectRoleService.deleteProjectRole({
      roleId,
      userId,
      projectId,
    });
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }
    return result.value;
  }
}
