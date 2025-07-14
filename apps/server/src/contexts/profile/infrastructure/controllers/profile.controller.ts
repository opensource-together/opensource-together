import {
  Controller,
  Get,
  NotFoundException,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Session, PublicAccess } from 'supertokens-nestjs';
import { Result } from '@/libs/result';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  FindProfileByIdQuery,
  FullProfileData,
} from '@/contexts/profile/use-cases/queries/find-profile-by-id.query';
import { ProfileResponseDto } from '@/contexts/profile/infrastructure/controllers/dtos/profile-response.dto';
import { ProfileMapper } from '@/contexts/profile/infrastructure/controllers/mappers/profile.mapper';
import { FindProjectsByUserIdQuery } from '@/contexts/project/use-cases/queries/find-by-user-id/find-projects-by-user-id.handler';
import { GetProjectsByUserIdResponseDto } from '@/contexts/project/infrastructure/controllers/dto/get-projects-by-user-id-response.dto';
import { Project } from '@/contexts/project/domain/project.entity';

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

  // Route publique pour récupérer tous les projets d'un profil (AVANT la route générale :id)
  @PublicAccess()
  @Get(':profileId/projects')
  @ApiOperation({ summary: 'Get all projects for a specific profile' })
  @ApiResponse({ status: 200, description: 'Projects retrieved successfully' })
  async getProjectsByProfileId(@Param('profileId') profileId: string) {
    const result: Result<Project[], string> = await this.queryBus.execute(
      new FindProjectsByUserIdQuery(profileId),
    );

    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return GetProjectsByUserIdResponseDto.toResponse(result.value);
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
