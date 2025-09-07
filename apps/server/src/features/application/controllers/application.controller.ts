import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApplicationService } from '../services/application.service';
import { UserSession, Session, AuthGuard } from '@thallesp/nestjs-better-auth';
import { HttpException, HttpStatus } from '@nestjs/common';

@UseGuards(AuthGuard)
@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post('roles/:roleId')
  async createApplication(
    @Body()
    body: {
      projectId: string;
      motivationLetter?: string;
    },
    @Param('roleId') roleId: string,
    @Session() session: UserSession,
  ) {
    const userId = session.user.id;
    const result = await this.applicationService.applyToProjectRole({
      userId,
      projectId: body.projectId,
      projectRoleId: roleId,
      motivationLetter: body.motivationLetter || '',
    });
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }
    return result.value;
  }
}
