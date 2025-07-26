import { ProjectRoleApplication } from '@/contexts/project/bounded-contexts/project-role-application/domain/project-role-application.entity';
import { Result } from '@/libs/result';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Logger,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Session } from 'supertokens-nestjs';
import { AcceptUserApplicationCommand } from '../../use-cases/commands/accept-user-application.command';
import { RejectUserApplicationCommand } from '../../use-cases/commands/reject-user-application.command';
import { GetAllProjectApplicationsQuery } from '../../use-cases/queries/get-all-project-application.query';
import { GetApplicationByRoleIdQuery } from '../../use-cases/queries/get-application-by-role-id.query';

@ApiTags('User Project Role Applications')
@Controller('projects/me/:projectId/roles')
@ApiCookieAuth('sAccessToken')
export class UserProjectRoleApplicationController {
  private readonly Logger = new Logger(UserProjectRoleApplicationController.name);
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('applications')
  @ApiOperation({ summary: 'Récupérer toutes les candidatures pour un projet de l\'utilisateur connecté' })
  @ApiParam({
    name: 'projectId',
    description: 'ID du projet',
    example: 'f9157e9d-82cb-4227-8f69-bcb637ae05b7',
  })
  @ApiResponse({
    status: 200,
    description: 'Candidatures récupérées avec succès',
    example: [
      {
        appplicationId: 'd32ffdab-127c-43cd-b05c-f523003e25f1',
        projectRoleId: '178210fe-8166-4fa0-824e-d9858072076d',
        projectRoleTitle: 'Dév web',
        status: 'PENDING',
        selectedKeyFeatures: ['test key features'],
        selectedProjectGoals: ['test project goals'],
        appliedAt: '2025-07-18T04:48:56.776Z',
        decidedAt: '2025-07-18T08:40:43.082Z',
        decidedBy: '',
        rejectionReason: '',
        userProfile: {
          id: 'accfaebd-b8bb-479b-aa3e-e02509d86e1d',
          name: 'LhourquinPro',
          avatarUrl: 'https://avatars.githubusercontent.com/u/78709164?v=4',
        },
      },
    ],
  })
  @ApiResponse({
    status: 403,
    description: 'Accès refusé - Vous n\'êtes pas le propriétaire du projet',
  })
  async getProjectApplications(
    @Session('userId') userId: string,
    @Param('projectId') projectId: string,
  ) {
    const applications: Result<
      {
        appplicationId: string;
        projectRoleId: string;
        projectRoleTitle: string;
        status: string;
        selectedKeyFeatures: string[];
        selectedProjectGoals: string[];
        appliedAt: Date;
        decidedAt: Date;
        decidedBy: string;
        rejectionReason: string;
        userProfile: {
          id: string;
          name: string;
          avatarUrl: string;
        };
      }[]
    > = await this.queryBus.execute(
      new GetAllProjectApplicationsQuery({ projectId, userId }),
    );
    if (!applications.success) {
      if (applications.error === 'You are not the owner of this project') {
        throw new HttpException(applications.error, HttpStatus.FORBIDDEN);
      }
      throw new HttpException(applications.error, HttpStatus.BAD_REQUEST);
    }
    return applications.value;
  }

