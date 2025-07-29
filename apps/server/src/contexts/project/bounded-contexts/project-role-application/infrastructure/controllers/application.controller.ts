import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  //   Param,
  //   Patch,
  //   Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetAllApplicationsByProjectsOwnerQuery } from '../../use-cases/queries/get-all-applications-by-projects-owner.query';
// import { AcceptUserApplicationCommand } from '../../use-cases/commands/accept-user-application.command';
// import { RejectUserApplicationCommand } from '../../use-cases/commands/reject-user-application.command';
import { Session } from 'supertokens-nestjs';
import { ProjectRoleApplication } from '../../domain/project-role-application.entity';
import { Result } from '@/libs/result';
@Controller('applications')
export class ApplicationController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}
  @Get()
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
  //   @Get(':id')
  //   async getApplicationDetails(@Param('id') id: string) {
  //     return this.queryBus.execute(new GetApplicationQuery(id));
  //   }
  //   @Patch(':id')
  //   async acceptOrRejectApplication(
  //     @Param('id') id: string,
  //     @Body() body: UpdateApplicationDto,
  //   ) {
  //     return this.commandBus.execute(new UpdateApplicationCommand(id, body));
  //   }
}
