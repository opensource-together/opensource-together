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
      id: '123e4567-e89b-12d3-a456-426614174000',
      projectId: '123e4567-e89b-12d3-a456-426614174000',
      projectRoleId: '123e4567-e89b-12d3-a456-426614174000',
      keyFeatures: ['123e4567-e89b-12d3-a456-426614174000'],
      motivationLetter: 'I am very motivated to join this project',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Application already exists',
    example: {
      statusCode: 400,
      message: 'PENDING',
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

  @Get('projects/:projectId')
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
