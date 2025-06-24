import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Session } from 'supertokens-nestjs';
import { Result } from '@/shared/result';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  FindProfileByIdQuery,
  FullProfileData,
} from '@/application/profile/queries/find-profile-by-id.query';
import { ProfileResponseDto } from './dtos/profile-response.dto';
import { ProfileMapper } from './mappers/profile.mapper';

@Controller('profile')
export class ProfileController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('me')
  @ApiOperation({ summary: "Get the current user's profile" })
  async getMyProfile(
    @Session('userId') userId: string,
  ): Promise<ProfileResponseDto> {
    return this.getProfileById(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a profile by its ID' })
  @ApiResponse({ status: 200, description: 'Profile found' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getProfileById(@Param('id') id: string): Promise<ProfileResponseDto> {
    const findProfileByIdQuery = new FindProfileByIdQuery(id);
    const findProfileByIdQueryResult: Result<FullProfileData, string> =
      await this.queryBus.execute(findProfileByIdQuery);

    if (!findProfileByIdQueryResult.success) {
      throw new NotFoundException(findProfileByIdQueryResult.error);
    }

    return ProfileMapper.toDto(findProfileByIdQueryResult.value);
  }
}
