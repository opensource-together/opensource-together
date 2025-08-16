import {
  Controller,
  Delete,
  Param,
  Post,
  Body,
  BadRequestException,
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

@ApiTags('Project Elements')
@Controller('projects/:projectId')
export class ProjectKeyFeatureController {
  constructor(private readonly commandBus: CommandBus) {}

  @Delete('key-features/:keyFeatureId')
  @ApiOperation({ summary: 'Supprimer une key feature' })
  @ApiCookieAuth('sAccessToken')
  @ApiParam({ name: 'projectId', description: 'ID du projet' })
  @ApiParam({ name: 'keyFeatureId', description: 'ID de la key feature' })
  @ApiResponse({
    status: 200,
    description: 'Key feature supprimée',
    example: { success: true },
  })
  @ApiResponse({
    status: 400,
    description: 'Erreur de validation',
    example: { message: 'Key feature not found', statusCode: 400 },
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
    example: { message: 'unauthorised', statusCode: 401 },
  })
  @ApiResponse({
    status: 403,
    description: 'Accès interdit',
    example: {
      message: 'You are not allowed to delete this key feature',
      statusCode: 403,
    },
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
        throw new Error('Project not found');
      }
      if (result.error === 'You are not allowed to delete this key feature') {
        throw new Error('You are not allowed to delete this key feature');
      }
      throw new Error(result.error);
    }

    return { success: true };
  }

  @Post('key-features')
  @ApiOperation({ summary: 'Créer une key feature' })
  @ApiCookieAuth('sAccessToken')
  @ApiParam({ name: 'projectId', description: 'ID du projet' })
  @ApiBody({ type: CreateProjectKeyFeatureCommand })
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
      throw new BadRequestException(result.error);
    }
    return result.value.toPrimitive();
  }
}
