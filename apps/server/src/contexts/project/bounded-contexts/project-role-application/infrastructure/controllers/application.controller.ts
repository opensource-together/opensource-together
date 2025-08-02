import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Body,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetAllApplicationsByProjectsOwnerQuery } from '../../use-cases/queries/get-all-applications-by-projects-owner.query';
import { Session } from 'supertokens-nestjs';
import { ProjectRoleApplication } from '../../domain/project-role-application.entity';
import { Result } from '@/libs/result';
import { GetApplicationByIdQuery } from '../../use-cases/queries/get-application-by-id.query';
import { AcceptUserApplicationCommand } from '../../use-cases/commands/accept-user-application.command';
import { RejectUserApplicationCommand } from '../../use-cases/commands/reject-user-application.command';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
@Controller('applications')
export class ApplicationController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get application details' })
  @ApiParam({ name: 'id', description: 'Application ID' })
  @ApiResponse({
    status: 200,
    description: 'Application retrieved successfully',
    type: ProjectRoleApplication,
    schema: {
      type: 'object',
      properties: {
        appplicationId: { type: 'string' },
        projectRoleId: { type: 'string' },
        projectRoleTitle: { type: 'string' },
        project: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            shortDescription: { type: 'string' },
            image: { type: 'string', nullable: true },
            author: {
              type: 'object',
              properties: {
                ownerId: { type: 'string' },
                name: { type: 'string' },
                avatarUrl: { type: 'string', nullable: true },
              },
            },
          },
        },
        projectRole: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            projectId: { type: 'string', nullable: true },
            title: { type: 'string' },
            description: { type: 'string' },
            techStacks: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  iconUrl: { type: 'string', nullable: true },
                },
              },
            },
            roleCount: { type: 'number', nullable: true },
            projectGoal: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', nullable: true },
                  projectId: { type: 'string', nullable: true },
                  goal: { type: 'string' },
                },
              },
              nullable: true,
            },
          },
        },
        status: {
          type: 'string',
          enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED'],
        },
        selectedKeyFeatures: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              feature: { type: 'string' },
            },
          },
        },
        selectedProjectGoals: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              goal: { type: 'string' },
            },
          },
        },
        appliedAt: { type: 'string', format: 'date-time' },
        decidedAt: { type: 'string', format: 'date-time' },
        decidedBy: { type: 'string', nullable: true },
        rejectionReason: { type: 'string', nullable: true },
        motivationLetter: { type: 'string' },
        userProfile: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            avatarUrl: { type: 'string', nullable: true },
          },
        },
      },
    },
    example: {
      appplicationId: 'd78b2322-65db-4c8b-a2d0-6cf65afae882',
      projectRoleId: '3715420c-d33e-4541-8e9a-e547eb169ba1',
      projectRoleTitle: 'Dev back',
      project: {
        id: '0247bb88-93cc-408d-8635-d149fa5b7604',
        title: 'studydi',
        shortDescription: 'Application de révision interactive',
        image: 'https://example.com/project-image.jpg',
        author: {
          ownerId: '936d4402-83ff-4be1-a3f7-6e5fba8fa052',
          name: 'Lucalhost',
          avatarUrl: 'https://avatars.githubusercontent.com/u/45101981?v=4',
        },
      },
      projectRole: {
        id: '3715420c-d33e-4541-8e9a-e547eb169ba1',
        projectId: '0247bb88-93cc-408d-8635-d149fa5b7604',
        title: 'Dev back',
        description: 'Développement backend avec Node.js et Express',
        techStacks: [
          {
            id: 'tech-1',
            name: 'Node.js',
            iconUrl: 'https://example.com/nodejs.svg',
          },
          {
            id: 'tech-2',
            name: 'Express',
            iconUrl: 'https://example.com/express.svg',
          },
        ],
        roleCount: 1,
        projectGoal: [
          {
            id: 'goal-1',
            projectId: '0247bb88-93cc-408d-8635-d149fa5b7604',
            goal: 'Créer une API REST robuste',
          },
        ],
      },
      status: 'PENDING',
      selectedKeyFeatures: [
        {
          feature: 'auth',
        },
      ],
      selectedProjectGoals: [
        {
          goal: 'app de revision',
        },
      ],
      appliedAt: '2025-07-29T09:07:15.289Z',
      decidedAt: '2025-07-29T18:14:27.974Z',
      decidedBy: null,
      rejectionReason: null,
      motivationLetter: 'dfsajhksadfhjkasdfhjkdsafghjkdgsahkjadgshjksadfgklhj',
      userProfile: {
        id: '936d4402-83ff-4be1-a3f7-6e5fba8fa052',
        name: 'Lucalhost',
        avatarUrl: 'https://avatars.githubusercontent.com/u/45101981?v=4',
      },
    },
  })
  async getApplicationDetails(@Param('id') id: string) {
    const application: Result<ProjectRoleApplication, string> =
      await this.queryBus.execute(new GetApplicationByIdQuery(id));
    if (!application.success) {
      throw new HttpException(application.error, HttpStatus.BAD_REQUEST);
    }
    return application.value;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Accept or reject application' })
  @ApiParam({ name: 'id', description: 'Application ID' })
  @ApiResponse({
    status: 200,
    description: 'Application accepted or rejected successfully',
    type: ProjectRoleApplication,
    examples: {
      ACCEPTED: {
        summary: 'Application accepted successfully',
        value: {
          appplicationId: 'd78b2322-65db-4c8b-a2d0-6cf65afae882',
          projectRoleId: '3715420c-d33e-4541-8e9a-e547eb169ba1',
          projectRoleTitle: 'Dev back',
          project: {
            id: '0247bb88-93cc-408d-8635-d149fa5b7604',
            title: 'studydi',
            shortDescription: 'Application de révision interactive',
            image: 'https://example.com/project-image.jpg',
            author: {
              ownerId: '936d4402-83ff-4be1-a3f7-6e5fba8fa052',
              name: 'Lucalhost',
              avatarUrl: 'https://avatars.githubusercontent.com/u/45101981?v=4',
            },
          },
          projectRole: {
            id: '3715420c-d33e-4541-8e9a-e547eb169ba1',
            projectId: '0247bb88-93cc-408d-8635-d149fa5b7604',
            title: 'Dev back',
            description: 'Développement backend avec Node.js et Express',
            techStacks: [
              {
                id: 'tech-1',
                name: 'Node.js',
                iconUrl: 'https://example.com/nodejs.svg',
              },
              {
                id: 'tech-2',
                name: 'Express',
                iconUrl: 'https://example.com/express.svg',
              },
            ],
            roleCount: 1,
            projectGoal: [
              {
                id: 'goal-1',
                projectId: '0247bb88-93cc-408d-8635-d149fa5b7604',
                goal: 'Créer une API REST robuste',
              },
            ],
          },
          status: 'ACCEPTED',
          selectedKeyFeatures: [
            {
              feature: 'auth',
            },
          ],
          selectedProjectGoals: [
            {
              goal: 'app de revision',
            },
          ],
          appliedAt: '2025-07-29T09:07:15.289Z',
          decidedAt: '2025-07-29T18:14:27.974Z',
          decidedBy: '936d4402-83ff-4be1-a3f7-6e5fba8fa052',
          rejectionReason: null,
          motivationLetter:
            'dfsajhksadfhjkasdfhjkdsafghjkdgsahkjadgshjksadfgklhj',
          userProfile: {
            id: '936d4402-83ff-4be1-a3f7-6e5fba8fa052',
            name: 'Lucalhost',
            avatarUrl: 'https://avatars.githubusercontent.com/u/45101981?v=4',
          },
        },
      },
      REJECTED: {
        summary: 'Application rejected successfully',
        value: {
          appplicationId: 'd78b2322-65db-4c8b-a2d0-6cf65afae882',
          projectRoleId: '3715420c-d33e-4541-8e9a-e547eb169ba1',
          projectRoleTitle: 'Dev back',
          project: {
            id: '0247bb88-93cc-408d-8635-d149fa5b7604',
            title: 'studydi',
            shortDescription: 'Application de révision interactive',
            image: 'https://example.com/project-image.jpg',
            author: {
              ownerId: '936d4402-83ff-4be1-a3f7-6e5fba8fa052',
              name: 'Lucalhost',
              avatarUrl: 'https://avatars.githubusercontent.com/u/45101981?v=4',
            },
          },
          projectRole: {
            id: '3715420c-d33e-4541-8e9a-e547eb169ba1',
            projectId: '0247bb88-93cc-408d-8635-d149fa5b7604',
            title: 'Dev back',
            description: 'Développement backend avec Node.js et Express',
            techStacks: [
              {
                id: 'tech-1',
                name: 'Node.js',
                iconUrl: 'https://example.com/nodejs.svg',
              },
              {
                id: 'tech-2',
                name: 'Express',
                iconUrl: 'https://example.com/express.svg',
              },
            ],
            roleCount: 1,
            projectGoal: [
              {
                id: 'goal-1',
                projectId: '0247bb88-93cc-408d-8635-d149fa5b7604',
                goal: 'Créer une API REST robuste',
              },
            ],
          },
          status: 'REJECTED',
          selectedKeyFeatures: [
            {
              feature: 'auth',
            },
          ],
          selectedProjectGoals: [
            {
              goal: 'app de revision',
            },
          ],
          appliedAt: '2025-07-29T09:07:15.289Z',
          decidedAt: '2025-07-29T18:14:27.974Z',
          decidedBy: '936d4402-83ff-4be1-a3f7-6e5fba8fa052',
          rejectionReason: 'tes laid',
          motivationLetter:
            'dfsajhksadfhjkasdfhjkdsafghjkdgsahkjadgshjksadfgklhj',
          userProfile: {
            id: '936d4402-83ff-4be1-a3f7-6e5fba8fa052',
            name: 'Lucalhost',
            avatarUrl: 'https://avatars.githubusercontent.com/u/45101981?v=4',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Application not found',
    type: String,
  })
  @ApiResponse({
    status: 400,
    description: 'User is not the owner of the project',
    type: String,
    example: 'User is not the owner of the project',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['ACCEPTED', 'REJECTED'] },
        rejectionReason: { type: 'string', nullable: true },
      },
      required: ['status'],
    },
  })
  async acceptOrRejectApplication(
    @Param('id') id: string,
    @Body() body: { status: 'ACCEPTED' | 'REJECTED'; rejectionReason?: string },
    @Session('userId') userId: string,
  ) {
    if (body.status === 'ACCEPTED') {
      const acceptedApplication: Result<ProjectRoleApplication, string> =
        await this.commandBus.execute(
          new AcceptUserApplicationCommand({
            projectRoleApplicationId: id,
            userId,
          }),
        );
      if (!acceptedApplication.success) {
        throw new HttpException(
          acceptedApplication.error,
          HttpStatus.BAD_REQUEST,
        );
      }
      return acceptedApplication.value;
    } else {
      const rejectedApplication: Result<ProjectRoleApplication, string> =
        await this.commandBus.execute(
          new RejectUserApplicationCommand({
            projectRoleApplicationId: id,
            userId,
            rejectionReason: body.rejectionReason,
          }),
        );
      if (!rejectedApplication.success) {
        throw new HttpException(
          rejectedApplication.error,
          HttpStatus.BAD_REQUEST,
        );
      }
      return rejectedApplication.value;
    }
  }
}
