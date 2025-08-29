import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, Session, UserSession } from '@thallesp/nestjs-better-auth';
import { UpsertProfileDto } from '@/features/profile/controllers/dto/upsert-profile.dto';
import { ProfileService } from '@/features/profile/services/profile.service';
import { Result } from '@/libs/result';
import { Profile as DomainProfile } from '@/features/profile/domain/profile';
import { CompleteProfile } from '@/features/profile/repositories/profile.repository.interface';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(AuthGuard)
  @Post()
  upsertProfile(
    @Session() session: UserSession,
    @Body() data: UpsertProfileDto,
  ): Promise<Result<DomainProfile, string>> {
    return this.profileService.upsertProfile(session.session.userId, data);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getMyProfile(
    @Session() session: UserSession,
  ): Promise<Result<CompleteProfile, string>> {
    return this.profileService.getProfileByUserId(session.session.userId);
  }

  @Get(':id')
  async getProfileById(
    @Param('id') id: string,
  ): Promise<Result<CompleteProfile, string>> {
    return this.profileService.getProfileByUserId(id);
  }

  @UseGuards(AuthGuard)
  @Delete()
  deleteProfile(@Session() session: UserSession): Promise<void> {
    return this.profileService.deleteProfile(session.session.userId);
  }
}
