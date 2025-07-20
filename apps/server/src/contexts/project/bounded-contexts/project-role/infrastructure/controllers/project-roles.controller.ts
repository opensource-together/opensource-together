import {
  Body,
  Controller,
  Param,
  Post,
  Patch,
  Delete,
  Get,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProjectRoleCommand } from '@/contexts/project/bounded-contexts/project-role/use-cases/commands/create-project-role.command';
import { UpdateProjectRoleCommand } from '@/contexts/project/bounded-contexts/project-role/use-cases/commands/update-project-role.command';
import { DeleteProjectRoleCommand } from '@/contexts/project/bounded-contexts/project-role/use-cases/commands/delete-project-role.command';
import { PublicAccess, Session } from 'supertokens-nestjs';
import { OptionalSession } from '@/libs/decorators/optional-session.decorator';
import { CreateProjectRoleDtoRequest } from './dto/create-project-role-request.dto';
import { UpdateProjectRoleDtoRequest } from './dto/update-project-role-request.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Result } from '@/libs/result';
import { ProjectRole } from '@/contexts/project/bounded-contexts/project-role/domain/project-role.entity';
import {
  ApiTags,
  ApiOperation,
  ApiCookieAuth,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { GetProjectRolesQuery } from '@/contexts/project/bounded-contexts/project-role/use-cases/queries/get-project-roles.query';

@ApiTags('Project Roles')
@Controller('projects/:projectId/roles')
export class ProjectRolesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @PublicAccess()
  @Get()
  @ApiOperation({ summary: "Récupérer tous les rôles d'un projet" })
  @ApiCookieAuth('sAccessToken')
  @ApiParam({
    name: 'projectId',
    description: 'ID du projet',
    example: '5f4cbe9b-1305-43a2-95ca-23d7be707717',
  })
  @ApiResponse({
    status: 200,
    description:
      "Récupération des rôles avec succès, si l'utilisateur a appliqué pour un rôle, le champ hasApplied sera true",
    example: [
      {
        //type de réponse classique pour le visitieur ou l'utilisateur n'ayant pas appliqué pour un rôle
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
      {
        //si l'utilisateur a appliqué pour un rôle, le champ hasApplied sera ajouté avec une valeur true
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
        hasApplied: true,
      },
    ],
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
  async getProjectRoles(
    @Param('projectId') projectId: string,
    @OptionalSession() userId?: string,
  ) {
    const query = new GetProjectRolesQuery({ projectId, userId });
    const result: Result<ProjectRole[] & { hasApplied?: boolean }, string> =
      await this.queryBus.execute(query);
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.NOT_FOUND);
    }
    return result.value;
  }

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
}
