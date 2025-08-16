import { Profile } from '@/contexts/profile/domain/profile.entity';
import { ProfileResponseDto } from './dtos/profile-response.dto';
import { UpdateProfileRequestDto } from './dtos/update-profile-request.dto';
import { UpdateProfileResponseDto } from './dtos/update-profile-response.dto';
import { ProfileService, FullProfileData } from '../services/profile.service';
import { Project } from '@/contexts/project/domain/project.entity';
import { GetProjectsByUserIdResponseDto } from '@/contexts/project/infrastructure/controllers/dto/get-projects-by-user-id-response.dto';
import { FindProjectsByUserIdQuery } from '@/contexts/project/use-cases/queries/find-by-user-id/find-projects-by-user-id.handler';
import { Result } from '@/libs/result';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { PublicAccess, Session } from 'supertokens-nestjs';
import {
  DeleteMyProfileSwagger,
  DeleteProfileSwagger,
  GetMyProfileSwagger,
  GetProfileByIdSwagger,
  GetProjectsByProfileIdSwagger,
  UpdateProfileSwagger,
} from './decorators/profile-swagger.decorators';
import { ProfileMapper } from './mappers/profile.mapper';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly queryBus: QueryBus, // Still needed for projects
  ) {}

  @Get('me')
  @GetMyProfileSwagger()
  async getMyProfile(
    @Session('userId') userId: string,
  ): Promise<ProfileResponseDto> {
    return this.getProfileById(userId);
  }

  @PublicAccess()
  @Get(':profileId/projects')
  @GetProjectsByProfileIdSwagger()
  async getProjectsByProfileId(@Param('profileId') profileId: string) {
    const result: Result<Project[], string> = await this.queryBus.execute(
      new FindProjectsByUserIdQuery(profileId),
    );

    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return GetProjectsByUserIdResponseDto.toResponse(result.value);
  }

  @PublicAccess()
  @Get(':id')
  @GetProfileByIdSwagger()
  async getProfileById(@Param('id') id: string): Promise<ProfileResponseDto> {
    const findProfileByIdQueryResult: Result<FullProfileData, string> =
      await this.profileService.findProfileById(id);

    if (!findProfileByIdQueryResult.success) {
      throw new NotFoundException(findProfileByIdQueryResult.error);
    }

    return ProfileMapper.toDto(findProfileByIdQueryResult.value);
  }

  @Patch()
  @UpdateProfileSwagger()
  async updateProfile(
    @Session('userId') currentUserId: string,
    @Body() updateProfileDto: UpdateProfileRequestDto,
  ): Promise<ProfileResponseDto> {
    const result: Result<Profile, string> =
      await this.profileService.updateProfile(currentUserId, updateProfileDto);

    if (!result.success) {
      if (result.error === 'Profile not found') {
        throw new NotFoundException(result.error);
      }
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return UpdateProfileResponseDto.toResponse(result.value);
  }

  @Delete('me')
  @DeleteMyProfileSwagger()
  async deleteMyProfile(
    @Session('userId') userId: string,
  ): Promise<{ message: string }> {
    const result: Result<boolean, string> =
      await this.profileService.deleteProfile(userId);

    if (!result.success) {
      if (result.error === 'Profile not found') {
        throw new NotFoundException(result.error);
      }
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return { message: 'Profile deleted successfully' };
  }

  @Delete(':id')
  @DeleteProfileSwagger()
  async deleteProfile(
    @Session('userId') currentUserId: string,
    @Param('id') profileId: string,
  ): Promise<{ message: string }> {
    if (currentUserId !== profileId) {
      throw new ForbiddenException(
        'You are not allowed to delete this profile',
      );
    }

    const result: Result<boolean, string> =
      await this.profileService.deleteProfile(profileId);

    if (!result.success) {
      if (result.error === 'Profile not found') {
        throw new NotFoundException(result.error);
      }
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return { message: 'Profile deleted successfully' };
  }
}
