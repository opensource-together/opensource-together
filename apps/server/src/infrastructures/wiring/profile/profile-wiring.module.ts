import { Module } from '@nestjs/common';
import { profileApplication } from '@/application/profile/profile.application';
import { RepositoryModule } from '@/infrastructures/repositories/repository.module';

@Module({
  imports: [RepositoryModule],
  providers: [...profileApplication],
})
export class ProfileWiringModule {}
