import { Body, Controller, Param, Post, UseGuards, Get } from '@nestjs/common';
import { ApplicationService } from '../services/application.service';
import { UserSession, Session, AuthGuard } from '@thallesp/nestjs-better-auth';
import { HttpException, HttpStatus, Patch } from '@nestjs/common';
import {
  AcceptOrRejectApplicationRequestDto,
  ApplicationStatus,
} from './dto/accept-reject-application.dto';
import { ApplyToProjectRoleDto } from './dto/apply-to-project-role.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
@UseGuards(AuthGuard)
@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}
  /*******  APPLY TO PROJECT ROLE ********/
  @ApiOperation({ summary: 'Apply to project role' })
  @ApiParam({ name: 'roleId', description: 'Project role ID' })
  @ApiBody({ type: ApplyToProjectRoleDto })
  @ApiResponse({
    status: 200,
    description: 'Application submitted successfully',
    example: {
      id: '090804cf-8353-40e4-b2e2-7d8fce7dd4c6',
      userId: 'IWOt7BVMBxteq0dmoD8s7HnCofOEk8av',
      projectId: '9376e80c-057f-4350-ac75-caf0629ffb92',
      projectRoleId: 'fcacc499-6d1b-4eeb-925b-9218eed27ea2',
      keyFeatureId: '3029ac9b-a143-4b35-884e-d38cc9755647',
      status: 'PENDING',
      motivationLetter: 'Je sui dev back je suis chau',
      rejectionReason: null,
      createdAt: '2025-09-14T09:40:06.028Z',
      updatedAt: '2025-09-14T09:40:06.028Z',
      user: {
        id: 'IWOt7BVMBxteq0dmoD8s7HnCofOEk8av',
        name: 'LhourquinPro',
        githubLogin: 'LhourquinPro',
        email: 'lhourquinpro@gmail.com',
        emailVerified: true,
        image: 'https://avatars.githubusercontent.com/u/78709164?v=4',
        createdAt: '2025-09-11T11:22:45.018Z',
        updatedAt: '2025-09-14T09:30:07.728Z',
      },
      projectRole: {
        id: 'fcacc499-6d1b-4eeb-925b-9218eed27ea2',
        projectId: '9376e80c-057f-4350-ac75-caf0629ffb92',
        title: 'Frontend Developer',
        description: 'Développeur React expérimenté',
        isFilled: false,
        createdAt: '2025-09-11T11:00:04.575Z',
        updatedAt: '2025-09-11T11:00:04.575Z',
      },
      project: {
        id: '9376e80c-057f-4350-ac75-caf0629ffb92',
        ownerId: '02qXDZGijgpJ3OvFvKYRGMPgo5nVmfP0',
        title: 'test',
        description: 'project de test',
        createdAt: '2025-09-11T11:00:04.575Z',
        updatedAt: '2025-09-11T11:00:04.575Z',
        image:
          'https://pub-9015c9fc95574da98f6e7b9d4555ae24.r2.dev/1752867560640-policier-lol.jpg',
        coverImages: [],
        readme: null,
      },
      keyFeature: {
        feature: 'auth',
      },
      appliedAt: '2025-09-14T09:40:06.028Z',
      keyFeatures: ['auth'],
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Application already exists',
    example: {
      statusCode: 400,
      message: 'APPLICATION_PENDING',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Application rejected',
    example: {
      statusCode: 400,
      message: 'APPLICATION_REJECTED',
    },
  })
  @Post('roles/:roleId')
  async applyToProjectRole(
    @Body()
    body: ApplyToProjectRoleDto,
    @Param('roleId') roleId: string,
    @Session() session: UserSession,
  ) {
    const userId = session.user.id;
    const result = await this.applicationService.applyToProjectRole({
      userId,
      projectId: body.projectId,
      projectRoleId: roleId,
      keyFeatures: body.keyFeatures,
      motivationLetter: body.motivationLetter || '',
    });
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }
    return result.value;
  }

  /*******  ME ********/
  @Get('me')
  @ApiOperation({ summary: 'Get applications by user id' })
  @ApiResponse({
    status: 200,
    description: 'Applications by user id',
    example: [
      {
        id: 'f7d4d991-9ead-43ce-b03b-8260bdcf03c4',
        userId: 'IWOt7BVMBxteq0dmoD8s7HnCofOEk8av',
        projectId: '9376e80c-057f-4350-ac75-caf0629ffb92',
        projectRoleId: 'fcacc499-6d1b-4eeb-925b-9218eed27ea2',
        keyFeatureId: '3029ac9b-a143-4b35-884e-d38cc9755647',
        status: 'CANCELLED',
        motivationLetter: 'Je souhaite rejoindre car je suis motivé',
        rejectionReason: null,
        decidedAt: '2025-09-11T15:28:20.290Z',
        createdAt: '2025-09-11T11:28:49.841Z',
        updatedAt: '2025-09-11T15:28:20.290Z',
        user: {
          name: 'LhourquinPro',
          image: 'https://avatars.githubusercontent.com/u/78709164?v=4',
        },
        projectRole: {
          id: 'fcacc499-6d1b-4eeb-925b-9218eed27ea2',
          projectId: '9376e80c-057f-4350-ac75-caf0629ffb92',
          title: 'Frontend Developer',
          description: 'Développeur React expérimenté',
          isFilled: false,
          createdAt: '2025-09-11T11:00:04.575Z',
          updatedAt: '2025-09-11T11:00:04.575Z',
        },
        project: {
          id: '9376e80c-057f-4350-ac75-caf0629ffb92',
          ownerId: '02qXDZGijgpJ3OvFvKYRGMPgo5nVmfP0',
          title: 'test',
          description: 'project de test',
          createdAt: '2025-09-11T11:00:04.575Z',
          updatedAt: '2025-09-11T11:00:04.575Z',
          image:
            'https://pub-9015c9fc95574da98f6e7b9d4555ae24.r2.dev/1752867560640-policier-lol.jpg',
          coverImages: [],
          readme: null,
        },
        appliedAt: '2025-09-11T11:28:49.841Z',
        keyFeatures: ['auth'],
      },
      {
        id: 'f3088827-7366-499e-9d89-c8b1577fcb86',
        userId: 'IWOt7BVMBxteq0dmoD8s7HnCofOEk8av',
        projectId: '9376e80c-057f-4350-ac75-caf0629ffb92',
        projectRoleId: '39b79c39-a9d3-4c75-acf5-ad23d4672256',
        keyFeatureId: '3029ac9b-a143-4b35-884e-d38cc9755647',
        status: 'REJECTED',
        motivationLetter: 'Je sui dev back je suis chau',
        rejectionReason: 'lol',
        decidedAt: '2025-09-12T10:27:45.341Z',
        createdAt: '2025-09-11T11:35:49.745Z',
        updatedAt: '2025-09-12T10:27:45.341Z',
        user: {
          name: 'LhourquinPro',
          image: 'https://avatars.githubusercontent.com/u/78709164?v=4',
        },
        projectRole: {
          id: '39b79c39-a9d3-4c75-acf5-ad23d4672256',
          projectId: '9376e80c-057f-4350-ac75-caf0629ffb92',
          title: 'Backend Developer',
          description: 'Développeur php junior',
          isFilled: false,
          createdAt: '2025-09-11T11:00:04.575Z',
          updatedAt: '2025-09-11T11:00:04.575Z',
        },
        project: {
          id: '9376e80c-057f-4350-ac75-caf0629ffb92',
          ownerId: '02qXDZGijgpJ3OvFvKYRGMPgo5nVmfP0',
          title: 'test',
          description: 'project de test',
          createdAt: '2025-09-11T11:00:04.575Z',
          updatedAt: '2025-09-11T11:00:04.575Z',
          image:
            'https://pub-9015c9fc95574da98f6e7b9d4555ae24.r2.dev/1752867560640-policier-lol.jpg',
          coverImages: [],
          readme: null,
        },
        appliedAt: '2025-09-11T11:35:49.745Z',
        keyFeatures: ['auth'],
      },
    ],
  })
  async getApplicationsByUserId(@Session() session: UserSession) {
    console.log('result getApplicationsByUserId');
    const userId = session.user.id;
    const result =
      await this.applicationService.getApplicationsByUserId(userId);
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }
    return result.value;
  }

  @Patch('me/:id')
  @ApiOperation({ summary: 'Cancel application by the user' })
  @ApiParam({ name: 'id', description: 'Application ID' })
  @ApiResponse({
    status: 200,
    description: '',
  })
  @ApiResponse({
    status: 400,
    description: 'You can only cancel your own applications',
    example: {
      statusCode: 400,
      message: 'Vous ne pouvez annuler que vos propres candidatures',
    },
  })
  async cancelApplication(
    @Param('id') id: string,
    @Session() session: UserSession,
  ) {
    const userId = session.user.id;
    const result = await this.applicationService.cancelApplication({
      userId,
      applicationId: id,
    });
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }
    return result.value;
  }
  @Get(':id')
  async getApplicationById(@Param('id') id: string) {
    const result = await this.applicationService.getApplicationById(id);
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }
    return result.value;
  }
  /*******  APPLICATION BY ROLE ID ********/

  @Get('roles/:roleId')
  @ApiOperation({ summary: 'Get application by role id' })
  @ApiParam({ name: 'roleId', description: 'Role ID' })
  @ApiResponse({
    status: 200,
    description: 'Application by role id',
    example: {
      id: 'f7d4d991-9ead-43ce-b03b-8260bdcf03c4',
      userId: 'IWOt7BVMBxteq0dmoD8s7HnCofOEk8av',
      projectId: '9376e80c-057f-4350-ac75-caf0629ffb92',
      projectRoleId: 'fcacc499-6d1b-4eeb-925b-9218eed27ea2',
      keyFeatureId: '3029ac9b-a143-4b35-884e-d38cc9755647',
      status: 'CANCELLED',
      motivationLetter: 'Je souhaite rejoindre car je suis motivé',
      rejectionReason: null,
      decidedAt: '2025-09-11T15:28:20.290Z',
      createdAt: '2025-09-11T11:28:49.841Z',
      updatedAt: '2025-09-11T15:28:20.290Z',
      user: {
        name: 'LhourquinPro',
        image: 'https://avatars.githubusercontent.com/u/78709164?v=4',
      },
      projectRole: {
        id: 'fcacc499-6d1b-4eeb-925b-9218eed27ea2',
        projectId: '9376e80c-057f-4350-ac75-caf0629ffb92',
        title: 'Frontend Developer',
        description: 'Développeur React expérimenté',
        isFilled: false,
        createdAt: '2025-09-11T11:00:04.575Z',
        updatedAt: '2025-09-11T11:00:04.575Z',
      },
      project: {
        id: '9376e80c-057f-4350-ac75-caf0629ffb92',
        ownerId: '02qXDZGijgpJ3OvFvKYRGMPgo5nVmfP0',
        title: 'test',
        description: 'project de test',
        createdAt: '2025-09-11T11:00:04.575Z',
        updatedAt: '2025-09-11T11:00:04.575Z',
        image:
          'https://pub-9015c9fc95574da98f6e7b9d4555ae24.r2.dev/1752867560640-policier-lol.jpg',
        coverImages: [],
        readme: null,
      },
      appliedAt: '2025-09-11T11:28:49.841Z',
      keyFeatures: ['auth'],
    },
  })
  async getApplicationByRoleId(
    @Session() session: UserSession,
    @Param('roleId') roleId: string,
  ) {
    console.log('getApplicationByRoleId');
    const userId = session.user.id;
    const result = await this.applicationService.getApplicationByRoleId(
      roleId,
      userId,
    );
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }
    return result.value;
  }

  /*******  PROJECT ********/

  @ApiOperation({ summary: 'Get applications by project id for the owner' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiResponse({
    status: 200,
    description: 'Applications by project id for the owner',
    example: [
      {
        id: 'f7d4d991-9ead-43ce-b03b-8260bdcf03c4',
        userId: 'IWOt7BVMBxteq0dmoD8s7HnCofOEk8av',
        projectId: '9376e80c-057f-4350-ac75-caf0629ffb92',
        projectRoleId: 'fcacc499-6d1b-4eeb-925b-9218eed27ea2',
        keyFeatureId: '3029ac9b-a143-4b35-884e-d38cc9755647',
        status: 'CANCELLED',
        motivationLetter: 'Je souhaite rejoindre car je suis motivé',
        rejectionReason: null,
        decidedAt: '2025-09-11T15:28:20.290Z',
        createdAt: '2025-09-11T11:28:49.841Z',
        updatedAt: '2025-09-11T15:28:20.290Z',
        user: {
          name: 'LhourquinPro',
          image: 'https://avatars.githubusercontent.com/u/78709164?v=4',
        },
        projectRole: {
          title: 'Frontend Developer',
          description: 'Développeur React expérimenté',
          techStacks: [
            {
              id: '2',
              name: 'Next.js',
              iconUrl:
                'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
              type: 'TECH',
            },
          ],
        },
        project: {
          title: 'test',
          description: 'project de test',
          image:
            'https://pub-9015c9fc95574da98f6e7b9d4555ae24.r2.dev/1752867560640-policier-lol.jpg',
          owner: {
            id: '02qXDZGijgpJ3OvFvKYRGMPgo5nVmfP0',
            name: 'Lucalhost',
            githubLogin: 'Lhourquin',
            email: 'lhourquin@gmail.com',
            emailVerified: true,
            image: 'https://avatars.githubusercontent.com/u/45101981?v=4',
            createdAt: '2025-09-11T10:54:20.309Z',
            updatedAt: '2025-09-11T15:26:33.914Z',
          },
        },
        appliedAt: '2025-09-11T11:28:49.841Z',
        keyFeatures: ['auth'],
      },
      {
        id: 'f3088827-7366-499e-9d89-c8b1577fcb86',
        userId: 'IWOt7BVMBxteq0dmoD8s7HnCofOEk8av',
        projectId: '9376e80c-057f-4350-ac75-caf0629ffb92',
        projectRoleId: '39b79c39-a9d3-4c75-acf5-ad23d4672256',
        keyFeatureId: '3029ac9b-a143-4b35-884e-d38cc9755647',
        status: 'REJECTED',
        motivationLetter: 'Je sui dev back je suis chau',
        rejectionReason: 'lol',
        decidedAt: '2025-09-12T10:27:45.341Z',
        createdAt: '2025-09-11T11:35:49.745Z',
        updatedAt: '2025-09-12T10:27:45.341Z',
        user: {
          name: 'LhourquinPro',
          image: 'https://avatars.githubusercontent.com/u/78709164?v=4',
        },
        projectRole: {
          title: 'Backend Developer',
          description: 'Développeur php junior',
          techStacks: [
            {
              id: '2',
              name: 'Next.js',
              iconUrl:
                'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
              type: 'TECH',
            },
          ],
        },
        project: {
          title: 'test',
          description: 'project de test',
          image:
            'https://pub-9015c9fc95574da98f6e7b9d4555ae24.r2.dev/1752867560640-policier-lol.jpg',
          owner: {
            id: '02qXDZGijgpJ3OvFvKYRGMPgo5nVmfP0',
            name: 'Lucalhost',
            githubLogin: 'Lhourquin',
            email: 'lhourquin@gmail.com',
            emailVerified: true,
            image: 'https://avatars.githubusercontent.com/u/45101981?v=4',
            createdAt: '2025-09-11T10:54:20.309Z',
            updatedAt: '2025-09-11T15:26:33.914Z',
          },
        },
        appliedAt: '2025-09-11T11:35:49.745Z',
        keyFeatures: ['auth'],
      },
    ],
  })
  @Get('me/projects/:projectId')
  async getApplicationsByProjectId(
    @Param('projectId') projectId: string,
    @Session() session: UserSession,
  ) {
    const userId = session.user.id;
    const result = await this.applicationService.getApplicationsByProjectId(
      projectId,
      userId,
    );
    console.log('result getApplicationsByProjectId', result);
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }
    return result.value;
  }

  /*******  ACCEPT OR REJECT ********/
  @Patch(':id')
  @ApiOperation({ summary: 'Accept or reject application' })
  @ApiParam({ name: 'id', description: 'Application ID' })
  @ApiBody({ type: AcceptOrRejectApplicationRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Application accepted or rejected successfully',
  })
  @ApiResponse({
    status: 400,
    description:
      'If you are not the owner of the project, you cannot reject the application',
    example: {
      statusCode: 400,
      message: 'Vous ne pouvez pas rejeter cette candidature',
    },
  })
  async acceptOrRejectApplication(
    @Param('id') id: string,
    @Body() body: AcceptOrRejectApplicationRequestDto,
    @Session() session: UserSession,
  ) {
    const userId = session.user.id;
    if (body.status === ApplicationStatus.ACCEPTED) {
      const result = await this.applicationService.acceptApplication({
        userId,
        applicationId: id,
      });
      if (!result.success) {
        throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
      }
      return result.value;
    } else if (body.status === ApplicationStatus.REJECTED) {
      const result = await this.applicationService.rejectApplication({
        userId,
        applicationId: id,
        rejectionReason: body.rejectionReason,
      });
      if (!result.success) {
        throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
      }
      return result.value;
    }
  }
}
