import { ProjectRole } from '@/contexts/project/bounded-contexts/project-role/domain/project-role.entity';
import { CreateProjectRoleCommand } from '@/contexts/project/bounded-contexts/project-role/use-cases/commands/create-project-role.command';
import { DeleteProjectRoleCommand } from '@/contexts/project/bounded-contexts/project-role/use-cases/commands/delete-project-role.command';
import { UpdateProjectRoleCommand } from '@/contexts/project/bounded-contexts/project-role/use-cases/commands/update-project-role.command';
import { Result } from '@/libs/result';
import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Logger,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Session } from 'supertokens-nestjs';
import { CreateProjectRoleDtoRequest } from './dto/create-project-role-request.dto';
import { UpdateProjectRoleDtoRequest } from './dto/update-project-role-request.dto';

@ApiTags('User Project Roles')
@Controller('projects/me/:projectId/roles')
@ApiCookieAuth('sAccessToken')
export class UserProjectRolesController {
  private readonly Logger = new Logger(UserProjectRolesController.name);
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @ApiOperation({ summary: 'Ajouter un rôle à un projet de l\'utilisateur connecté' })
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
  })
  @ApiResponse({
    status: 403,
    description: 'Accès interdit - Vous n\'êtes pas le propriétaire du projet',
  })
  @ApiResponse({
    status: 404,
    description: 'Projet non trouvé',
  })
  async createProjectRole(
    @Session('userId') userId: string,
    @Param('projectId') projectId: string,
    @Body() body: CreateProjectRoleDtoRequest,
  ) {
    this.Logger.log('Creating role for user project', { projectId, userId });
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
      if (result.error === 'You are not allowed to create roles in this project') {
        throw new HttpException(result.error, HttpStatus.FORBIDDEN);
      }
      if (result.error === 'Project not found') {
        throw new HttpException(result.error, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }
    return result.value;
  }

  @Patch(':roleId')
  @ApiOperation({ summary: 'Mettre à jour un rôle d\'un projet de l\'utilisateur connecté' })
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
  })
  @ApiResponse({
    status: 403,
    description: 'Accès interdit - Vous n\'êtes pas le propriétaire du projet',
  })
  @ApiResponse({
    status: 404,
    description: 'Rôle ou projet non trouvé',
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
  @ApiOperation({ summary: 'Supprimer un rôle d\'un projet de l\'utilisateur connecté' })
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
    status: 403,
    description: 'Accès interdit - Vous n\'êtes pas le propriétaire du projet',
  })
  @ApiResponse({
    status: 404,
    description: 'Rôle ou projet non trouvé',
  })
  async deleteProjectRole(
    @Session('userId') userId: string,
    @Param('projectId') projectId: string,
    @Param('roleId') roleId: string,
  ) {
    const command = new DeleteProjectRoleCommand(roleId, projectId, userId);
    const result: Result<void, string> = await this.commandBus.execute(command);

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