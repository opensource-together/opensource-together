import { FindUserApplicationsQuery } from '@/contexts/user/use-cases/queries/find-user-applications.query';
import { Result } from '@/libs/result';
import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiCookieAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Session } from 'supertokens-nestjs';
@Controller('user')
export class UserController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('applications')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get all applications for a user' })
  @ApiResponse({
    status: 200,
    description: 'Liste des candidatures',
    example: [
      {
        appplicationId: '672e9a56-e22c-4848-b68d-2c2845b7a7ba',
        projectRoleId: '15858a85-6d77-4065-b479-afa34395610f',
        projectRoleTitle: 'Dev front',
        status: 'PENDING',
        selectedKeyFeatures: ['auth'],
        selectedProjectGoals: ['progres'],
        appliedAt: '2025-07-22T13:08:06.914Z',
        decidedAt: '2025-07-22T14:35:48.838Z',
        decidedBy: '',
        rejectionReason: '',
        motivationLetter: 'Je vais faire ca et ci etc ca',
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
        motivationLetter: 'Je vais faire ca et ci etc ca',
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
  async getApplications(@Session('userId') userId: string) {
    const applications: Result<
      {
        appplicationId: string;
        projectRoleId: string;
        projectTitle: string;
        projectRoleTitle: string;
        status: string;
        selectedKeyFeatures: string[];
        selectedProjectGoals: string[];
        appliedAt: Date;
        decidedAt: Date;
        decidedBy: string;
        rejectionReason: string;
        motivationLetter: string;
      }[]
    > = await this.queryBus.execute(new FindUserApplicationsQuery({ userId }));
    if (!applications.success) {
      throw new HttpException(applications.error, HttpStatus.BAD_REQUEST);
    }
    return applications.value;
  }
}
