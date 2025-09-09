import { Module, OnModuleInit } from '@nestjs/common';
import { ProfileService } from '@/features/profile/services/profile.service';
import { PrismaProfileRepository } from '@/features/profile/repositories/prisma.profile.repository';
import { setProfileService } from '@/features/profile/services/profile.holder';
import { PrismaModule } from '../../../prisma/prisma.module';
import { ProfileController } from '@/features/profile/controllers/profile.controller';

@Module({
  imports: [PrismaModule],
  exports: [ProfileService, PrismaProfileRepository],
  providers: [ProfileService, PrismaProfileRepository],
  controllers: [ProfileController],
})
export class ProfileModule implements OnModuleInit {
  constructor(private readonly profileService: ProfileService) {}

  onModuleInit(): void {
    setProfileService(this.profileService);
  }
}
