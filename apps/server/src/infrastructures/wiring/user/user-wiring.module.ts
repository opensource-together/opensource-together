import { RepositoryModule } from '@/infrastructures/repositories/repository.module';
import { Module } from '@nestjs/common';
import { userApplicationContainer } from '@/application/user/user.application';
@Module({
  imports: [RepositoryModule],
  providers: [...userApplicationContainer],
  exports: [...userApplicationContainer],
})
export class UserWiringModule {}
