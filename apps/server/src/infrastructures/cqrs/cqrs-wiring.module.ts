import { Module } from '@nestjs/common';
import { UserCqrsModule } from '@infrastructures/cqrs/user/user-cqrs.module';
import { ProjectCqrsModule } from '@infrastructures/cqrs/project/project-cqrs.module';

@Module({
  imports: [UserCqrsModule, ProjectCqrsModule],
  providers: [],
  exports: [UserCqrsModule, ProjectCqrsModule],
})
export class CqrsWiringModule {}