  @Get(':roleId/applications')
  @ApiOperation({ summary: 'Récupérer les candidatures pour un rôle spécifique d\'un projet de l\'utilisateur connecté' })
  @ApiParam({
    name: 'projectId',
    description: 'ID du projet',
    example: 'f9157e9d-82cb-4227-8f69-bcb637ae05b7',
  })
  @ApiParam({
    name: 'roleId',
    description: 'ID du rôle',
    example: '178210fe-8166-4fa0-824e-d9858072076d',
  })
  @ApiResponse({
    status: 200,
    description: 'Candidatures récupérées avec succès',
  })
  @ApiResponse({
    status: 403,
    description: 'Accès refusé - Vous n\'êtes pas le propriétaire du projet',
  })
  async getApplicationByRoleId(
    @Param('roleId') roleId: string,
    @Param('projectId') projectId: string,
    @Session('userId') userId: string,
  ) {
    this.Logger.log('Getting applications for role', { roleId, projectId, userId });
    const applications: Result<
      {
        appplicationId: string;
        projectRoleId: string;
        projectRoleTitle: string;
        status: string;
        selectedKeyFeatures: string[];
        selectedProjectGoals: string[];
        appliedAt: Date;
        decidedAt: Date;
        decidedBy: string;
        rejectionReason: string;
        userProfile: {
          id: string;
          name: string;
          avatarUrl: string;
        };
      }[]
    > = await this.queryBus.execute(
      new GetApplicationByRoleIdQuery({ roleId, userId, projectId }),
    );
    if (!applications.success) {
      if (applications.error === 'You are not the owner of this project') {
        throw new HttpException(applications.error, HttpStatus.FORBIDDEN);
      }
      throw new HttpException(applications.error, HttpStatus.BAD_REQUEST);
    }
    return applications.value;
  }

  @Patch('applications/:applicationId/accept')
  @ApiOperation({ summary: 'Accepter une candidature pour un projet de l\'utilisateur connecté' })
  @ApiParam({
    name: 'projectId',
    description: 'ID du projet',
    example: 'f9157e9d-82cb-4227-8f69-bcb637ae05b7',
  })
  @ApiParam({
    name: 'applicationId',
    description: 'ID de la candidature',
    example: 'd32ffdab-127c-43cd-b05c-f523003e25f1',
  })
  @ApiResponse({
    status: 200,
    description: 'Candidature acceptée avec succès',
  })
  @ApiResponse({
    status: 403,
    description: 'Accès refusé - Vous n\'êtes pas le propriétaire du projet',
  })
  async acceptApplication(
    @Param('applicationId') applicationId: string,
    @Param('projectId') projectId: string,
    @Session('userId') userId: string,
  ) {
    const command = new AcceptUserApplicationCommand({
      projectRoleApplicationId: applicationId,
      projectId,
      userId,
    });
    const result: Result<ProjectRoleApplication, string> =
      await this.commandBus.execute(command);
    if (!result.success) {
      if (result.error === 'You are not the owner of this project') {
        throw new HttpException(result.error, HttpStatus.FORBIDDEN);
      }
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }
    return result.value;
  }

  @Patch('applications/:applicationId/reject')
  @ApiOperation({ summary: 'Rejeter une candidature pour un projet de l\'utilisateur connecté' })
  @ApiParam({
    name: 'projectId',
    description: 'ID du projet',
    example: 'f9157e9d-82cb-4227-8f69-bcb637ae05b7',
  })
  @ApiParam({
    name: 'applicationId',
    description: 'ID de la candidature',
    example: 'd32ffdab-127c-43cd-b05c-f523003e25f1',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        rejectionReason: {
          type: 'string',
          description: 'Raison du rejet (optionnel)',
          example: 'Profil ne correspondant pas aux besoins actuels',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Candidature rejetée avec succès',
  })
  @ApiResponse({
    status: 403,
    description: 'Accès refusé - Vous n\'êtes pas le propriétaire du projet',
  })
  async rejectApplication(
    @Param('applicationId') applicationId: string,
    @Param('projectId') projectId: string,
    @Session('userId') userId: string,
    @Body() body?: { rejectionReason?: string },
  ) {
    const command = new RejectUserApplicationCommand({
      projectRoleApplicationId: applicationId,
      projectId,
      userId,
      rejectionReason: body?.rejectionReason,
    });
    const result: Result<ProjectRoleApplication, string> =
      await this.commandBus.execute(command);
    if (!result.success) {
      if (result.error === 'You are not the owner of this project') {
        throw new HttpException(result.error, HttpStatus.FORBIDDEN);
      }
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }
    return result.value;
  }
}