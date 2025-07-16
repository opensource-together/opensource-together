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
import { ApplyToProjectRoleCommand } from '@/contexts/project-role-application/use-cases/commands/apply-to-project-role.command';
import { ProjectRoleApplication } from '@/contexts/project-role-application/domain/project-role-application.entity';
import { ApplyToRoleRequestDto } from './dto/apply-to-role-request.dto';
import {
  ApiTags,
  ApiOperation,
  ApiCookieAuth,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Project Roles')
@Controller('projects/:projectId/roles')
export class ProjectRolesController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @ApiOperation({ summary: 'Ajouter un rôle à un projet existant' })
  @ApiCookieAuth('sAccessToken')
  @ApiParam({
    name: 'projectId',
    description: 'ID du projet',
    example: '5f4cbe9b-1305-43a2-95ca-23d7be707717',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title', 'description', 'techStacks'],
      properties: {
        title: {
          type: 'string',
          description: 'Titre du rôle',
          example: 'Développeur Mobile',
          minLength: 1,
          maxLength: 100,
        },
        description: {
          type: 'string',
          description: 'Description détaillée du rôle',
          example: "Développement de l'application mobile avec React Native",
          minLength: 1,
          maxLength: 500,
        },
        techStacks: {
          type: 'array',
          description: 'Liste des IDs des tech stacks requises pour ce rôle',
          items: { type: 'string' },
          example: ['4', '5'],
          minItems: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Rôle créé avec succès',
    example: {
      id: '987fcdeb-51a2-4c3d-8f9e-1234567890ab',
      projectId: '5f4cbe9b-1305-43a2-95ca-23d7be707717',
      title: 'Développeur Mobile',
      description: "Développement de l'application mobile avec React Native",
      isFilled: false,
      techStacks: [
        {
          id: '4',
          name: 'React Native',
          iconUrl: 'https://reactnative.dev/img/header_logo.svg',
        },
      ],
      createdAt: '2025-07-05T15:30:00.000Z',
      updatedAt: '2025-07-05T15:30:00.000Z',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Erreur de validation',
    example: {
      error: 'Project not found',
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
    example: {
      message: 'unauthorised',
      statusCode: 401,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Projet non trouvé',
    example: {
      message: 'Project not found',
      statusCode: 404,
    },
  })
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
  @ApiOperation({ summary: 'Mettre à jour un rôle de projet existant' })
  @ApiCookieAuth('sAccessToken')
  @ApiParam({
    name: 'projectId',
    description: 'ID du projet',
    example: '3c2ee6b8-559e-42be-beb9-1807984270f3',
  })
  @ApiParam({
    name: 'roleId',
    description: 'ID du rôle à mettre à jour',
    example: '6c65cc5b-cfe5-4f48-86f7-6efffd6d3916',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Nouveau titre du rôle (optionnel)',
          example: 'Backend Developer',
          minLength: 1,
          maxLength: 100,
        },
        description: {
          type: 'string',
          description: 'Nouvelle description du rôle (optionnel)',
          example:
            'Développeur backend responsable du développement des APIs et de la logique métier',
          minLength: 1,
          maxLength: 500,
        },
        techStacks: {
          type: 'array',
          description: 'Nouveaux tech stacks requis pour ce rôle (optionnel)',
          items: { type: 'string' },
          example: ['2', '3'],
          minItems: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Rôle mis à jour avec succès',
    example: {
      id: '6c65cc5b-cfe5-4f48-86f7-6efffd6d3916',
      projectId: '3c2ee6b8-559e-42be-beb9-1807984270f3',
      title: 'Backend Developer',
      description:
        'Développeur backend responsable du développement des APIs et de la logique métier',
      isFilled: false,
      techStacks: [
        {
          id: '2',
          name: 'Next.js',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
        },
      ],
      createdAt: '2025-07-14T12:35:08.064Z',
      updatedAt: '2025-07-14T14:11:31.539Z',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Erreur de validation',
    example: {
      error: 'Project role not found',
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
    example: {
      message: 'unauthorised',
      statusCode: 401,
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Accès interdit',
    example: {
      message: 'You are not allowed to update roles in this project',
      statusCode: 403,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Rôle ou projet non trouvé',
    example: {
      message: 'Project role not found',
      statusCode: 404,
    },
  })
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
  @ApiOperation({ summary: 'Supprimer un rôle de projet existant' })
  @ApiCookieAuth('sAccessToken')
  @ApiParam({
    name: 'projectId',
    description: 'ID du projet',
    example: '3c2ee6b8-559e-42be-beb9-1807984270f3',
  })
  @ApiParam({
    name: 'roleId',
    description: 'ID du rôle à supprimer',
    example: '6c65cc5b-cfe5-4f48-86f7-6efffd6d3916',
  })
  @ApiResponse({
    status: 200,
    description: 'Rôle supprimé avec succès',
    example: {
      message: 'Project role deleted successfully',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Erreur de validation',
    example: {
      error: 'Project role not found',
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
    example: {
      message: 'unauthorised',
      statusCode: 401,
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Accès interdit',
    example: {
      message: 'You are not allowed to delete roles in this project',
      statusCode: 403,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Rôle ou projet non trouvé',
    example: {
      message: 'Project role not found',
      statusCode: 404,
    },
  })
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

  @Post(':roleId/apply')
  @ApiOperation({ summary: 'Appliquer à un rôle de projet' })
  @ApiCookieAuth('sAccessToken')
  @ApiParam({
    name: 'projectId',
    description: 'ID du projet',
    example: '108da791-6e48-47de-9a2b-b88f739e08a2',
  })
  @ApiParam({
    name: 'roleId',
    description: 'ID du rôle',
    example: '6262e74b-24f0-4c7b-a03c-5ac853a512ab',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['keyFeatures', 'projectGoals'],
      properties: {
        keyFeatures: {
          type: 'array',
          items: { type: 'string' },
          description: 'Liste des ID des fonctionnalités clés sélectionnées',
          example: ['test'],
        },
        projectGoals: {
          type: 'array',
          items: { type: 'string' },
          description: 'Liste des ID des objectifs de projet sélectionnés',
          example: ['test'],
        },
        motivationLetter: {
          type: 'string',
          description: 'Lettre de motivation (optionnel)',
          example: 'Je suis très motivé pour rejoindre ce projet...',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Application réussie',
    example: {
      userId: 'accfaebd-b8bb-479b-aa3e-e02509d86e1d',
      projectId: '108da791-6e48-47de-9a2b-b88f739e08a2',
      projectRoleTitle: 'dev front',
      projectRoleId: '6262e74b-24f0-4c7b-a03c-5ac853a512ab',
      status: 'PENDING',
      selectedKeyFeatures: ['test'],
      selectedProjectGoals: ['test'],
      appliedAt: '2025-07-14T22:28:53.441Z',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Erreur lors de la candidature',
    example: {
      statusCode: 400,
      message: 'You are not the owner of this project',
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
    example: {
      message: 'unauthorised',
      statusCode: 401,
    },
  })
  async applyToProjectRole(
    @Session('userId') userId: string,
    @Param('roleId') roleId: string,
    @Body() body: ApplyToRoleRequestDto,
  ) {
    const { keyFeatures, projectGoals, motivationLetter } = body;
    const command = new ApplyToProjectRoleCommand({
      userId,
      projectRoleId: roleId,
      selectedKeyFeatures: keyFeatures,
      selectedProjectGoals: projectGoals,
      motivationLetter,
    });
    console.log('command', command);

    const result: Result<ProjectRoleApplication, string> =
      await this.commandBus.execute(command);

    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return result.value;
  }
}
