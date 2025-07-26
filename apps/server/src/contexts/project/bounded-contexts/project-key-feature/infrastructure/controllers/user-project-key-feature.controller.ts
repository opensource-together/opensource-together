import {
  Controller,
  Delete,
  Param,
  Post,
  Body,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Session } from 'supertokens-nestjs';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DeleteKeyFeatureCommand } from '@/contexts/project/bounded-contexts/project-key-feature/use-cases/commands/project-delete-key-feature.command';
import { Result } from '@/libs/result';
import { CreateProjectKeyFeatureCommand } from '@/contexts/project/bounded-contexts/project-key-feature/use-cases/commands/create-project-key-feature.command';
import { Project } from '@/contexts/project/domain/project.entity';

@ApiTags('User Project Key Features')
@Controller('projects/me/:projectId')
@ApiCookieAuth('sAccessToken')
export class UserProjectKeyFeatureController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('key-features')
  @ApiOperation({ summary: 'Créer une key feature pour un projet de l\'utilisateur connecté' })
  @ApiParam({ name: 'projectId', description: 'ID du projet' })
  @ApiBody({ 
    schema: {
      type: 'object',
      required: ['features'],
      properties: {
        features: {
          type: 'array',
          items: { type: 'string' },
          description: 'Liste des nouvelles key features',
          example: ['Authentication system', 'Real-time notifications'],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Key features créées avec succès',
  })
  @ApiResponse({
    status: 403,
    description: 'Accès interdit - Vous n\'êtes pas le propriétaire du projet',
  })
  async createKeyFeature(
    @Session('userId') userId: string,
    @Param('projectId') projectId: string,
    @Body() createKeyFeatureDto: { features: string[] },
  ) {
    const result: Result<Project, string> = await this.commandBus.execute(
      new CreateProjectKeyFeatureCommand({
        userId,
        projectId,
        features: createKeyFeatureDto.features,
      }),
    );
    
    if (!result.success) {
      if (result.error === 'You are not allowed to update this project') {
        throw new HttpException(result.error, HttpStatus.FORBIDDEN);
      }
      if (result.error === 'Project not found') {
        throw new HttpException(result.error, HttpStatus.NOT_FOUND);
      }
      throw new BadRequestException(result.error);
    }
    
    return result.value.toPrimitive();
  }

  @Delete('key-features/:keyFeatureId')
  @ApiOperation({ summary: 'Supprimer une key feature d\'un projet de l\'utilisateur connecté' })
  @ApiParam({ name: 'projectId', description: 'ID du projet' })
  @ApiParam({ name: 'keyFeatureId', description: 'ID de la key feature' })
  @ApiResponse({
    status: 200,
    description: 'Key feature supprimée',
    example: { success: true },
  })
  @ApiResponse({
    status: 403,
    description: 'Accès interdit - Vous n\'êtes pas le propriétaire du projet',
  })
  @ApiResponse({
    status: 404,
    description: 'Projet ou key feature non trouvé',
  })
  async deleteKeyFeature(
    @Session('userId') ownerId: string,
    @Param('projectId') projectId: string,
    @Param('keyFeatureId') keyFeatureId: string,
  ) {
    const result: Result<boolean> = await this.commandBus.execute(
      new DeleteKeyFeatureCommand(projectId, keyFeatureId, ownerId),
    );

    if (!result.success) {
      if (result.error === 'Project not found') {
        throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
      }
      if (result.error === 'You are not allowed to delete this key feature') {
        throw new HttpException(result.error, HttpStatus.FORBIDDEN);
      }
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return { success: true };
  }
}