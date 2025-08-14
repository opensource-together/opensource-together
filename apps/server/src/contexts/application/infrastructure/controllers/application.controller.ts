import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Patch,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Session } from 'supertokens-nestjs';
import {
  AcceptRejectApplicationRequestDto,
  ApplicationStatus,
} from './dto/accept-reject-application-request.dto';
import { Result } from '@/libs/result';
import { ProjectRoleApplication } from '@/contexts/project/bounded-contexts/project-role-application/domain/project-role-application.entity';
import { AcceptUserApplicationCommand } from '@/contexts/project/bounded-contexts/project-role-application/use-cases/commands/accept-user-application.command';
import { RejectUserApplicationCommand } from '@/contexts/project/bounded-contexts/project-role-application/use-cases/commands/reject-user-application.command';

@Controller('application')
export class ApplicationController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':id')
  @ApiOperation({ summary: 'Accept or reject application' })
  @ApiParam({ name: 'id', description: 'Application ID' })
  @ApiResponse({
    status: 200,
    description: 'Application accepted or rejected successfully',
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
    @Body() body: AcceptRejectApplicationRequestDto,
    @Session('userId') userId: string,
  ) {
    if (body.status === ApplicationStatus.ACCEPTED) {
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
    } else if (body.status === ApplicationStatus.REJECTED) {
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
