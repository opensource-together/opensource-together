import { Controller, Post } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation } from '@nestjs/swagger';
import { ApiParam } from '@nestjs/swagger';
import { ApiBody } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';
import { Session } from 'supertokens-nestjs';
import { Param } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Result } from '@/libs/result';
import { ProjectRoleApplication } from '@/contexts/project/bounded-contexts/project-role-application/domain/project-role-application.entity';
import { ApplyToRoleRequestDto } from '@/contexts/project/bounded-contexts/project-role/infrastructure/controllers/dto/apply-to-role-request.dto';
import { ApplyToProjectRoleCommand } from '@/contexts/project/bounded-contexts/project-role-application/use-cases/commands/apply-to-project-role.command';
import { CommandBus } from '@nestjs/cqrs';

@Controller('projects/:projectId/roles/:roleId')
export class ProjectRoleApplicationController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post()
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
