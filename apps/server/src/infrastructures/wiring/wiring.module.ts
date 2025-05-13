import { Module } from '@nestjs/common';
import { UserWiringModule } from '@/infrastructures/wiring/user/user-wiring.module';
import { ProjectWiringModule } from '@/infrastructures/wiring/project/project-wiring.module';
@Module({
  imports: [UserWiringModule, ProjectWiringModule],
  providers: [],
  exports: [UserWiringModule, ProjectWiringModule],
})
export class WiringModule {}
