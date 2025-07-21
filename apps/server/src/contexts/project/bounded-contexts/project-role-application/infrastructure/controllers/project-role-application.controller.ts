import { Controller, Get, Post, Patch } from '@nestjs/common';
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
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetAllProjectApplicationsQuery } from '../../use-cases/queries/get-all-project-application.query';
import { GetApplicationByRoleIdQuery } from '../../use-cases/queries/get-application-by-role-id.query';
import { AcceptUserApplicationCommand } from '../../use-cases/commands/accept-user-application.command';
import { RejectUserApplicationCommand } from '../../use-cases/commands/reject-user-application.command';

@Controller('projects/:projectId/roles')
export class ProjectRoleApplicationController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  @Post(':roleId')
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
      id: 'd32ffdab-127c-43cd-b05c-f523003e25f1',
      projectId: 'f9157e9d-82cb-4227-8f69-bcb637ae05b7',
      projectRoleTitle: 'Dév web',
      projectRoleId: '178210fe-8166-4fa0-824e-d9858072076d',
      status: 'PENDING',
      motivationLetter: 'je peux faire ca et tout etc',
      selectedKeyFeatures: ['test key features'],
      selectedProjectGoals: ['test project goals'],
      appliedAt: '2025-07-18T04:48:56.776Z',
      userProfile: {
        id: 'accfaebd-b8bb-479b-aa3e-e02509d86e1d',
        name: 'LhourquinPro',
        avatarUrl: 'https://avatars.githubusercontent.com/u/78709164?v=4',
      },
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

    const result: Result<ProjectRoleApplication, string> =
      await this.commandBus.execute(command);

    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return result.value;
  }

  @Get('applications')
  @ApiOperation({ summary: "Récupérer les candidatures d'un projet" })
  @ApiCookieAuth('sAccessToken')
  @ApiParam({ name: 'projectId', description: 'ID du projet' })
  @ApiResponse({
    status: 200,
    description: 'Liste des candidatures',
    example: [
      {
        appplicationId: '135e59ec-ce39-4e2e-9070-cc34b894f8fb',
        projectRoleId: '82711be8-6e93-4fd3-bfc2-7f0d63592e85',
        projectRoleTitle: 'dev angular',
        status: 'PENDING',
        selectedKeyFeatures: ['asdgasdgasdg'],
        selectedProjectGoals: ['asgasdgasgsadg'],
        appliedAt: '2025-07-18T04:39:48.661Z',
        decidedAt: '2025-07-18T04:50:17.263Z',
        decidedBy: '',
        rejectionReason: '',
        userProfile: {
          id: 'accfaebd-b8bb-479b-aa3e-e02509d86e1d',
          name: 'LhourquinPro',
          avatarUrl: 'https://avatars.githubusercontent.com/u/78709164?v=4',
        },
      },
      {
        appplicationId: '8a84e2cd-aa8c-4688-b733-60f64be48a34',
        projectRoleId: '1c7e97aa-3077-4806-873f-4c06197654a5',
        projectRoleTitle: 'dev node',
        status: 'PENDING',
        selectedKeyFeatures: ['asdgasdgasdg'],
        selectedProjectGoals: ['asgasdgasgsadg'],
        appliedAt: '2025-07-18T04:46:53.296Z',
        decidedAt: '2025-07-18T04:50:17.263Z',
        decidedBy: '',
        rejectionReason: '',
        userProfile: {
          id: 'accfaebd-b8bb-479b-aa3e-e02509d86e1d',
          name: 'LhourquinPro',
          avatarUrl: 'https://avatars.githubusercontent.com/u/78709164?v=4',
        },
      },
      {
        appplicationId: '26f22bed-b27c-4e96-9eb6-98f558df7400',
        projectRoleId: '8c7e1125-b2fc-455c-8db3-2ba94e3a46d3',
        projectRoleTitle: 'dev react',
        status: 'PENDING',
        selectedKeyFeatures: ['asdgasdgasdg'],
        selectedProjectGoals: ['asgasdgasgsadg'],
        appliedAt: '2025-07-18T04:47:39.150Z',
        decidedAt: '2025-07-18T04:50:17.263Z',
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
    status: 400,
    description: 'Accès refusé',
    example: {
      message: 'You are not the owner of this project',
      statusCode: 400,
    },
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
      throw new HttpException(applications.error, HttpStatus.BAD_REQUEST);
    }
    return applications.value;
  }

  @ApiResponse({
    status: 200,
    description: 'Applications récupérées avec succès',
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
    status: 400,
    description: 'Accès refusé',
    example: {
      message: 'You are not the owner of this project',
      statusCode: 400,
    },
  })
  @Get(':roleId/applications')
  async getApplicationByRoleId(
    @Param('roleId') roleId: string,
    @Param('projectId') projectId: string,
    @Session('userId') userId: string,
  ) {
    console.log('roleId', roleId);
    console.log('projectId', projectId);
    console.log('userId', userId);
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
    console.log('applications', applications);
    if (!applications.success) {
      throw new HttpException(applications.error, HttpStatus.BAD_REQUEST);
    }
    return applications.value;
  }

  @Patch('applications/:applicationId/accept')
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
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }
    return result.value;
  }

  @Patch('applications/:applicationId/reject')
  async rejectApplication(
    @Param('applicationId') applicationId: string,
    @Param('projectId') projectId: string,
    @Session('userId') userId: string,
    @Body() body: { rejectionReason?: string },
  ) {
    const command = new RejectUserApplicationCommand({
      projectRoleApplicationId: applicationId,
      projectId,
      userId,
      rejectionReason: body.rejectionReason,
    });
    const result: Result<ProjectRoleApplication, string> =
      await this.commandBus.execute(command);
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }
    return result.value;
  }
}
