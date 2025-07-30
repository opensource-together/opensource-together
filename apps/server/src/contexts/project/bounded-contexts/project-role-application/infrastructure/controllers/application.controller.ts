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
  @Get()
  @ApiTags('Applications')
  @ApiOperation({ summary: 'Get all applications by projects owner' })
  @ApiResponse({
    status: 200,
    description: 'Applications retrieved successfully',
    type: ProjectRoleApplication,
    isArray: true,
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          status: { type: 'string' },
          projectId: { type: 'string' },
          projectTitle: { type: 'string' },
          projectDescription: { type: 'string' },
          projectRoleId: { type: 'string' },
          projectRoleTitle: { type: 'string' },
          appliedAt: { type: 'string' },
          decidedAt: { type: 'string' },
          decidedBy: { type: 'string' },
          userProfile: {
            type: 'object',
          },
        },
      },
    },
    example: [
      {
        appplicationId: 'd78b2322-65db-4c8b-a2d0-6cf65afae882',
        projectRoleId: '3715420c-d33e-4541-8e9a-e547eb169ba1',
        projectRoleTitle: 'Dev back',
        projectRoleDescription: 'lol lol lo,l olo lol olol ol ',
        status: 'PENDING',
        selectedKeyFeatures: [
          {
            id: '88abc2a0-7e0b-4457-b68b-9ca060bd26d5',
            feature: 'auth',
          },
        ],
        selectedProjectGoals: [
          {
            id: 'a55d2155-67b2-4794-9aea-c1bb4031c91c',
            goal: 'app de revision',
          },
        ],
        appliedAt: '2025-07-29T09:07:15.289Z',
        decidedAt: '2025-07-29T18:14:27.974Z',
        decidedBy: '',
        rejectionReason: '',
        motivationLetter:
          'dfsajhksadfhjkasdfhjkdsafghjkdgsahkjadgshjksadfgklhj',
        userProfile: {
          id: '936d4402-83ff-4be1-a3f7-6e5fba8fa052',
          username: 'Lucalhost',
          avatarUrl: 'https://avatars.githubusercontent.com/u/45101981?v=4',
        },
      },
    ],
  })
  async getApplications(@Session('userId') userId: string) {
    const applications: Result<ProjectRoleApplication[], string> =
      await this.queryBus.execute(
        new GetAllApplicationsByProjectsOwnerQuery(userId),
      );
    if (!applications.success) {
      throw new HttpException(applications.error, HttpStatus.BAD_REQUEST);
    }
    return applications.value;
  }

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
        id: { type: 'string' },
        status: { type: 'string' },
        projectId: { type: 'string' },
        projectTitle: { type: 'string' },
        projectDescription: { type: 'string' },
        projectRoleId: { type: 'string' },
        projectRoleTitle: { type: 'string' },
        appliedAt: { type: 'string' },
        decidedAt: { type: 'string' },
        decidedBy: { type: 'string' },
        userProfile: {
          type: 'object',
        },
      },
    },
    example: {
      id: 'd78b2322-65db-4c8b-a2d0-6cf65afae882',
      projectId: '0247bb88-93cc-408d-8635-d149fa5b7604',
      projectTitle: 'studydi',
      projectDescription: 'asgdafsgadsfgdasfg',
      projectRoleTitle: 'Dev back',
      projectRoleId: '3715420c-d33e-4541-8e9a-e547eb169ba1',
      status: 'PENDING',
      motivationLetter: 'dfsajhksadfhjkasdfhjkdsafghjkdgsahkjadgshjksadfgklhj',
      selectedKeyFeatures: [
        {
          id: '88abc2a0-7e0b-4457-b68b-9ca060bd26d5',
          projectId: '0247bb88-93cc-408d-8635-d149fa5b7604',
          feature: 'auth',
        },
      ],
      selectedProjectGoals: [
        {
          id: 'a55d2155-67b2-4794-9aea-c1bb4031c91c',
          projectId: '0247bb88-93cc-408d-8635-d149fa5b7604',
          goal: 'app de revision',
        },
      ],
      appliedAt: '2025-07-29T09:07:15.289Z',
      userProfile: {
        id: '936d4402-83ff-4be1-a3f7-6e5fba8fa052',
        username: 'Lucalhost',
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
          id: 'd78b2322-65db-4c8b-a2d0-6cf65afae882',
          projectId: '0247bb88-93cc-408d-8635-d149fa5b7604',
          projectTitle: 'studydi',
          projectDescription: 'asgdafsgadsfgdasfg',
          projectRoleTitle: 'Dev back',
          projectRoleId: '3715420c-d33e-4541-8e9a-e547eb169ba1',
          status: 'APPROVAL',
          motivationLetter:
            'dfsajhksadfhjkasdfhjkdsafghjkdgsahkjadgshjksadfgklhj',
          selectedKeyFeatures: [
            {
              id: '88abc2a0-7e0b-4457-b68b-9ca060bd26d5',
              projectId: '0247bb88-93cc-408d-8635-d149fa5b7604',
              feature: 'auth',
            },
          ],
          selectedProjectGoals: [
            {
              id: 'a55d2155-67b2-4794-9aea-c1bb4031c91c',
              projectId: '0247bb88-93cc-408d-8635-d149fa5b7604',
              goal: 'app de revision',
            },
          ],
          rejectionReason: '',
          appliedAt: '2025-07-29T09:07:15.289Z',
          userProfile: {
            id: '936d4402-83ff-4be1-a3f7-6e5fba8fa052',
            username: 'Lucalhost',
            avatarUrl: 'https://avatars.githubusercontent.com/u/45101981?v=4',
          },
        },
      },
      REJECTED: {
        summary: 'Application rejected successfully',
        value: {
          id: 'd78b2322-65db-4c8b-a2d0-6cf65afae882',
          projectId: '0247bb88-93cc-408d-8635-d149fa5b7604',
          projectTitle: 'studydi',
          projectDescription: 'asgdafsgadsfgdasfg',
          projectRoleTitle: 'Dev back',
          projectRoleId: '3715420c-d33e-4541-8e9a-e547eb169ba1',
          status: 'REJECTED',
          motivationLetter:
            'dfsajhksadfhjkasdfhjkdsafghjkdgsahkjadgshjksadfgklhj',
          selectedKeyFeatures: [
            {
              id: '88abc2a0-7e0b-4457-b68b-9ca060bd26d5',
              projectId: '0247bb88-93cc-408d-8635-d149fa5b7604',
              feature: 'auth',
            },
          ],
          selectedProjectGoals: [
            {
              id: 'a55d2155-67b2-4794-9aea-c1bb4031c91c',
              projectId: '0247bb88-93cc-408d-8635-d149fa5b7604',
              goal: 'app de revision',
            },
          ],
          rejectionReason: 'tes laid',
          appliedAt: '2025-07-29T09:07:15.289Z',
          userProfile: {
            id: '936d4402-83ff-4be1-a3f7-6e5fba8fa052',
            username: 'Lucalhost',
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
        status: { type: 'string', enum: ['APPROVAL', 'REJECTED'] },
        rejectionReason: { type: 'string', nullable: true },
      },
      required: ['status'],
    },
  })
  async acceptOrRejectApplication(
    @Param('id') id: string,
    @Body() body: { status: 'APPROVAL' | 'REJECTED'; rejectionReason?: string },
    @Session('userId') userId: string,
  ) {
    if (body.status === 'APPROVAL') {
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
