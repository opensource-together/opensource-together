import { UpsertProfileDto } from '@/features/profile/controllers/dto/upsert-profile.dto';
import { Profile as DomainProfile } from '@/features/profile/domain/profile';
import { CompleteProfile } from '@/features/profile/repositories/profile.repository.interface';
import { ProfileService } from '@/features/profile/services/profile.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, Session, UserSession } from '@thallesp/nestjs-better-auth';
import { CreateProfileDocs } from './docs/create-profile.swagger.decorator';
import { DeleteProfileDocs } from './docs/delete-my-profile.swagger.decorator';
import { GetMyProfileDocs } from './docs/get-my-profile.swagger.decorator';
import { GetProfileByIdDocs } from './docs/get-profile-by-id.swagger.decorator';
import { UpdateProfileDocs } from './docs/update-profile.swagger.decorator';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(AuthGuard)
  @Post()
  @CreateProfileDocs()
  async createProfile(
    @Session() session: UserSession,
    @Body() data: UpsertProfileDto,
  ): Promise<DomainProfile> {
    const result = await this.profileService.upsertProfile(
      session.session.userId,
      data,
    );
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return result.value;
  }

  @UseGuards(AuthGuard)
  @Patch()
  @UpdateProfileDocs()
  async updateProfile(
    @Session() session: UserSession,
    @Body() data: UpsertProfileDto,
  ): Promise<DomainProfile> {
    const result = await this.profileService.upsertProfile(
      session.session.userId,
      data,
    );
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return result.value;
  }

  @UseGuards(AuthGuard)
  @Get('me')
  @GetMyProfileDocs()
  async getMyProfile(
    @Session() session: UserSession,
  ): Promise<CompleteProfile> {
    const result = await this.profileService.getProfileByUserId(
      session.session.userId,
    );
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return result.value;
  }

  @Get(':id')
  @GetProfileByIdDocs()
  async getProfileById(@Param('id') id: string): Promise<CompleteProfile> {
    const result = await this.profileService.getProfileByUserId(id);
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.NOT_FOUND);
    }
    return result.value;
  }

  @UseGuards(AuthGuard)
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @DeleteProfileDocs()
  async deleteProfile(@Session() session: UserSession): Promise<void> {
    const result = await this.profileService.deleteProfile(
      session.session.userId,
    );
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return;
  }
}
