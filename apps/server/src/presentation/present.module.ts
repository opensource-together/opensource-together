import { Module } from '@nestjs/common';
import { ProjectModule } from './project/project.module';
@Module({
  imports: [ProjectModule],
  controllers: [],
  providers: [],
})
export class PresentModule {}
