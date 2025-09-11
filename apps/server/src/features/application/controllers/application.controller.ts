import { Body, Controller, Param, Post, UseGuards, Get } from '@nestjs/common';
import { ApplicationService } from '../services/application.service';
import { UserSession, Session, AuthGuard } from '@thallesp/nestjs-better-auth';
import { HttpException, HttpStatus, Patch } from '@nestjs/common';
import {
  AcceptOrRejectApplicationRequestDto,
  ApplicationStatus,
} from './dto/accept-reject-application.dto';
@UseGuards(AuthGuard)
@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}
  /*******  APPLY TO PROJECT ROLE ********/
  @Post('roles/:roleId')
  async applyToProjectRole(
    @Body()
    body: {
      projectId: string;
      motivationLetter?: string;
      keyFeatures: string[];
    },
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
  async getApplicationByRoleId(@Param('roleId') roleId: string) {
    const result = await this.applicationService.getApplicationByRoleId(roleId);
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
