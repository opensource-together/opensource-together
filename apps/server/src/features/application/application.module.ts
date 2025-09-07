import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { ApplicationService } from './services/application.service';
import { ApplicationController } from './controllers/application.controller';
import { APPLICATION_REPOSITORY } from './repositories/application.repository.interface';
import { PrismaApplicationRepository } from './repositories/prisma.application.repository';
import { PrismaModule } from 'prisma/prisma.module';
import { ProjectModule } from '../project/project.module';
@Module({
  imports: [PrismaModule, UserModule, ProjectModule],
  controllers: [ApplicationController],
  providers: [
    ApplicationService,
    { provide: APPLICATION_REPOSITORY, useClass: PrismaApplicationRepository },
  ],
  exports: [ApplicationService, APPLICATION_REPOSITORY],
})
export class ApplicationModule {}
