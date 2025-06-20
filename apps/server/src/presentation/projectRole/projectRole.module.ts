import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProjectRoleController } from './projectRole.controller';

@Module({
  imports: [CqrsModule],
  controllers: [ProjectRoleController],
})
export class ProjectRoleModule {}
