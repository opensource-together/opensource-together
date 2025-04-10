import { Module } from '@nestjs/common';
import { UserCqrsModule } from '@infrastructures/cqrs/user/user-cqrs.module';
@Module({
  imports: [UserCqrsModule],
  providers: [],
  exports: [],
})
export class CqrsWiringModule {}
